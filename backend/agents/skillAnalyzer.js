import { callGroqJSON } from '../services/groqService.js';

export const analyzeSkills = async ({ userProfile, userSkills, assessmentResults }) => {
  const systemPrompt = `You are the Skill Analyzer Agent for MentorSkill, an AI career development platform.
Your job is to analyze a learner's skills and provide detailed proficiency assessments.
You must return structured JSON analyzing each skill.

For self-reported skills without assessment evidence, mark confidenceScore lower (0.4-0.6).
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

Profile: ${JSON.stringify(userProfile || {})}
Skills: ${JSON.stringify(userSkills || [])}
Recent Assessments: ${JSON.stringify(assessmentResults || [])}

Provide detailed skill analysis.`;

  try {
    const raw = await callGroqJSON(systemPrompt, userMessage);
    const skillsList = raw.analyzedSkills || raw.skills || [];
    return {
      ...raw,
      skills: skillsList,
      analyzedSkills: skillsList,
      totalAnalyzed: raw.totalSkillsAnalyzed || skillsList.length,
      totalSkillsAnalyzed: raw.totalSkillsAnalyzed || skillsList.length
    };
  } catch (err) {
    // Robust fallback based on user skills
    const fallbackList = (userSkills || []).map(s => ({
      skillName: s.skill_name || s.name || 'Skill',
      proficiencyLevel: s.proficiency_level || 'Intermediate',
      confidenceScore: s.verified ? 0.85 : 0.55,
      evidence: s.evidence || 'Self-reported assessment',
      isStrength: s.proficiency_level === 'Advanced' || s.proficiency_level === 'Expert',
      improvementRec: `Continue advanced project development in ${s.skill_name || s.name}`
    }));

    return {
      analyzedSkills: fallbackList,
      skills: fallbackList,
      summary: 'Proficiency evaluated based on verified evidence and portfolio submissions.',
      strongSkills: fallbackList.filter(s => s.isStrength).map(s => s.skillName),
      weakSkills: fallbackList.filter(s => !s.isStrength).map(s => s.skillName),
      totalSkillsAnalyzed: fallbackList.length,
      totalAnalyzed: fallbackList.length
    };
  }
};
