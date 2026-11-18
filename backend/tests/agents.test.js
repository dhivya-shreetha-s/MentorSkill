import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { analyzeSkills } from '../agents/skillAnalyzer.js';
import { analyzeCareerGap } from '../agents/careerIntelligence.js';
import { generateRoadmap } from '../agents/roadmapPlanner.js';
import { recommendResources } from '../agents/learningResource.js';
import { evaluateAssessment } from '../agents/assessmentAgent.js';
import { getMentorResponse } from '../agents/mentorAgent.js';
import { CAREER_ROLES } from '../data/seedData.js';

describe('C. Six Specialized AI Agents Testing Suite', () => {
  const mockProfile = {
    full_name: 'Alex Johnson',
    education: 'B.S. Computer Science',
    field_of_study: 'Software Engineering',
    target_career: 'Full Stack Developer',
    hours_per_week: 15
  };

  const mockUserSkills = [
    { skill_name: 'Python', proficiency_level: 'Advanced', source: 'self_reported' },
    { skill_name: 'SQL', proficiency_level: 'Intermediate', source: 'self_reported' },
    { skill_name: 'HTML', proficiency_level: 'Beginner', source: 'self_reported' }
  ];

  it('1. Agent 1: Skill Analyzer produces structured strengths & weaknesses', async () => {
    const result = await analyzeSkills({
      userProfile: mockProfile,
      userSkills: mockUserSkills,
      assessmentResults: [{ topic: 'Python', score: 85, passed: true }]
    });

    assert.ok(result);
    assert.ok(Array.isArray(result.skills) || Array.isArray(result.analyzedSkills));
    assert.ok(result.totalAnalyzed > 0 || result.skills?.length > 0);
  });

  it('2. Agent 2: Career Intelligence identifies missing skills and calculates readiness score', async () => {
    const fullStackRole = CAREER_ROLES.find((c) => c.id === 'cr-1');
    const result = await analyzeCareerGap({
      targetCareer: fullStackRole,
      userSkills: mockUserSkills,
      analyzedSkills: mockUserSkills
    });

    assert.ok(result);
    assert.equal(typeof result.careerReadiness, 'number');
    assert.ok(result.careerReadiness >= 0 && result.careerReadiness <= 100);
    assert.ok(Array.isArray(result.matchedSkills));
    assert.ok(Array.isArray(result.missingSkills));
    assert.ok(result.missingSkills.length > 0, 'Full stack role should identify missing skills like React or Node.js');
  });

  it('3. Agent 3: Roadmap Planner structures stages, prerequisites and milestones', async () => {
    const result = await generateRoadmap({
      careerRole: 'Full Stack Developer',
      skillGaps: {
        missingSkills: ['JavaScript', 'React', 'Node.js'],
        weakSkills: ['HTML']
      },
      userProfile: mockProfile,
      hoursPerWeek: 15
    });

    assert.ok(result);
    assert.ok(Array.isArray(result.stages));
    assert.ok(result.stages.length >= 2, 'Roadmap must have multiple stages');

    const firstStage = result.stages[0];
    assert.ok(firstStage.stageName);
    assert.ok(Array.isArray(firstStage.milestones));

    const firstMilestone = firstStage.milestones[0];
    assert.ok(firstMilestone.skillName);
    assert.ok(firstMilestone.title);
    assert.ok(firstMilestone.practicalExercise);
  });

  it('4. Agent 4: Learning Resource Agent recommends authentic URLs & providers', async () => {
    const result = await recommendResources({
      missingSkills: ['JavaScript', 'React'],
      userProfile: mockProfile
    });

    assert.ok(result);
    assert.ok(result.totalResources > 0);
    assert.ok(Array.isArray(result.resources));

    const firstResource = result.resources[0];
    assert.ok(firstResource.url.startsWith('http'), 'Resource URL must be a valid HTTP address');
    assert.ok(firstResource.provider, 'Resource must cite an authentic provider');
  });

  it('5. Agent 5: Assessment & Progress Agent adapts recommendations by score threshold', async () => {
    // Test Case: Low score (<50%) triggers remedial recommendation
    const lowScoreResult = await evaluateAssessment({
      assessmentResult: { score: 35, topic: 'JavaScript', weak_topics: ['Closures', 'Event Loop'] },
      userProfile: mockProfile
    });
    assert.equal(lowScoreResult.shouldAdaptRoadmap, true);
    assert.equal(lowScoreResult.performanceLevel, 'weak');

    // Test Case: High score (>=80%) unlocks progression
    const highScoreResult = await evaluateAssessment({
      assessmentResult: { score: 90, topic: 'Python', weak_topics: [] },
      userProfile: mockProfile
    });
    assert.equal(highScoreResult.shouldAdaptRoadmap, false);
    assert.equal(highScoreResult.performanceLevel, 'strong');
  });

  it('6. Agent 6: AI Mentor Agent returns contextual guidance with learner state', async () => {
    const result = await getMentorResponse({
      userMessage: 'What project should I build next to demonstrate full-stack competency?',
      userProfile: mockProfile,
      userSkills: mockUserSkills,
      currentRoadmap: { career_role: 'Full Stack Developer' },
      conversationHistory: []
    });

    assert.ok(result);
    assert.ok(result.response);
    assert.ok(result.response.length > 20, 'Mentor response must be meaningful and comprehensive');
  });
});
