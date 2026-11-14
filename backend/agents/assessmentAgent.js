import { callGroqJSON } from '../services/groqService.js';

const THRESHOLDS = { WEAK: 50, MODERATE: 79 };

export const evaluateAssessment = async ({ assessmentResult, userProfile, currentMilestone }) => {
  const { score, weak_topics, strong_topics, assessment_id } = assessmentResult;

  let performanceLevel, recommendation, shouldAdaptRoadmap = false, adaptationReason = '';

  if (score < THRESHOLDS.WEAK) {
    performanceLevel = 'weak';
    recommendation = 'Recommend revision and additional exercises before progressing';
    shouldAdaptRoadmap = true;
    adaptationReason = `Score of ${score}% is below the 50% threshold. Adding remedial content.`;
  } else if (score <= THRESHOLDS.MODERATE) {
    performanceLevel = 'moderate';
    recommendation = 'Additional practice recommended. Can progress with focused improvement.';
  } else {
    performanceLevel = 'strong';
    recommendation = 'Excellent performance! Ready to advance to the next milestone.';
  }

  const systemPrompt = `You are the Assessment Agent for MentorSkill.
Analyze assessment results and provide detailed feedback.
Return JSON with this structure:
{
  "performanceLevel": "weak|moderate|strong",
  "weakTopics": ["topic1"],
  "strongTopics": ["topic1"],
  "recommendation": "string",
  "shouldAdaptRoadmap": boolean,
  "adaptationReason": "string",
  "proficiencyUpdate": {"skillName": "string", "newProficiency": "string"},
  "detailedFeedback": "string",
  "nextSteps": ["step1", "step2"]
}`;

  const userMessage = `Assessment Result:
Score: ${score}%
Weak Topics: ${JSON.stringify(weak_topics)}
Strong Topics: ${JSON.stringify(strong_topics)}
Current Milestone: ${JSON.stringify(currentMilestone)}
Performance Level Determined: ${performanceLevel}
Recommendation: ${recommendation}`;

  try {
    const aiAnalysis = await callGroqJSON(systemPrompt, userMessage);
    return { ...aiAnalysis, shouldAdaptRoadmap, adaptationReason };
  } catch (e) {
    return { performanceLevel, weakTopics: weak_topics || [], strongTopics: strong_topics || [], recommendation, shouldAdaptRoadmap, adaptationReason, detailedFeedback: recommendation, nextSteps: [] };
  }
};
