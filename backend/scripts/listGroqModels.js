import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function listModels() {
  try {
    const list = await groq.models.list();
    console.log('Available Groq models:');
    list.data.forEach(m => console.log(`- ${m.id} (owned by ${m.owned_by})`));
  } catch (err) {
    console.error('List error:', err);
  }
}

listModels();
