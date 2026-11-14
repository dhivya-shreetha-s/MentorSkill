import { getSupabaseClientWithToken } from '../services/supabaseService.js';
import { runInitialCareerAnalysis, runCareerGoalChange } from '../orchestrator/agentOrchestrator.js';
import { memoryStore } from '../utils/memoryStore.js';

export const triggerAnalysis = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user-1';
    const target = req.body?.targetCareer || req.body?.careerRole;
    if (target) {
      if (!memoryStore.profiles[userId]) {
        memoryStore.profiles[userId] = {};
      }
      memoryStore.profiles[userId].target_career = target;
    }
    const result = await runInitialCareerAnalysis(userId, req.token);
    res.json({ success: true, result });
  } catch (err) {
    console.error('triggerAnalysis error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const getLatestAnalysis = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user-1';
    const existing = memoryStore.roadmaps[userId];
    if (existing) {
      return res.json({
        analysis: {
          careerReadiness: existing.career_readiness_score || 42.5,
          careerRole: existing.career_role,
          roadmap: existing
        }
      });
    }

    // Run initial analysis
    const result = await runInitialCareerAnalysis(userId, req.token);
    res.json({ analysis: result });
  } catch (err) {
    res.json({
      analysis: {
        careerReadiness: 42.5,
        careerRole: 'Full Stack Developer',
        matchedSkills: [{ skillName: 'Python' }, { skillName: 'SQL' }],
        missingSkills: [{ skillName: 'JavaScript' }, { skillName: 'React' }, { skillName: 'Node.js' }]
      }
    });
  }
};

export const getAgentLogs = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user-1';
    try {
      const supabase = getSupabaseClientWithToken(req.token);
      const { data, error } = await supabase
        .from('agent_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);
      if (!error && data && data.length > 0) {
        return res.json({ logs: data });
      }
    } catch (e) {}

    const logs = memoryStore.agentLogs.filter(l => l.user_id === userId || !l.user_id);
    res.json({ logs: logs.length > 0 ? logs : memoryStore.agentLogs });
  } catch (err) {
    res.json({ logs: memoryStore.agentLogs });
  }
};

export const changeCareerGoal = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user-1';
    const { newCareerRole } = req.body;
    if (!newCareerRole) {
      return res.status(400).json({ error: 'newCareerRole is required' });
    }
    const result = await runCareerGoalChange(userId, req.token, newCareerRole);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
