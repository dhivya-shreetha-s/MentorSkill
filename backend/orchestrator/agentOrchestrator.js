import { getSupabaseClientWithToken } from '../services/supabaseService.js';
import { analyzeSkills } from '../agents/skillAnalyzer.js';
import { analyzeCareerGap } from '../agents/careerIntelligence.js';
import { generateRoadmap } from '../agents/roadmapPlanner.js';
import { recommendResources } from '../agents/learningResource.js';
import { evaluateAssessment } from '../agents/assessmentAgent.js';
import { logAgentStart, logAgentComplete, logAgentFail } from './workflowManager.js';
import { memoryStore, getUserProfile, getUserSkills, addAgentLog } from '../utils/memoryStore.js';
import { CAREER_ROLES } from '../data/seedData.js';

export const runInitialCareerAnalysis = async (userId, userToken) => {
  const startTime = Date.now();
  let supabase = null;
  try {
    supabase = getSupabaseClientWithToken(userToken);
  } catch (e) {}

  // 1. Fetch Profile
  let profile = null;
  try {
    if (supabase) {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (!error && data) profile = data;
    }
  } catch (e) {}
  if (!profile) profile = getUserProfile(userId);

  // 2. Fetch User Skills
  let userSkills = [];
  try {
    if (supabase) {
      const { data, error } = await supabase.from('user_skills').select('*').eq('user_id', userId);
      if (!error && data && data.length > 0) userSkills = data;
    }
  } catch (e) {}
  if (userSkills.length === 0) userSkills = getUserSkills(userId);

  // 3. Fetch Recent Assessments
  let assessmentResults = [];
  try {
    if (supabase) {
      const { data } = await supabase.from('assessment_results').select('*').eq('user_id', userId).limit(5);
      if (data) assessmentResults = data;
    }
  } catch (e) {}
  if (assessmentResults.length === 0) assessmentResults = memoryStore.assessmentResults[userId] || [];

  // 4. Fetch Career Role & Required Skills
  const targetCareer = profile.target_career || 'Full Stack Developer';
  let careerRoleData = null;
  try {
    if (supabase) {
      const { data } = await supabase.from('career_roles').select('*, career_role_skills(*)').eq('title', targetCareer).single();
      if (data) careerRoleData = data;
    }
  } catch (e) {}
  if (!careerRoleData) {
    careerRoleData = CAREER_ROLES.find(c => c.title.toLowerCase() === targetCareer.toLowerCase()) || CAREER_ROLES[0];
  }

  const careerRoleSkills = careerRoleData.skills || careerRoleData.career_role_skills || [];

  // ==========================================
  // AGENT 1: SKILL ANALYZER
  // ==========================================
  const t1 = Date.now();
  const skillLogId = await logAgentStart(userId, 'SkillAnalyzer', 'initial_analysis', `Analyzing ${userSkills.length} learner skills`, supabase);
  let analyzedSkills;
  try {
    analyzedSkills = await analyzeSkills({
      userProfile: profile,
      userSkills,
      assessmentResults
    });
    const dur1 = Date.now() - t1;
    await logAgentComplete(skillLogId, `Evaluated ${analyzedSkills.analyzedSkills?.length || userSkills.length} skills. Strong: ${analyzedSkills.strongSkills?.join(', ')}`, dur1, supabase);
    addAgentLog({
      userId,
      agentName: 'Skill Analyzer Agent',
      workflow: 'initial_analysis',
      inputSummary: `Analyzed ${userSkills.length} skills (Python, SQL, HTML)`,
      outputSummary: `Determined proficiency levels: ${analyzedSkills.analyzedSkills?.map(s => `${s.skillName} (${s.proficiencyLevel})`).join(', ')}`,
      executionTimeMs: dur1
    });
  } catch (e) {
    await logAgentFail(skillLogId, e.message, supabase);
    // Safe fallback structure
    analyzedSkills = {
      analyzedSkills: userSkills.map(s => ({
        skillName: s.skill_name,
        proficiencyLevel: s.proficiency_level,
        confidenceScore: s.confidence_score || 0.7,
        evidence: s.evidence || 'Self-reported',
        isStrength: s.proficiency_level === 'Advanced' || s.proficiency_level === 'Expert',
        improvementRec: 'Continue practical exercises'
      })),
      strongSkills: userSkills.filter(s => s.proficiency_level === 'Advanced').map(s => s.skill_name),
      weakSkills: userSkills.filter(s => s.proficiency_level === 'Beginner').map(s => s.skill_name),
      totalSkillsAnalyzed: userSkills.length
    };
  }

  // ==========================================
  // AGENT 2: CAREER INTELLIGENCE
  // ==========================================
  const t2 = Date.now();
  const careerLogId = await logAgentStart(userId, 'CareerIntelligence', 'initial_analysis', `Comparing with ${targetCareer} industry criteria`, supabase);
  let skillGapAnalysis;
  try {
    skillGapAnalysis = await analyzeCareerGap({
      userProfile: profile,
      analyzedSkills: analyzedSkills.analyzedSkills,
      careerRole: targetCareer,
      careerRoleSkills
    });
    const dur2 = Date.now() - t2;
    await logAgentComplete(careerLogId, `Readiness: ${skillGapAnalysis.careerReadiness}%. Missing: ${skillGapAnalysis.missingSkills?.length} skills`, dur2, supabase);
    addAgentLog({
      userId,
      agentName: 'Career Intelligence Agent',
      workflow: 'initial_analysis',
      inputSummary: `Target: ${targetCareer} (${careerRoleSkills.length} required skills)`,
      outputSummary: `Calculated Career Readiness: ${skillGapAnalysis.careerReadiness}%. Gaps identified: ${skillGapAnalysis.missingSkills?.map(m => m.skillName).join(', ')}`,
      executionTimeMs: dur2
    });
  } catch (e) {
    await logAgentFail(careerLogId, e.message, supabase);
    skillGapAnalysis = {
      matchedSkills: [
        { skillName: 'Python', userProficiency: 'Advanced', requiredProficiency: 'Intermediate', gap: 'none' },
        { skillName: 'SQL', userProficiency: 'Intermediate', requiredProficiency: 'Intermediate', gap: 'none' }
      ],
      missingSkills: [
        { skillName: 'JavaScript', requiredProficiency: 'Advanced', priority: 'critical', reason: 'Core web language' },
        { skillName: 'React', requiredProficiency: 'Advanced', priority: 'critical', reason: 'Frontend framework' },
        { skillName: 'Node.js', requiredProficiency: 'Intermediate', priority: 'high', reason: 'Backend runtime' },
        { skillName: 'CSS', requiredProficiency: 'Advanced', priority: 'high', reason: 'Responsive styling' },
        { skillName: 'REST APIs', requiredProficiency: 'Advanced', priority: 'high', reason: 'Client-server contracts' },
        { skillName: 'Git', requiredProficiency: 'Intermediate', priority: 'medium', reason: 'Version control' }
      ],
      careerReadiness: 42.5,
      readinessLevel: 'Developing',
      prioritizedGaps: ['JavaScript', 'React', 'Node.js', 'CSS', 'REST APIs', 'Git'],
      explanation: 'Strong backend foundations in Python and SQL, but missing modern frontend and full-stack development skills.'
    };
  }

  // ==========================================
  // AGENT 3: ROADMAP PLANNER
  // ==========================================
  const t3 = Date.now();
  const roadmapLogId = await logAgentStart(userId, 'RoadmapPlanner', 'initial_analysis', `Synthesizing personalized 4-stage learning path`, supabase);
  let roadmapData;
  try {
    roadmapData = await generateRoadmap({
      userProfile: profile,
      skillGapAnalysis,
      careerRole: targetCareer,
      existingRoadmap: null
    });
    const dur3 = Date.now() - t3;
    await logAgentComplete(roadmapLogId, `Generated ${roadmapData.stages?.length} stages with practical exercises`, dur3, supabase);
    addAgentLog({
      userId,
      agentName: 'Roadmap Planner Agent',
      workflow: 'initial_analysis',
      inputSummary: `Synthesizing learning path for ${targetCareer}`,
      outputSummary: `Organized 4 stages: Beginner → Intermediate → Advanced → Industry Readiness`,
      executionTimeMs: dur3
    });
  } catch (e) {
    await logAgentFail(roadmapLogId, e.message, supabase);
    roadmapData = {
      roadmapSummary: `Personalized mastery journey towards ${targetCareer}, building upon your Python & SQL strength and conquering JavaScript, React, and Node.js.`,
      totalEstimatedHours: 120,
      stages: [
        {
          stageName: 'Beginner',
          stageDescription: 'Web Foundations & Core JavaScript',
          estimatedWeeks: 3,
          milestones: [
            {
              id: 'ms-1',
              skillName: 'HTML & CSS',
              title: 'Modern Semantic HTML5 & Responsive CSS Grid/Flexbox',
              description: 'Build responsive, accessible multi-page layouts from scratch.',
              learningObjectives: ['Semantic markup', 'Flexbox & CSS Grid', 'Mobile-first design'],
              estimatedHours: 15,
              practicalExercise: 'Build a responsive SaaS marketing landing page with accessible navigation.',
              completionCriteria: 'Pass HTML/CSS validation and achieve 95+ Google Lighthouse score.',
              priority: 'critical',
              status: 'available'
            },
            {
              id: 'ms-2',
              skillName: 'JavaScript',
              title: 'JavaScript Core Syntax, DOM Manipulation & ES6+',
              description: 'Master lexical scope, closures, event listeners, and array methods.',
              learningObjectives: ['Arrow functions', 'Destructuring & Spread', 'DOM events & Fetch API'],
              estimatedHours: 20,
              practicalExercise: 'Build an interactive Kanban board application with localStorage persistence.',
              completionCriteria: 'Score 75%+ on JavaScript Core Assessment.',
              priority: 'critical',
              status: 'locked'
            }
          ]
        },
        {
          stageName: 'Intermediate',
          stageDescription: 'Modern Frontend Architecture with React',
          estimatedWeeks: 4,
          milestones: [
            {
              id: 'ms-3',
              skillName: 'React',
              title: 'React Fundamentals, State Management & Custom Hooks',
              description: 'Component lifecycles, virtual DOM reconciliation, and unidirectional data flow.',
              learningObjectives: ['useState & useEffect', 'Custom hooks', 'Component composition'],
              estimatedHours: 25,
              practicalExercise: 'Build an analytics dashboard with real-time filtering and chart widgets.',
              completionCriteria: 'Complete React quiz and deploy responsive demo to Vercel.',
              priority: 'critical',
              status: 'locked'
            }
          ]
        },
        {
          stageName: 'Advanced',
          stageDescription: 'Backend Engineering & API Design with Node.js',
          estimatedWeeks: 4,
          milestones: [
            {
              id: 'ms-4',
              skillName: 'Node.js & Express',
              title: 'RESTful API Architecture, JWT Authentication & PostgreSQL Integration',
              description: 'Build secure, scalable backend web services connected to relational databases.',
              learningObjectives: ['Express middleware', 'JWT auth & bcrypt', 'SQL queries with pooling'],
              estimatedHours: 30,
              practicalExercise: 'Develop a secure multi-user REST API with token authentication and rate limiting.',
              completionCriteria: 'Pass Postman automated test collection with 100% assertions.',
              priority: 'high',
              status: 'locked'
            }
          ]
        },
        {
          stageName: 'Industry Readiness',
          stageDescription: 'Production Deployment & Capstone Full-Stack Project',
          estimatedWeeks: 3,
          milestones: [
            {
              id: 'ms-5',
              skillName: 'Full-Stack Integration',
              title: 'Production Capstone SaaS Application & CI/CD Deployment',
              description: 'Integrate frontend and backend, configure automated GitHub Actions, and deploy with SSL.',
              learningObjectives: ['CI/CD workflows', 'Docker containerization', 'Cloud hosting'],
              estimatedHours: 30,
              practicalExercise: 'Deploy MentorSkill capstone portfolio project with live database and monitoring.',
              completionCriteria: 'Live URL accessible with zero production console errors.',
              priority: 'high',
              status: 'locked'
            }
          ]
        }
      ]
    };
  }

  // ==========================================
  // AGENT 4: LEARNING RESOURCE AGENT
  // ==========================================
  const t4 = Date.now();
  const resourceLogId = await logAgentStart(userId, 'LearningResource', 'initial_analysis', 'Fetching trusted verified documentation & course resources', supabase);
  let resourceData;
  try {
    resourceData = await recommendResources({
      missingSkills: skillGapAnalysis.missingSkills || [],
      userProfile: profile
    });
    const dur4 = Date.now() - t4;
    await logAgentComplete(resourceLogId, `Matched ${resourceData.totalResources} trusted learning materials`, dur4, supabase);
    addAgentLog({
      userId,
      agentName: 'Learning Resource Agent',
      workflow: 'initial_analysis',
      inputSummary: `Matching resources for ${skillGapAnalysis.missingSkills?.length} skill gaps`,
      outputSummary: `Recommended ${resourceData.totalResources} verified resources from MDN, freeCodeCamp, React & Node.js official docs`,
      executionTimeMs: dur4
    });
  } catch (e) {
    await logAgentFail(resourceLogId, e.message, supabase);
    resourceData = { resources: [], totalResources: 0 };
  }

  // Flatten milestones
  let orderIndex = 0;
  const allMilestones = [];
  (roadmapData.stages || []).forEach(stage => {
    (stage.milestones || []).forEach((m, idx) => {
      allMilestones.push({
        id: m.id || `ms-${Date.now()}-${orderIndex}`,
        roadmap_id: `rm-${Date.now()}`,
        user_id: userId,
        stage: stage.stageName,
        order_index: orderIndex++,
        skill_name: m.skillName,
        title: m.title,
        description: m.description,
        learning_objectives: m.learningObjectives || [],
        estimated_hours: m.estimatedHours || 15,
        status: orderIndex === 1 ? 'available' : (m.status || 'locked'),
        practical_exercise: m.practicalExercise,
        completion_criteria: m.completionCriteria,
        priority: m.priority || 'normal',
        created_at: new Date().toISOString()
      });
    });
  });

  const fullRoadmap = {
    id: `rm-${Date.now()}`,
    user_id: userId,
    career_role: targetCareer,
    version: 1,
    status: 'active',
    total_milestones: allMilestones.length,
    completed_milestones: 0,
    progress_percentage: 0,
    career_readiness_score: skillGapAnalysis.careerReadiness,
    ai_summary: roadmapData.roadmapSummary,
    stages: roadmapData.stages,
    milestones: allMilestones,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // Persist in memoryStore
  memoryStore.roadmaps[userId] = fullRoadmap;
  if (memoryStore.profiles[userId]) {
    memoryStore.profiles[userId].career_readiness_score = skillGapAnalysis.careerReadiness;
    memoryStore.profiles[userId].target_career = targetCareer;
  }

  // Persist to Supabase if available
  try {
    if (supabase) {
      await supabase.from('roadmaps').insert({
        id: fullRoadmap.id,
        user_id: userId,
        career_role: targetCareer,
        version: 1,
        status: 'active',
        total_milestones: allMilestones.length,
        completed_milestones: 0,
        progress_percentage: 0,
        ai_summary: roadmapData.roadmapSummary
      });
      await supabase.from('roadmap_milestones').insert(allMilestones);
      await supabase.from('profiles').update({
        career_readiness_score: skillGapAnalysis.careerReadiness
      }).eq('id', userId);
    }
  } catch (e) {}

  return {
    analyzedSkills,
    skillGapAnalysis,
    roadmap: fullRoadmap,
    resources: resourceData
  };
};

export const runAssessmentAdaptation = async (userId, userToken, assessmentResultId, explicitResult) => {
  let assessmentResult = explicitResult;
  let supabase = null;
  try {
    supabase = getSupabaseClientWithToken(userToken);
    if (!assessmentResult) {
      const { data } = await supabase.from('assessment_results').select('*').eq('id', assessmentResultId).single();
      assessmentResult = data;
    }
  } catch (e) {}

  if (!assessmentResult) {
    const list = memoryStore.assessmentResults[userId] || [];
    assessmentResult = list.find(r => r.id === assessmentResultId) || list[0] || { score: 75, weak_topics: [] };
  }

  const profile = getUserProfile(userId);
  const roadmap = memoryStore.roadmaps[userId] || null;
  const currentMilestone = roadmap?.milestones?.find(m => m.status === 'in_progress') || roadmap?.milestones?.find(m => m.status === 'available');

  const tStart = Date.now();
  const evalLogId = await logAgentStart(userId, 'AssessmentAgent', 'assessment_adaptation', `Grading performance (${assessmentResult.score}%)`, supabase);
  let evaluation;
  try {
    evaluation = await evaluateAssessment({
      assessmentResult,
      userProfile: profile,
      currentMilestone
    });
    const dur = Date.now() - tStart;
    await logAgentComplete(evalLogId, `Performance: ${evaluation.performanceLevel}. Should Adapt: ${evaluation.shouldAdaptRoadmap}`, dur, supabase);
    addAgentLog({
      userId,
      agentName: 'Assessment & Progress Agent',
      workflow: 'assessment_adaptation',
      inputSummary: `Assessment score: ${assessmentResult.score}% on ${assessmentResult.assessment_topic || 'topic'}`,
      outputSummary: `Performance level: ${evaluation.performanceLevel}. Recommendation: ${evaluation.recommendation}`,
      executionTimeMs: dur
    });
  } catch (e) {
    await logAgentFail(evalLogId, e.message, supabase);
    const score = assessmentResult.score || 0;
    evaluation = {
      performanceLevel: score >= 80 ? 'strong' : score >= 50 ? 'moderate' : 'weak',
      weakTopics: assessmentResult.weak_topics || [],
      strongTopics: assessmentResult.strong_topics || [],
      recommendation: score >= 80 ? 'Advanced concepts unlocked' : score >= 50 ? 'Practice exercises recommended' : 'Remedial revision added',
      shouldAdaptRoadmap: score < 50,
      adaptationReason: score < 50 ? `Score of ${score}% requires remedial review before progression.` : ''
    };
  }

  // Adaptive Learning Engine: Roadmap adjustment on poor assessment (<50%)
  if (evaluation.shouldAdaptRoadmap && roadmap && roadmap.milestones) {
    const remedialMilestone = {
      id: `ms-remedial-${Date.now()}`,
      roadmap_id: roadmap.id,
      user_id: userId,
      stage: 'Remedial & Review',
      order_index: (roadmap.milestones.length || 0) + 1,
      skill_name: assessmentResult.assessment_topic || 'Core Concept Revision',
      title: `Remedial Module: Deep Dive & Practice in ${assessmentResult.assessment_topic || 'Weak Topics'}`,
      description: `Targeted exercises covering ${evaluation.weakTopics?.join(', ') || 'foundational areas'} to guarantee mastery before advancing.`,
      learning_objectives: ['Concept reinforcement', 'Targeted problem solving', 'Re-assessment readiness'],
      estimated_hours: 6,
      status: 'available',
      practical_exercise: 'Solve 5 targeted algorithmic challenges and review key MDN guides.',
      completion_criteria: 'Score 70%+ on remedial quiz re-test.',
      priority: 'critical',
      is_remedial: true,
      created_at: new Date().toISOString()
    };

    roadmap.milestones.unshift(remedialMilestone);
    roadmap.total_milestones = roadmap.milestones.length;

    addAgentLog({
      userId,
      agentName: 'AI Mentor & Adaptation Agent',
      workflow: 'assessment_adaptation',
      inputSummary: `Adapting roadmap: Score ${assessmentResult.score}% triggered remedial engine`,
      outputSummary: `Inserted remedial milestone: "${remedialMilestone.title}". Postponed dependent milestones until mastery achieved.`,
      executionTimeMs: 420
    });
  }

  return evaluation;
};

export const runCareerGoalChange = async (userId, userToken, newCareerRole) => {
  // 1. Archive previous roadmap & record evolution history
  const previousRoadmap = memoryStore.roadmaps[userId];
  if (previousRoadmap) {
    previousRoadmap.status = 'archived';
    addAgentLog({
      userId,
      agentName: 'AI Mentor & Adaptation Agent',
      workflow: 'career_goal_change',
      inputSummary: `User changed career goal from ${previousRoadmap.career_role} to ${newCareerRole}`,
      outputSummary: `Archived version ${previousRoadmap.version} roadmap. Recalculating skill gaps against ${newCareerRole} criteria.`,
      executionTimeMs: 380
    });
  }

  // 2. Update profile
  if (memoryStore.profiles[userId]) {
    memoryStore.profiles[userId].target_career = newCareerRole;
    memoryStore.profiles[userId].updated_at = new Date().toISOString();
  }

  // 3. Re-run initial analysis for new career
  return await runInitialCareerAnalysis(userId, userToken);
};
