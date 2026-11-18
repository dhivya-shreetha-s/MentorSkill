import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../server.js';

describe('A. Authentication & Security Testing Suite', () => {
  it('1. Rejects unauthenticated requests with 401 Unauthorized', async () => {
    const res = await request(app).get('/api/profile');
    assert.equal(res.status, 401);
    assert.ok(res.body.error);
  });

  it('2. Rejects invalid token formats with 401 Unauthorized', async () => {
    const res = await request(app)
      .get('/api/profile')
      .set('Authorization', 'InvalidFormatString');
    assert.equal(res.status, 401);
  });

  it('3. Accepts demo-token and authenticates as demo user', async () => {
    const res = await request(app)
      .get('/api/profile')
      .set('Authorization', 'Bearer demo-token');
    assert.equal(res.status, 200);
    assert.ok(res.body.profile);
    assert.equal(res.body.profile.id, 'demo-user-1');
  });

  it('4. Enforces authentication across all protected resource endpoints', async () => {
    const protectedPaths = [
      '/api/profile',
      '/api/skills',
      '/api/assessments',
      '/api/roadmaps',
      '/api/analysis/latest',
      '/api/progress'
    ];

    for (const path of protectedPaths) {
      const res = await request(app).get(path);
      assert.equal(res.status, 401, `Path ${path} must enforce authentication`);
    }
  });

  it('5. Allows unauthenticated access only to public endpoints (health, careers)', async () => {
    const healthRes = await request(app).get('/health');
    assert.equal(healthRes.status, 200);
    assert.equal(healthRes.body.status, 'ok');

    const careersRes = await request(app).get('/api/careers');
    assert.equal(careersRes.status, 200);
    assert.ok(Array.isArray(careersRes.body.careers));
  });
});
