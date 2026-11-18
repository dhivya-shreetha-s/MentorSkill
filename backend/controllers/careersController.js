import { getSupabaseClient, getSupabaseClientWithToken } from '../services/supabaseService.js';
import { CAREER_ROLES } from '../data/seedData.js';
import { memoryStore } from '../utils/memoryStore.js';

export const getCareers = async (req, res) => {
  try {
    if (req.token && req.token !== 'demo-token') {
      try {
        const supabase = getSupabaseClientWithToken(req.token);
        const { data, error } = await supabase.from('career_roles').select('*, career_role_skills(*)');
        if (!error && data && data.length > 0) {
          return res.json({ careers: data });
        }
      } catch (e) {}
    }

    res.json({ careers: CAREER_ROLES });
  } catch (err) {
    res.json({ careers: CAREER_ROLES });
  }
};

export const getCareerById = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.token && req.token !== 'demo-token') {
      try {
        const supabase = getSupabaseClientWithToken(req.token);
        const { data, error } = await supabase.from('career_roles').select('*, career_role_skills(*)').eq('id', id).single();
        if (!error && data) {
          return res.json({ career: data });
        }
      } catch (e) {}
    }

    const found = CAREER_ROLES.find(c => c.id === id || c.title.toLowerCase() === id.toLowerCase());
    if (found) {
      return res.json({ career: found });
    }

    res.status(404).json({ error: 'Career role not found' });
  } catch (err) {
    const found = CAREER_ROLES.find(c => c.id === req.params.id || c.title.toLowerCase() === req.params.id.toLowerCase());
    if (found) return res.json({ career: found });
    res.status(500).json({ error: err.message });
  }
};

export const selectCareer = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user-1';
    let careerTitle = req.body.careerTitle || req.body.careerRole || req.body.target_career;

    if (!careerTitle && req.body.careerRoleId) {
      const match = CAREER_ROLES.find(c => c.id === req.body.careerRoleId);
      careerTitle = match ? match.title : req.body.careerRoleId;
    }

    if (!careerTitle) {
      careerTitle = 'Full Stack Developer';
    }

    // Try Supabase update for authenticated real users
    if (req.token && req.token !== 'demo-token') {
      try {
        const supabase = getSupabaseClientWithToken(req.token);
        await supabase.from('profiles').update({ target_career: careerTitle }).eq('id', userId);
      } catch (e) {}
    }

    // Update memoryStore
    if (!memoryStore.profiles[userId]) {
      memoryStore.profiles[userId] = { id: userId };
    }
    memoryStore.profiles[userId].target_career = careerTitle;
    memoryStore.profiles[userId].updated_at = new Date().toISOString();

    res.json({
      success: true,
      profile: memoryStore.profiles[userId],
      message: `Target career updated to ${careerTitle}`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
