import { callGroqJSON } from '../services/groqService.js';

export const analyzeCareerGap = async ({ userProfile, analyzedSkills, careerRole, careerRoleSkills }) => {
  const systemPrompt = `You are the Career Intelligence Agent for MentorSkill.
You compare a learner's skills against career requirements to identify gaps and calculate readiness.

Career readiness formula: 
- For each required skill: if learner has it at required proficiency = 1 point, lower proficiency = 0.5 points, missing = 0 points
- Score = (total points / total required skills) * 100

Return this exact JSON:
{
  "matchedSkills": [{"skillName": "string", "userProficiency": "string", "requiredProficiency": "string", "gap": "none|partial|none"}],
  "missingSkills": [{"skillName": "string", "requiredProficiency": "string", "priority": "critical|high|medium|low", "reason": "string"}],
  "weakSkills": [{"skillName": "string", "userProficiency": "string", "requiredProficiency": "string", "priority": "high|medium|low"}],
  "careerReadiness": number,
  "readinessLevel": "Beginner|Developing|Intermediate|Advanced|Ready",
  "prioritizedGaps": ["skill1", "skill2"],
  "explanation": "string",
  "estimatedTimeToReady": "string"
}`;

  const userMessage = `Career: ${careerRole}
Required Skills: ${JSON.stringify(careerRoleSkills)}
Learner Skills: ${JSON.stringify(analyzedSkills)}
Profile: ${JSON.stringify(userProfile)}`;

  return await callGroqJSON(systemPrompt, userMessage);
};
