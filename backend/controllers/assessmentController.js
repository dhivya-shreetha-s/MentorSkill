import { getSupabaseClientWithToken } from '../services/supabaseService.js';
import { ASSESSMENTS } from '../data/seedData.js';
import { memoryStore } from '../utils/memoryStore.js';
import { runAssessmentAdaptation } from '../orchestrator/agentOrchestrator.js';

export const getAssessments = async (req, res) => {
  try {
    let list = [];
    try {
      if (req.token && req.token !== 'demo-token') {
        const supabase = getSupabaseClientWithToken(req.token);
        const { data, error } = await supabase.from('assessments').select('*').order('topic');
        if (!error && data && data.length > 0) {
          list = data;
        }
      }
    } catch (e) {}

    // Fall back to seed catalog if empty
    if (list.length === 0) {
      list = ASSESSMENTS;
    }

    // Attach questions to each assessment so frontend has them immediately
    const enriched = list.map(item => {
      const matchingSeed = ASSESSMENTS.find(s => 
        s.id === item.id || 
        s.topic?.toLowerCase() === item.topic?.toLowerCase() ||
        s.title?.toLowerCase() === item.title?.toLowerCase()
      );
      const rawQuestions = (item.questions && item.questions.length > 0)
        ? item.questions
        : (matchingSeed ? matchingSeed.questions : []);

      const safeQuestions = rawQuestions.map(({ correct_answer, ...q }) => q);

      return {
        ...item,
        question_count: safeQuestions.length,
        questions: safeQuestions
      };
    });

    res.json({ assessments: enriched });
  } catch (err) {
    const list = ASSESSMENTS.map(({ questions, ...rest }) => ({
      ...rest,
      question_count: questions.length,
      questions: questions.map(({ correct_answer, ...q }) => q)
    }));
    res.json({ assessments: list });
  }
};

export const getAssessmentWithQuestions = async (req, res) => {
  try {
    const { id } = req.params;
    let assessment = null;
    let questions = [];

    try {
      if (req.token && req.token !== 'demo-token') {
        const supabase = getSupabaseClientWithToken(req.token);
        const { data: aData } = await supabase.from('assessments').select('*').eq('id', id).single();
        if (aData) {
          assessment = aData;
          const { data: qData } = await supabase.from('assessment_questions').select('*').eq('assessment_id', id).order('difficulty');
          if (qData && qData.length > 0) {
            questions = qData;
          }
        }
      }
    } catch (e) {}

    // Match in seed data if questions empty
    if (!questions || questions.length === 0) {
      const found = ASSESSMENTS.find(a => 
        a.id === id || 
        a.topic?.toLowerCase() === id?.toLowerCase() ||
        a.title?.toLowerCase().includes(id?.toLowerCase()) ||
        id?.toLowerCase().includes(a.topic?.toLowerCase() || '')
      );
      if (found) {
        if (!assessment) assessment = found;
        questions = found.questions;
      }
    }

    if (assessment && questions?.length > 0) {
      const safeQuestions = questions.map(({ correct_answer, ...q }) => q);
      return res.json({ assessment, questions: safeQuestions });
    }

    res.status(404).json({ error: 'Assessment not found' });
  } catch (err) {
    const found = ASSESSMENTS.find(a => a.id === req.params.id || a.topic?.toLowerCase() === req.params.id?.toLowerCase());
    if (found) {
      const safeQuestions = found.questions.map(({ correct_answer, ...q }) => q);
      return res.json({ assessment, questions: safeQuestions });
    }
    res.status(500).json({ error: err.message });
  }
};

export const submitAssessment = async (req, res) => {
  try {
    const assessmentId = req.params.id || req.body.assessmentId;
    const { answers, timeTaken, score: clientScore, passed: clientPassed, topic: clientTopic } = req.body;
    const userId = req.user?.id || 'demo-user-1';

    // Find assessment questions to grade
    let questions = [];
    const found = ASSESSMENTS.find(a => 
      a.id === assessmentId || 
      a.topic?.toLowerCase() === assessmentId?.toLowerCase() ||
      (clientTopic && a.topic?.toLowerCase() === clientTopic.toLowerCase())
    );
    if (found) {
      questions = found.questions;
    }

    let correct = 0;
    const weakTopics = [];
    const strongTopics = [];
    const topicScores = {};

    if (answers && typeof answers === 'object') {
      questions.forEach((q, idx) => {
        const userAns = answers[q.id] !== undefined ? answers[q.id] : answers[idx];
        const topic = q.topic || found?.topic || 'General';
        if (!topicScores[topic]) topicScores[topic] = { correct: 0, total: 0 };
        topicScores[topic].total++;

        const correctOptLetter = q.correct_answer;
        const correctIdx = ['A', 'B', 'C', 'D'].indexOf(correctOptLetter);
        const correctText = q.options ? q.options[correctOptLetter] : null;

        if (
          userAns === correctOptLetter || 
          userAns === correctIdx || 
          userAns === correctText
        ) {
          correct++;
          topicScores[topic].correct++;
        }
      });
    }

    let score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : (clientScore || 75);
    if (clientScore !== undefined && questions.length === 0) {
      score = clientScore;
    }
    const passed = score >= 70;

    Object.entries(topicScores).forEach(([topic, { correct: c, total: t }]) => {
      const ratio = c / t;
      if (ratio < 0.5) weakTopics.push(topic);
      else if (ratio >= 0.8) strongTopics.push(topic);
    });

    const resultRecord = {
      id: `ar-${Date.now()}`,
      user_id: userId,
      assessment_id: assessmentId,
      assessment_topic: found?.topic || clientTopic || 'General',
      score,
      total_questions: questions.length || 5,
      correct_answers: correct,
      time_taken_minutes: timeTaken || 10,
      answers,
      weak_topics: weakTopics,
      strong_topics: strongTopics,
      passed,
      performance_feedback: score >= 80 
        ? 'Excellent proficiency demonstrated! You are ready to advance to higher-level concepts.'
        : score >= 50
        ? 'Solid foundational knowledge. Some reinforcement needed on weak topics before advancing.'
        : 'Remedial study required. Additional practice exercises have been scheduled.',
      created_at: new Date().toISOString()
    };

    // Save in memory
    if (!memoryStore.assessmentResults[userId]) memoryStore.assessmentResults[userId] = [];
    memoryStore.assessmentResults[userId].unshift(resultRecord);

    // Try Supabase insert
    try {
      if (req.token && req.token !== 'demo-token') {
        const supabase = getSupabaseClientWithToken(req.token);
        await supabase.from('assessment_results').insert(resultRecord);
      }
    } catch (e) {}

    // Trigger AI Assessment Adaptation in background
    let adaptation = null;
    try {
      adaptation = await runAssessmentAdaptation(userId, req.token, resultRecord.id, resultRecord);
    } catch (e) {
      console.log('Adaptation ran with fallback:', e.message);
    }

    res.json({
      result: resultRecord,
      score,
      passed,
      weakTopics,
      strongTopics,
      adaptation
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAssessmentHistory = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user-1';
    try {
      if (req.token && req.token !== 'demo-token') {
        const supabase = getSupabaseClientWithToken(req.token);
        const { data, error } = await supabase.from('assessment_results').select('*, assessments(title, topic)').eq('user_id', userId).order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return res.json({ history: data });
        }
      }
    } catch (e) {}

    res.json({ history: memoryStore.assessmentResults[userId] || [] });
  } catch (err) {
    const userId = req.user?.id || 'demo-user-1';
    res.json({ history: memoryStore.assessmentResults[userId] || [] });
  }
};