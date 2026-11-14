import pg from 'pg';

async function testOne(host, port, user) {
  console.log(`Testing ${host}:${port} with ${user}...`);
  const client = new pg.Client({
    host,
    port,
    database: 'postgres',
    user,
    password: 'plantlover@1234',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000
  });

  try {
    await client.connect();
    console.log(`>>> CONNECTED TO ${host}:${port}!`);
    const res = await client.query('SELECT 1 as test');
    console.log('Result:', res.rows);
    await client.end();
  } catch (e) {
    console.log(`Error: code=${e.code}, message=${e.message}, name=${e.name}`);
    try { await client.end(); } catch (err) {}
  }
}

async function main() {
  await testOne('aws-0-ap-south-1.pooler.supabase.com', 6543, 'postgres.qejmpopvibkjwaarexsg');
  await testOne('aws-0-ap-southeast-1.pooler.supabase.com', 6543, 'postgres.qejmpopvibkjwaarexsg');
  await testOne('aws-0-us-east-1.pooler.supabase.com', 6543, 'postgres.qejmpopvibkjwaarexsg');
}

main();
