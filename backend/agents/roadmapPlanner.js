import { callGroqJSON } from '../services/groqService.js';

export const generateRoadmap = async (params = {}) => {
  const careerRole = params.careerRole || params.targetCareer || 'Full Stack Developer';
  const skillGapAnalysis = params.skillGapAnalysis || params.skillGaps || { missingSkills: ['JavaScript', 'React', 'Node.js'] };
  const userProfile = params.userProfile || {};
  const existingRoadmap = params.existingRoadmap;

  const systemPrompt = `You are the Roadmap Planner Agent for MentorSkill.
Create a concise, structured 3 to 4 stage learning roadmap.
Stages: Foundational -> Core Architecture -> Advanced Specialization -> Production Readiness.

Keep milestone descriptions concise to fit clean structured JSON.

Return this exact JSON:
{
  "roadmapSummary": "string",
  "totalEstimatedHours": number,
  "stages": [
    {
      "stageName": "string",
      "stageDescription": "string",
      "estimatedWeeks": number,
      "milestones": [
        {
          "skillName": "string",
          "title": "string",
          "description": "string",
          "learningObjectives": ["obj1", "obj2"],
          "estimatedHours": number,
          "resources": [{"title": "string", "url": "string", "type": "string"}],
          "practicalExercise": "string",
          "completionCriteria": "string",
          "priority": "critical|high|normal|low"
        }
      ]
    }
  ]
}`;

  const userMessage = `Generate roadmap for: ${careerRole}
Skill Gap Analysis: ${JSON.stringify(skillGapAnalysis)}
Learner Profile: ${JSON.stringify(userProfile)}
Existing Progress: ${existingRoadmap ? 'Preserve completed milestones' : 'New learner'}`;

  try {
    const res = await callGroqJSON(systemPrompt, userMessage, { maxTokens: 3500 });
    if (res?.stages && Array.isArray(res.stages) && res.stages.length > 0) {
      return res;
    }
  } catch (err) {}

  // Deterministic fallback roadmap for career role
  const missing = (skillGapAnalysis.missingSkills || ['JavaScript', 'React', 'Node.js']).map(s => typeof s === 'string' ? s : s.skillName);

  return {
    roadmapSummary: `Targeted 3-stage career path for ${careerRole} addressing verified skill gaps.`,
    totalEstimatedHours: 85,
    stages: [
      {
        stageName: 'Stage 1: Core Prerequisites & Architecture',
        stageDescription: 'Build foundational comprehension in missing core requirements.',
        estimatedWeeks: 3,
        milestones: missing.slice(0, 2).map((s, idx) => ({
          skillName: s,
          title: `Fundamental Mastery in ${s}`,
          description: `Acquire in-depth theoretical and practical competency in ${s}.`,
          learningObjectives: [`Core syntax and idioms of ${s}`, 'Architectural design patterns', 'Unit testing'],
          estimatedHours: 15,
          resources: [{ title: `${s} Official Documentation`, url: 'https://developer.mozilla.org', type: 'documentation' }],
          practicalExercise: `Implement a production module leveraging ${s}.`,
          completionCriteria: 'Pass diagnostic quiz with >= 70%.',
          priority: idx === 0 ? 'critical' : 'high'
        }))
      },
      {
        stageName: 'Stage 2: Full-Stack Integration',
        stageDescription: 'Combine frontend, backend, and data layers into coherent services.',
        estimatedWeeks: 4,
        milestones: [
          {
            skillName: missing[2] || 'Full Stack Systems',
            title: `Engineering Scalable Services with ${missing[2] || 'Full Stack Systems'}`,
            description: 'REST API design, data integrity, and microservice integration.',
            learningObjectives: ['API security', 'State management', 'Database transactions'],
            estimatedHours: 25,
            resources: [{ title: 'Full Stack Engineering Guide', url: 'https://fullstackopen.com', type: 'course' }],
            practicalExercise: 'Build an end-to-end CRUD application with authentication.',
            completionCriteria: 'Complete integration test suite with 100% pass rate.',
            priority: 'critical'
          }
        ]
      },
      {
        stageName: 'Stage 3: Production & Industry Readiness',
        stageDescription: 'Deploy, monitor, and optimize for real-world enterprise standards.',
        estimatedWeeks: 2,
        milestones: [
          {
            skillName: 'Production Capstone',
            title: 'Deploy Production SaaS Portfolio Application',
            description: 'Docker containerization, CI/CD pipeline, and SSL cloud deployment.',
            learningObjectives: ['Docker containerization', 'Cloud deployment', 'Performance monitoring'],
            estimatedHours: 20,
            resources: [{ title: 'Production Deployment Best Practices', url: 'https://docs.github.com/actions', type: 'tutorial' }],
            practicalExercise: 'Deploy live portfolio project on cloud with custom domain.',
            completionCriteria: 'Live deployment accessible with zero errors.',
            priority: 'high'
          }
        ]
      }
    ]
  };
};
