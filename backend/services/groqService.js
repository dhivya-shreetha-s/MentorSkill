import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const callGroq = async (systemPrompt, userMessage, options = {}) => {
  const response = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ],
    temperature: options.temperature || 0.3,
    max_tokens: options.maxTokens || 2000,
    ...options
  });
  return response.choices[0].message.content;
};

export const callGroqJSON = async (systemPrompt, userMessage) => {
  const prompt = systemPrompt + '\n\nIMPORTANT: Respond ONLY with valid JSON. No explanation, no markdown, just pure JSON.';
  let attempt = 0;
  while (attempt < 3) {
    try {
      const text = await callGroq(prompt, userMessage, { temperature: 0.1 });
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      attempt++;
      if (attempt === 3) throw new Error(`Failed to parse JSON after 3 attempts: ${e.message}`);
    }
  }
};
