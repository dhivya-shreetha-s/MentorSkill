import { getSupabaseClientWithToken } from '../services/supabaseService.js';
import { memoryStore } from '../utils/memoryStore.js';

export const getAgentLogs = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user-1';
    const supabase = getSupabaseClientWithToken(req.token);
    if (supabase) {
      try {
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
    }

    const logs = memoryStore.agentLogs.filter(l => l.user_id === userId || !l.user_id);
    res.json({ logs: logs.length > 0 ? logs : memoryStore.agentLogs });
  } catch (err) {
    res.json({ logs: memoryStore.agentLogs });
  }
};

export const getAgentStats = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user-1';
    let data = [];
    const supabase = getSupabaseClientWithToken(req.token);
    if (supabase) {
      try {
        const { data: d } = await supabase.from('agent_logs').select('*').eq('user_id', userId);
        if (d && d.length > 0) data = d;
      } catch (e) {}
    }

    if (data.length === 0) data = memoryStore.agentLogs;

    const total = data.length;
    const completed = data.filter(l => l.status === 'completed').length;
    const failed = data.filter(l => l.status === 'failed').length;
    const running = data.filter(l => l.status === 'running').length;

    res.json({
      stats: {
        total,
        completed,
        failed,
        running
      }
    });
  } catch (err) {
    res.json({
      stats: {
        total: memoryStore.agentLogs.length,
        completed: memoryStore.agentLogs.length,
        failed: 0,
        running: 0
      }
    });
  }
};
