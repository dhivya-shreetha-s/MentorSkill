import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function test() {
  const model = 'openai/gpt-oss-120b';
  console.log('Testing Groq API with model:', model);
  try {
    const res = await groq.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: 'You are MentorSkill AI orchestrator. Answer in JSON with key "greeting".' },
        { role: 'user', content: 'Say hello to Alex Johnson.' }
      ],
      max_tokens: 100
    });
    console.log('Groq Response:\n', res.choices[0].message.content);
    console.log('\nGroq API Test with', model, 'SUCCESSFUL!');
  } catch (err) {
    console.error('Groq API Error:', err);
  }
}

test();
