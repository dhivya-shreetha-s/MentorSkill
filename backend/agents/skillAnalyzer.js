import { callGroqJSON } from '../services/groqService.js';

export const analyzeSkills = async ({ userProfile, userSkills, assessmentResults }) => {
  const systemPrompt = `You are the Skill Analyzer Agent for MentorSkill, an AI career development platform.
Your job is to analyze a learner's skills and provide detailed proficiency assessments.
You must return structured JSON analyzing each skill.

For self-reported skills without assessment evidence, mark confidence_score lower (0.4-0.6).
For skills validated by assessments, use the assessment score to adjust proficiency.

Return this exact JSON structure:
{
  "analyzedSkills": [
    {
      "skillName": "string",
      "proficiencyLevel": "Beginner|Intermediate|Advanced|Expert",
      "confidenceScore": 0.0-1.0,
      "evidence": "string explaining the basis",
      "isStrength": true/false,
      "improvementRec": "string"
    }
  ],
  "summary": "string",
  "strongSkills": ["skill1", "skill2"],
  "weakSkills": ["skill1", "skill2"],
  "totalSkillsAnalyzed": number
}`;

  const userMessage = `Analyze this learner's skills:

Profile: ${JSON.stringify(userProfile)}
Skills: ${JSON.stringify(userSkills)}
Recent Assessments: ${JSON.stringify(assessmentResults || [])}

Provide detailed skill analysis.`;

  return await callGroqJSON(systemPrompt, userMessage);
};
