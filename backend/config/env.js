import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  supabase: {
    url: process.env.SUPABASE_URL,
    publishableKey: process.env.SUPABASE_PUBLISHABLE_KEY,
  },
  groq: {
    apiKey: process.env.GROQ_API_KEY,
    model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};

// Validate required env vars
const required = ['SUPABASE_URL', 'SUPABASE_PUBLISHABLE_KEY', 'GROQ_API_KEY'];
for (const key of required) {
  if (!process.env[key]) {
    console.warn(`Warning: Missing environment variable ${key}`);
  }
}

export default config;
