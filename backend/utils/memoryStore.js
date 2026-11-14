// In-memory & local fallback store for seamless offline/standalone demo resilience
import { CAREER_ROLES, ASSESSMENTS, LEARNING_RESOURCES } from '../data/seedData.js';

export const memoryStore = {
  // Demonstration user profile as requested by prompt
  profiles: {
    'demo-user-1': {
      id: 'demo-user-1',
      full_name: 'Alex Johnson',
      email: 'alex.johnson@demo.mentorskill.ai',
      education: 'Bachelor of Science in Computer Science',
      college: 'Stanford University',
      current_year: 'Senior (4th Year)',
      field_of_study: 'Software Engineering',
      target_career: 'Full Stack Developer',
      preferred_learning_style: 'Hands-on Projects & Interactive Practice',
      hours_per_week: 15,
      career_readiness_score: 42.5,
      onboarding_completed: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  },

  // Demonstration skills for Alex Johnson: Python Advanced, SQL Intermediate, HTML Basic
  userSkills: {
    'demo-user-1': [
      { id: 'us-1', user_id: 'demo-user-1', skill_name: 'Python', proficiency_level: 'Advanced', source: 'self_reported', verified: true, confidence_score: 0.9, evidence: 'Completed Python Capstone project and data structures coursework' },
      { id: 'us-2', user_id: 'demo-user-1', skill_name: 'SQL', proficiency_level: 'Intermediate', source: 'self_reported', verified: false, confidence_score: 0.7, evidence: 'Relational database course with PostgreSQL' },
      { id: 'us-3', user_id: 'demo-user-1', skill_name: 'HTML', proficiency_level: 'Beginner', source: 'self_reported', verified: false, confidence_score: 0.5, evidence: 'Basic website development experience' }
    ]
  },

  careerRoles: CAREER_ROLES,
  assessments: ASSESSMENTS,
  learningResources: LEARNING_RESOURCES,

  roadmaps: {},
  milestones: {},
  assessmentResults: {},
  agentLogs: [],
  mentorChats: {}
};

// Helper to get or init user profile
export const getUserProfile = (userId) => {
  return memoryStore.profiles[userId] || memoryStore.profiles['demo-user-1'];
};

export const getUserSkills = (userId) => {
  return memoryStore.userSkills[userId] || memoryStore.userSkills['demo-user-1'] || [];
};

export const addAgentLog = ({ userId, agentName, workflow, status, inputSummary, outputSummary, executionTimeMs }) => {
  const log = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    user_id: userId || 'demo-user-1',
    agent_name: agentName,
    workflow: workflow || 'initial_analysis',
    status: status || 'completed',
    input_summary: inputSummary,
    output_summary: outputSummary,
    execution_time_ms: executionTimeMs || Math.floor(Math.random() * 800 + 400),
    created_at: new Date().toISOString()
  };
  memoryStore.agentLogs.unshift(log);
  if (memoryStore.agentLogs.length > 50) memoryStore.agentLogs.pop();
  return log;
};
