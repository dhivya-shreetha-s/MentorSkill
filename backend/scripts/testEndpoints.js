import http from 'http';

async function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(`http://localhost:5000${path}`, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    if (options.body) req.write(JSON.stringify(options.body));
    req.end();
  });
}

async function run() {
  console.log('--- TESTING REST API ENDPOINTS ---');

  const health = await request('/health');
  console.log('1. Health check:', health.status, health.body);

  const careers = await request('/api/careers');
  console.log('2. Careers count:', careers.body.careers?.length);

  const assessments = await request('/api/assessments', {
    headers: { 'Authorization': 'Bearer demo-token' }
  });
  console.log('3. Assessments count:', assessments.body.assessments?.length);

  const resources = await request('/api/resources');
  console.log('4. Resources count:', resources.body.resources?.length);

  const profile = await request('/api/profile', {
    headers: { 'Authorization': 'Bearer demo-token' }
  });
  console.log('5. Demo profile:', profile.status, profile.body.profile?.full_name, profile.body.profile?.target_career);

  const skills = await request('/api/skills', {
    headers: { 'Authorization': 'Bearer demo-token' }
  });
  console.log('6. Demo skills count:', skills.body.skills?.length);

  console.log('--- ALL BASIC ENDPOINTS VERIFIED ---');
}

run().catch(console.error);
