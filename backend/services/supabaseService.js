import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const isRealToken = (token) => {
  return typeof token === 'string' &&
    token !== 'demo-token' &&
    token.split('.').length === 3;
};

export const withTimeout = (promise, ms = 3000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Supabase query timeout after ${ms}ms`)), ms)
    )
  ]);
};

export const getSupabaseClient = () => createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY,
  {
    auth: { persistSession: false },
    db: { schema: 'public' }
  }
);

export const getSupabaseClientWithToken = (token) => {
  if (!isRealToken(token)) {
    return null;
  }
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_PUBLISHABLE_KEY,
    {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false },
      db: { schema: 'public' }
    }
  );
};
