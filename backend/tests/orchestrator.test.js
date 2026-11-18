import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  runInitialCareerAnalysis,
  runAssessmentAdaptation,
  runCareerGoalChange
} from '../orchestrator/agentOrchestrator.js';
import { memoryStore } from '../utils/memoryStore.js';

describe('D. Multi-Agent Orchestrator & Adaptive Learning Engine Testing Suite', () => {
  const TEST_USER = 'test-orchestrator-user';

  it('1. Coordinates 4 agents in Initial Analysis pipeline and outputs full roadmap', async () => {
    const output = await runInitialCareerAnalysis(TEST_USER, 'demo-token');

    assert.ok(output);
    assert.ok(output.analyzedSkills);
    assert.ok(output.skillGapAnalysis);
    assert.ok(output.roadmap);
    assert.ok(output.resources);

    assert.equal(output.roadmap.user_id, TEST_USER);
    assert.ok(output.roadmap.milestones?.length > 0);
    assert.equal(typeof output.skillGapAnalysis.careerReadiness, 'number');
  });

  it('2. Adaptive Learning Engine inserts remedial milestone when assessment score < 50%', async () => {
    const poorResult = {
      id: 'ar-test-fail-1',
      score: 30,
      passed: false,
      assessment_topic: 'Data Structures',
      weak_topics: ['Binary Search Trees', 'Heaps']
    };

    const initialMilestonesCount = memoryStore.roadmaps[TEST_USER]?.milestones?.length || 0;
    const adaptResult = await runAssessmentAdaptation(TEST_USER, 'demo-token', poorResult.id, poorResult);

    assert.ok(adaptResult);
    assert.equal(adaptResult.evaluation.shouldAdaptRoadmap, true);

    const updatedRoadmap = memoryStore.roadmaps[TEST_USER];
    assert.ok(updatedRoadmap);
    assert.ok(updatedRoadmap.milestones.length > initialMilestonesCount, 'Remedial milestone must be prepended');

    const firstMilestone = updatedRoadmap.milestones[0];
    assert.equal(firstMilestone.is_remedial, true);
    assert.equal(firstMilestone.priority, 'critical');
    assert.ok(firstMilestone.title.includes('Remedial'));
  });

  it('3. Adaptive Learning Engine unlocks progression when score >= 80%', async () => {
    const excellentResult = {
      id: 'ar-test-pass-1',
      score: 95,
      passed: true,
      assessment_topic: 'Python',
      weak_topics: []
    };

    const adaptResult = await runAssessmentAdaptation(TEST_USER, 'demo-token', excellentResult.id, excellentResult);
    assert.ok(adaptResult);
    assert.equal(adaptResult.evaluation.shouldAdaptRoadmap, false);
    assert.equal(adaptResult.evaluation.performanceLevel, 'strong');
  });

  it('4. Career Goal Change preserves prior accomplishments and recalculates roadmap', async () => {
    const result = await runCareerGoalChange(TEST_USER, 'demo-token', 'AI/ML Engineer');

    assert.ok(result);
    assert.ok(result.roadmap);
    assert.equal(result.newGoal, 'AI/ML Engineer');
    assert.equal(result.roadmap.career_role, 'AI/ML Engineer');
    assert.ok(result.skillGapAnalysis);
  });
});
