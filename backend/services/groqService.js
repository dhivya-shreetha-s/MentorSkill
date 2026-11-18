import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// LRU/TTL Response Cache for peak efficiency & token conservation
const responseCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_CACHE_ENTRIES = 200;

// Model fallback chain for zero-downtime rate limit resilience
const CANDIDATE_MODELS = [
  process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'qwen/qwen3.8-27b'
];

const getCacheKey = (systemPrompt, userMessage, model) => {
  return `${model || 'default'}::${systemPrompt.slice(0, 80)}::${userMessage.slice(0, 150)}`;
};

export const clearGroqCache = () => {
  responseCache.clear();
};

export const getGroqCacheStats = () => {
  return {
    size: responseCache.size,
    maxSize: MAX_CACHE_ENTRIES,
    ttlMinutes: CACHE_TTL_MS / 60000
  };
};

export const callGroq = async (systemPrompt, userMessage, options = {}) => {
  const primaryModel = options.model || process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
  const cacheKey = getCacheKey(systemPrompt, userMessage, primaryModel);

  // 1. Check in-memory cache
  if (!options.bypassCache && responseCache.has(cacheKey)) {
    const cached = responseCache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.content;
    }
    responseCache.delete(cacheKey);
  }

  // 2. Try primary and fallback models on 429
  const modelsToTry = options.model ? [options.model] : CANDIDATE_MODELS;
  let lastError = null;

  for (const model of modelsToTry) {
    for (let attempt = 1; attempt <= (options.retries || 2); attempt++) {
      try {
        const response = await groq.chat.completions.create({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          temperature: options.temperature ?? 0.3,
          max_tokens: options.maxTokens || 2500
        });

        const content = response.choices?.[0]?.message?.content || '';

        // Cache successful response
        if (responseCache.size >= MAX_CACHE_ENTRIES) {
          const oldestKey = responseCache.keys().next().value;
          responseCache.delete(oldestKey);
        }
        responseCache.set(cacheKey, { content, timestamp: Date.now() });

        return content;
      } catch (err) {
        lastError = err;
        const isRateLimit = err?.status === 429 || err?.message?.includes('rate_limit') || err?.message?.includes('Rate limit');
        
        if (isRateLimit) {
          console.warn(`Groq model ${model} reached rate limit, switching to fallback model...`);
          break; // Break inner loop to try next candidate model
        }

        const isTransient = err?.status >= 500 || err?.code === 'ETIMEDOUT' || err?.code === 'ECONNRESET';
        if (isTransient && attempt < (options.retries || 2)) {
          const backoff = 1000 * attempt;
          await new Promise(r => setTimeout(r, backoff));
        } else {
          break;
        }
      }
    }
  }

  throw lastError || new Error('Groq execution failed across all candidate models');
};

export const callGroqJSON = async (systemPrompt, userMessage, options = {}) => {
  const prompt = systemPrompt + '\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown codeblocks, no explanations, strictly raw JSON.';
  let lastParseError = null;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const text = await callGroq(prompt, userMessage, {
        temperature: 0.1,
        maxTokens: options.maxTokens || 3000,
        ...options,
        bypassCache: attempt > 1 || options.bypassCache
      });

      // Robust JSON extraction
      let cleaned = text.trim();
      cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```$/g, '').trim();

      const firstBrace = cleaned.indexOf('{');
      const firstBracket = cleaned.indexOf('[');
      let startIndex = -1;
      let endIndex = -1;

      if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
        startIndex = firstBrace;
        endIndex = cleaned.lastIndexOf('}');
      } else if (firstBracket !== -1) {
        startIndex = firstBracket;
        endIndex = cleaned.lastIndexOf(']');
      }

      if (startIndex !== -1 && endIndex !== -1 && endIndex >= startIndex) {
        cleaned = cleaned.substring(startIndex, endIndex + 1);
      }

      return JSON.parse(cleaned);
    } catch (e) {
      lastParseError = e;
      if (attempt === 3) {
        throw new Error(`Failed to parse JSON response from AI agent after 3 attempts: ${lastParseError.message}`);
      }
    }
  }
};
