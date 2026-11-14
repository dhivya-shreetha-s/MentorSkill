import { getSupabaseClientWithToken } from '../services/supabaseService.js';
import { ASSESSMENTS } from '../data/seedData.js';
import { memoryStore } from '../utils/memoryStore.js';
import { runAssessmentAdaptation } from '../orchestrator/agentOrchestrator.js';

export const getAssessments = async (req, res) => {
  try {
    const supabase = getSupabaseClientWithToken(req.token);
    const { data, error } = await supabase.from('assessments').select('*').order('topic');
    if (!error && data && data.length > 0) {
      return res.json({ assessments: data });
    }
    // Return seed assessments (without answers)
    const list = ASSESSMENTS.map(({ questions, ...rest }) => ({
      ...rest,
      question_count: questions.length
    }));
    res.json({ assessments: list });
  } catch (err) {
    const list = ASSESSMENTS.map(({ questions, ...rest }) => ({
      ...rest,
      question_count: questions.length
    }));
    res.json({ assessments: list });
  }
};

export const getAssessmentWithQuestions = async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseClientWithToken(req.token);
    const { data: assessment, error: ae } = await supabase.from('assessments').select('*').eq('id', id).single();
    const { data: questions, error: qe } = await supabase.from('assessment_questions').select('*').eq('assessment_id', id).order('difficulty');

    if (!ae && !qe && assessment && questions?.length > 0) {
      const safeQuestions = questions.map(({ correct_answer, ...q }) => q);
      return res.json({ assessment, questions: safeQuestions });
    }

    // Match in seed data
    const found = ASSESSMENTS.find(a => a.id === id || a.topic.toLowerCase() === id.toLowerCase());
    if (found) {
      const safeQuestions = found.questions.map(({ correct_answer, ...q }) => q);
      return res.json({ assessment: found, questions: safeQuestions });
    }

    res.status(404).json({ error: 'Assessment not found' });
  } catch (err) {
    const found = ASSESSMENTS.find(a => a.id === req.params.id || a.topic.toLowerCase() === req.params.id.toLowerCase());
    if (found) {
      const safeQuestions = found.questions.map(({ correct_answer, ...q }) => q);
      return res.json({ assessment: found, questions: safeQuestions });
    }
    res.status(500).json({ error: err.message });
  }
};

export const submitAssessment = async (req, res) => {
  try {
    const { assessmentId, answers, timeTaken } = req.body;
    const userId = req.user?.id || 'demo-user-1';

    // Find assessment questions to grade
    let questions = [];
    const found = ASSESSMENTS.find(a => a.id === assessmentId || a.topic.toLowerCase() === assessmentId.toLowerCase());
    if (found) {
      questions = found.questions;
    }

    let correct = 0;
    const weakTopics = [];
    const strongTopics = [];
    const topicScores = {};

    questions.forEach(q => {
      const userAns = answers[q.id];
      if (!topicScores[q.topic]) topicScores[q.topic] = { correct: 0, total: 0 };
      topicScores[q.topic].total++;
      if (userAns === q.correct_answer) {
        correct++;
        topicScores[q.topic].correct++;
      }
    });

    Object.entries(topicScores).forEach(([topic, { correct: c, total: t }]) => {
      const ratio = c / t;
      if (ratio < 0.5) weakTopics.push(topic);
      else if (ratio >= 0.8) strongTopics.push(topic);
    });

    const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 75;
    const passed = score >= 70;

    const resultRecord = {
      id: `ar-${Date.now()}`,
      user_id: userId,
      assessment_id: assessmentId,
      assessment_topic: found?.topic || 'General',
      score,
      total_questions: questions.length,
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
      const supabase = getSupabaseClientWithToken(req.token);
      await supabase.from('assessment_results').insert(resultRecord);
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
    const supabase = getSupabaseClientWithToken(req.token);
    const { data, error } = await supabase.from('assessment_results').select('*, assessments(title, topic)').eq('user_id', userId).order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return res.json({ history: data });
    }

    res.json({ history: memoryStore.assessmentResults[userId] || [] });
  } catch (err) {
    const userId = req.user?.id || 'demo-user-1';
    res.json({ history: memoryStore.assessmentResults[userId] || [] });
  }
};
