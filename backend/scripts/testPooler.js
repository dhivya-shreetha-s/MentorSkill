import pg from 'pg';

const regions = ['ap-south-1', 'ap-southeast-1', 'us-east-1', 'eu-central-1'];
const password = 'plantlover@1234';

async function testRegions() {
  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    console.log(`Testing pooler: ${host}...`);
    const client = new pg.Client({
      host,
      port: 5432,
      database: 'postgres',
      user: 'postgres.qejmpopvibkjwaarexsg',
      password,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000
    });

    try {
      await client.connect();
      console.log(`>>> SUCCESS! Connected to ${host}!`);
      const res = await client.query('SELECT current_database(), current_user;');
      console.log('Query result:', res.rows[0]);
      await client.end();
      return host;
    } catch (err) {
      console.log(`Failed for ${region}:`, err.message);
      try { await client.end(); } catch (e) {}
    }
  }
}

testRegions();
