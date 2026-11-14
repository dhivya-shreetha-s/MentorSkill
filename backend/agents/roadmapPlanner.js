import { callGroqJSON } from '../services/groqService.js';

export const generateRoadmap = async ({ userProfile, skillGapAnalysis, careerRole, existingRoadmap }) => {
  const systemPrompt = `You are the Roadmap Planner Agent for MentorSkill.
Create a personalized learning roadmap divided into 4 stages.

IMPORTANT: Respect skill prerequisites. Foundations come before advanced topics.
Stages: Beginner → Intermediate → Advanced → Industry Readiness

Return this exact JSON:
{
  "roadmapSummary": "string",
  "totalEstimatedHours": number,
  "stages": [
    {
      "stageName": "Beginner|Intermediate|Advanced|Industry Readiness",
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
Existing Progress: ${existingRoadmap ? 'Has existing roadmap' : 'New learner'}`;

  return await callGroqJSON(systemPrompt, userMessage);
};
