import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const getMentorResponse = async ({ userMessage, userProfile, userSkills, currentRoadmap, assessmentHistory, conversationHistory }) => {
  const systemPrompt = `You are the AI Mentor for MentorSkill, a personalized career development platform.

LEARNER CONTEXT:
- Name: ${userProfile?.full_name || 'Learner'}
- Target Career: ${userProfile?.target_career || 'Not set'}
- Education: ${userProfile?.education || 'Not provided'}
- Skills: ${userSkills?.map(s => s.skill_name + ' (' + s.proficiency_level + ')').join(', ') || 'None listed'}
- Career Readiness: ${userProfile?.career_readiness_score || 0}%
- Current Roadmap: ${currentRoadmap ? currentRoadmap.career_role + ' - ' + currentRoadmap.progress_percentage + '% complete' : 'Not generated yet'}

YOUR ROLE:
- Be a supportive, knowledgeable career mentor
- Give personalized advice based on the learner's specific profile
- Help them understand their skill gaps and how to close them
- Suggest practical projects and learning resources
- Explain why certain skills are important for their career goal
- Detect when they want to change career goals and acknowledge it
- Be encouraging but honest about skill gaps

GUIDELINES:
- Keep responses focused and actionable (200-400 words)
- Reference their specific skills and career goal
- Suggest real, specific actions they can take
- If they mention changing career, acknowledge and suggest they use the Career Explorer`;

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const messages = [
    { role: 'system', content: systemPrompt },
    ...(conversationHistory || []).slice(-6).map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: userMessage }
  ];

  const response = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
    messages,
    temperature: 0.7,
    max_tokens: 600
  });

  return { response: response.choices[0].message.content };
};
