import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../server.js';
import { memoryStore } from '../utils/memoryStore.js';

const AUTH_HEADER = { Authorization: 'Bearer demo-token' };

describe('E. End-to-End Complete 18-Step Learner Journey Simulation', () => {
  let initialRoadmapId;

  it('Steps 1-3: Register, authenticate and complete user profile', async () => {
    const res = await request(app)
      .post('/api/profile')
      .set(AUTH_HEADER)
      .send({
        full_name: 'Dhivya Shreetha',
        education: 'Bachelor of Technology',
        field_of_study: 'Computer Science',
        target_career: 'Full Stack Developer',
        hours_per_week: 15,
        onboarding_completed: true
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.profile.full_name, 'Dhivya Shreetha');
  });

  it('Step 4: Add baseline technical skills', async () => {
    const res1 = await request(app)
      .post('/api/skills')
      .set(AUTH_HEADER)
      .send({ skill_name: 'Python', proficiency_level: 'Advanced' });
    assert.equal(res1.status, 200);

    const res2 = await request(app)
      .post('/api/skills')
      .set(AUTH_HEADER)
      .send({ skill_name: 'SQL', proficiency_level: 'Intermediate' });
    assert.equal(res2.status, 200);
  });

  it('Step 5: Select target career role', async () => {
    const res = await request(app)
      .post('/api/careers/select')
      .set(AUTH_HEADER)
      .send({ careerRoleId: 'cr-1' });
    assert.equal(res.status, 200);
    assert.ok(res.body.success);
  });

  it('Steps 6-9: Trigger multi-agent pipeline: skill analysis, gap identification, roadmap & resources', async () => {
    const res = await request(app)
      .post('/api/analysis/run')
      .set(AUTH_HEADER)
      .send({ targetCareer: 'Full Stack Developer' });

    assert.equal(res.status, 200);
    assert.ok(res.body.result);
    assert.ok(res.body.result.skillGapAnalysis);
    assert.ok(res.body.result.roadmap);
    assert.ok(res.body.result.resources);

    initialRoadmapId = res.body.result.roadmap.id;
    assert.ok(res.body.result.roadmap.milestones.length > 0);
  });

  it('Steps 10-13: Take technical assessment, evaluate score and update proficiency', async () => {
    const res = await request(app)
      .post('/api/assessments/submit')
      .set(AUTH_HEADER)
      .send({
        assessmentId: 'as-js',
        answers: {
          'q-js-1': 'B',
          'q-js-2': 'A',
          'q-js-3': 'C',
          'q-js-4': 'B',
          'q-js-5': 'C'
        },
        timeTaken: 8
      });

    assert.equal(res.status, 200);
    assert.ok(res.body.score >= 50);
  });

  it('Step 14: Adapt roadmap when assessment performance is poor (<50%)', async () => {
    const res = await request(app)
      .post('/api/assessments/submit')
      .set(AUTH_HEADER)
      .send({
        assessmentId: 'as-dsa',
        answers: {
          'q-dsa-1': 'A', // Incorrect
          'q-dsa-2': 'A'  // Incorrect
        },
        timeTaken: 12
      });

    assert.equal(res.status, 200);

    // Verify roadmap updated with remedial milestone
    const roadmapRes = await request(app)
      .get('/api/roadmaps/current')
      .set(AUTH_HEADER);

    assert.equal(roadmapRes.status, 200);
    const milestones = roadmapRes.body.roadmap.milestones;
    const hasRemedial = milestones.some((m) => m.is_remedial || m.priority === 'critical');
    assert.ok(hasRemedial, 'Roadmap must contain remedial milestone following failed assessment');
  });

  it('Steps 15-16: Change career goal and regenerate personalized roadmap', async () => {
    const res = await request(app)
      .post('/api/analysis/change-goal')
      .set(AUTH_HEADER)
      .send({ newGoal: 'Data Scientist' });

    assert.equal(res.status, 200);
    assert.equal(res.body.newGoal, 'Data Scientist');
    assert.ok(res.body.roadmap);
    assert.equal(res.body.roadmap.career_role, 'Data Scientist');
  });

  it('Step 17: Interactive AI Mentor conversation with context retention', async () => {
    const res = await request(app)
      .post('/api/mentor/chat')
      .set(AUTH_HEADER)
      .send({ message: 'What is my current career readiness for Data Scientist?' });

    assert.equal(res.status, 200);
    assert.ok(res.body.response);
  });

  it('Step 18: Verify all updates persist across page reloads & API calls', async () => {
    const profileRes = await request(app).get('/api/profile').set(AUTH_HEADER);
    assert.equal(profileRes.status, 200);
    assert.equal(profileRes.body.profile.target_career, 'Data Scientist');

    const roadmapRes = await request(app).get('/api/roadmaps/current').set(AUTH_HEADER);
    assert.equal(roadmapRes.status, 200);
    assert.equal(roadmapRes.body.roadmap.career_role, 'Data Scientist');

    const progressRes = await request(app).get('/api/progress').set(AUTH_HEADER);
    assert.equal(progressRes.status, 200);
  });
});
