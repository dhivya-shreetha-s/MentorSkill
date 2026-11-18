import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });
import { errorHandler } from './middleware/errorHandler.js';

import profileRoutes from './routes/profile.js';
import skillsRoutes from './routes/skills.js';
import assessmentsRoutes from './routes/assessments.js';
import careersRoutes from './routes/careers.js';
import analysisRoutes from './routes/analysis.js';
import roadmapsRoutes from './routes/roadmaps.js';
import resourcesRoutes from './routes/resources.js';
import mentorRoutes from './routes/mentor.js';
import progressRoutes from './routes/progress.js';
import agentsRoutes from './routes/agents.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(null, true); // Permissive in dev
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'MentorSkill API'
  });
});

// Mount Routes
app.use('/api/profile', profileRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/assessments', assessmentsRoutes);
app.use('/api/careers', careersRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/roadmaps', roadmapsRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/agents', agentsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});

// Global Error Handler
app.use(errorHandler);

// Start server only when executed directly (not when imported in tests)
const isMainModule = process.argv[1] && (
  process.argv[1] === fileURLToPath(import.meta.url) ||
  process.argv[1].endsWith('server.js')
);

if (isMainModule) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MentorSkill backend server running on port ${PORT} bound to 0.0.0.0`);
  });
}

export { app };
export default app;
