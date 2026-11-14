import { getSupabaseClientWithToken } from '../services/supabaseService.js';
import { memoryStore } from '../utils/memoryStore.js';

export const getRoadmap = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user-1';

    try {
      const supabase = getSupabaseClientWithToken(req.token);
      const { data, error } = await supabase
        .from('roadmaps').select('*, roadmap_milestones(*)')
        .eq('user_id', userId).eq('status', 'active')
        .order('created_at', { ascending: false }).limit(1);

      if (!error && data?.length > 0) {
        const roadmap = data[0];
        roadmap.roadmap_milestones?.sort((a, b) => a.order_index - b.order_index);
        return res.json({ roadmap });
      }
    } catch (e) {}

    const roadmap = memoryStore.roadmaps[userId] || null;
    res.json({ roadmap });
  } catch (err) {
    const userId = req.user?.id || 'demo-user-1';
    res.json({ roadmap: memoryStore.roadmaps[userId] || null });
  }
};

export const updateMilestoneStatus = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user-1';
    const { milestoneId } = req.params;
    const { status } = req.body;

    try {
      const supabase = getSupabaseClientWithToken(req.token);
      const { data, error } = await supabase.from('roadmap_milestones').update({ status }).eq('id', milestoneId).select().single();
      if (!error && data) {
        if (data.roadmap_id) {
          const { data: milestones } = await supabase.from('roadmap_milestones').select('status').eq('roadmap_id', data.roadmap_id);
          const completed = milestones?.filter(m => m.status === 'completed').length || 0;
          const total = milestones?.length || 0;
          await supabase.from('roadmaps').update({
            completed_milestones: completed,
            total_milestones: total,
            progress_percentage: total > 0 ? Math.round((completed / total) * 100) : 0
          }).eq('id', data.roadmap_id);
        }
        return res.json({ milestone: data });
      }
    } catch (e) {}

    // Update in memoryStore
    const roadmap = memoryStore.roadmaps[userId];
    if (roadmap && roadmap.milestones) {
      const ms = roadmap.milestones.find(m => m.id === milestoneId);
      if (ms) {
        ms.status = status;
        const completed = roadmap.milestones.filter(m => m.status === 'completed').length;
        const total = roadmap.milestones.length;
        roadmap.completed_milestones = completed;
        roadmap.progress_percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        return res.json({ milestone: ms, roadmap });
      }
    }

    res.json({ message: 'Milestone updated', status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRoadmapHistory = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user-1';
    try {
      const supabase = getSupabaseClientWithToken(req.token);
      const { data, error } = await supabase.from('roadmap_history').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (!error && data) {
        return res.json({ history: data });
      }
    } catch (e) {}

    res.json({ history: [] });
  } catch (err) {
    res.json({ history: [] });
  }
};
