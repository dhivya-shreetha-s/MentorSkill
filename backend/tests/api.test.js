import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../server.js';

const AUTH_HEADER = { Authorization: 'Bearer demo-token' };

describe('B. Backend REST API Endpoints Testing Suite', () => {
  describe('1. Health & Core System', () => {
    it('GET /health returns 200 OK and service metadata', async () => {
      const res = await request(app).get('/health');
      assert.equal(res.status, 200);
      assert.equal(res.body.status, 'ok');
      assert.equal(res.body.service, 'MentorSkill API');
      assert.ok(res.body.timestamp);
    });

    it('Returns 404 with structured error on non-existent endpoints', async () => {
      const res = await request(app).get('/api/invalid-route-xyz');
      assert.equal(res.status, 404);
      assert.ok(res.body.error);
    });
  });

  describe('2. Career Explorer Endpoints', () => {
    it('GET /api/careers returns catalog of all 8 seeded career roles', async () => {
      const res = await request(app).get('/api/careers');
      assert.equal(res.status, 200);
      assert.ok(Array.isArray(res.body.careers));
      assert.ok(res.body.careers.length >= 8);

      const titles = res.body.careers.map((c) => c.title);
      assert.ok(titles.includes('Full Stack Developer'));
      assert.ok(titles.includes('AI/ML Engineer'));
      assert.ok(titles.includes('Data Scientist'));
    });

    it('GET /api/careers/:id returns career role details and prerequisites', async () => {
      const res = await request(app).get('/api/careers/cr-1');
      assert.equal(res.status, 200);
      assert.ok(res.body.career);
      assert.equal(res.body.career.title, 'Full Stack Developer');
    });

    it('POST /api/careers/select updates target career role', async () => {
      const res = await request(app)
        .post('/api/careers/select')
        .set(AUTH_HEADER)
        .send({ careerRoleId: 'cr-2' });
      assert.equal(res.status, 200);
      assert.ok(res.body.success);
    });
  });

  describe('3. Technical Assessments Endpoints', () => {
    it('GET /api/assessments returns 8 technical diagnostic assessments', async () => {
      const res = await request(app)
        .get('/api/assessments')
        .set(AUTH_HEADER);
      assert.equal(res.status, 200);
      assert.ok(Array.isArray(res.body.assessments));
      assert.equal(res.body.assessments.length, 8);

      for (const a of res.body.assessments) {
        assert.ok(a.topic, 'Assessment must define a topic');
        assert.ok(a.question_count > 0, `Assessment ${a.title} must have questions`);
      }
    });

    it('GET /api/assessments/:id returns questions without exposing answers', async () => {
      const res = await request(app)
        .get('/api/assessments/as-js')
        .set(AUTH_HEADER);
      assert.equal(res.status, 200);
      assert.ok(res.body.questions?.length > 0);

      // Verify answer security: correct_answer is stripped from quiz payload
      for (const q of res.body.questions) {
        assert.equal(q.correct_answer, undefined);
      }
    });

    it('POST /api/assessments/submit calculates score and evaluates result', async () => {
      const res = await request(app)
        .post('/api/assessments/submit')
        .set(AUTH_HEADER)
        .send({
          assessmentId: 'as-js',
          answers: { 'q-js-1': 'B', 'q-js-2': 'A', 'q-js-3': 'C' },
          timeTaken: 5
        });
      assert.equal(res.status, 200);
      assert.ok(res.body.result);
      assert.equal(typeof res.body.score, 'number');
      assert.equal(typeof res.body.passed, 'boolean');
    });
  });

  describe('4. User Profile & Skills Endpoints', () => {
    it('GET /api/profile returns authenticated user profile', async () => {
      const res = await request(app)
        .get('/api/profile')
        .set(AUTH_HEADER);
      assert.equal(res.status, 200);
      assert.ok(res.body.profile);
      assert.ok(res.body.profile.full_name);
    });

    it('POST /api/profile updates user career target and learning preferences', async () => {
      const res = await request(app)
        .post('/api/profile')
        .set(AUTH_HEADER)
        .send({
          target_career: 'Full Stack Developer',
          hours_per_week: 20
        });
      assert.equal(res.status, 200);
      assert.equal(res.body.profile.target_career, 'Full Stack Developer');
    });

    it('GET /api/skills/master returns master catalog of industry skills', async () => {
      const res = await request(app).get('/api/skills/master');
      assert.equal(res.status, 200);
      assert.ok(Array.isArray(res.body.skills));
      assert.ok(res.body.skills.length >= 20);
    });

    it('POST /api/skills adds new user skill with proficiency', async () => {
      const res = await request(app)
        .post('/api/skills')
        .set(AUTH_HEADER)
        .send({
          skill_name: 'TypeScript',
          proficiency_level: 'Intermediate'
        });
      assert.equal(res.status, 200);
      assert.equal(res.body.skill.skill_name, 'TypeScript');
    });
  });

  describe('5. Learning Roadmap & Resources Endpoints', () => {
    it('GET /api/roadmaps/current returns active learning path', async () => {
      const res = await request(app)
        .get('/api/roadmaps/current')
        .set(AUTH_HEADER);
      assert.equal(res.status, 200);
      assert.ok(res.body.roadmap);
      assert.ok(res.body.roadmap.milestones?.length > 0);
    });

    it('GET /api/resources returns curated learning materials', async () => {
      const res = await request(app)
        .get('/api/resources')
        .set(AUTH_HEADER);
      assert.equal(res.status, 200);
      assert.ok(Array.isArray(res.body.resources));
      assert.ok(res.body.resources.length > 0);
    });
  });

  describe('6. AI Mentor & Agent Logs Endpoints', () => {
    it('POST /api/mentor/chat validates non-empty message input', async () => {
      const res = await request(app)
        .post('/api/mentor/chat')
        .set(AUTH_HEADER)
        .send({});
      assert.equal(res.status, 400);
      assert.ok(res.body.error);
    });

    it('GET /api/agents/logs returns execution audit trail', async () => {
      const res = await request(app)
        .get('/api/agents/logs')
        .set(AUTH_HEADER);
      assert.equal(res.status, 200);
      assert.ok(Array.isArray(res.body.logs));
    });

    it('GET /api/progress returns user completion analytics', async () => {
      const res = await request(app)
        .get('/api/progress')
        .set(AUTH_HEADER);
      assert.equal(res.status, 200);
      assert.ok(res.body.progress);
    });
  });
});
