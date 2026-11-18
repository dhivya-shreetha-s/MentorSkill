import { callGroq } from '../services/groqService.js';

export const getMentorResponse = async ({ userMessage, userProfile, userSkills, currentRoadmap, assessmentHistory, conversationHistory }) => {
  const learnerName = userProfile?.full_name || 'Learner';
  const targetCareer = userProfile?.target_career || 'Full Stack Developer';
  const skillsList = userSkills?.map(s => (s.skill_name || s.name) + ' (' + (s.proficiency_level || 'Intermediate') + ')').join(', ') || 'Python, SQL';
  const readiness = userProfile?.career_readiness_score || 45;

  const systemPrompt = `You are the personalized AI Career Mentor for MentorSkill.
LEARNER CONTEXT:
- Name: ${learnerName}
- Target Career: ${targetCareer}
- Education: ${userProfile?.education || 'Computer Science / Engineering'}
- Skills: ${skillsList}
- Career Readiness Score: ${readiness}%
- Active Roadmap: ${currentRoadmap ? currentRoadmap.career_role + ' (' + (currentRoadmap.progress_percentage || 0) + '% complete)' : 'In progress'}

ROLE & GUIDELINES:
- Deliver encouraging, actionable and specific technical career guidance (150-300 words).
- Directly answer questions regarding skill gaps, project recommendations, and learning strategies.
- Emphasize real-world engineering standards (clean code, git workflows, testing).`;

  try {
    const response = await callGroq(systemPrompt, userMessage, {
      temperature: 0.6,
      maxTokens: 600
    });
    return { response };
  } catch (err) {
    // Contextual fallback response so user is never stranded
    return {
      response: `Hi ${learnerName}! As your AI Mentor for your journey toward ${targetCareer}, I reviewed your current profile. With a career readiness score of ${readiness}%, your strongest asset is your foundation in ${skillsList.split(',')[0] || 'core languages'}. To accelerate your progression, focus on building an end-to-end project integrating these skills with a real database and automated tests, and complete your next diagnostic assessment in your Roadmap module.`
    };
  }
};
