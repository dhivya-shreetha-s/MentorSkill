import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new pg.Client({
  host: 'db.qejmpopvibkjwaarexsg.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'plantlover@1234',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  console.log('Connecting to Supabase PostgreSQL...');
  try {
    await client.connect();
    console.log('Connected successfully!');

    const schemaPath = path.join(__dirname, '../supabase/migrations/001_initial_schema.sql');
    console.log(`Executing schema: ${schemaPath}`);
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schemaSql);
    console.log('Schema migration completed successfully!');

    const seedPath = path.join(__dirname, '../supabase/migrations/002_seed_data.sql');
    console.log(`Executing seed data: ${seedPath}`);
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    await client.query(seedSql);
    console.log('Seed data migration completed successfully!');

    // Verify row counts
    const careersRes = await client.query('SELECT count(*) FROM public.career_roles');
    console.log(`Career roles count: ${careersRes.rows[0].count}`);

    const questionsRes = await client.query('SELECT count(*) FROM public.assessment_questions');
    console.log(`Assessment questions count: ${questionsRes.rows[0].count}`);

    const resourcesRes = await client.query('SELECT count(*) FROM public.learning_resources');
    console.log(`Learning resources count: ${resourcesRes.rows[0].count}`);

    console.log('Database setup and verification completely SUCCESSFUL!');
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
