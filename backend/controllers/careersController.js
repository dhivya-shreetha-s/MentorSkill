import { getSupabaseClientWithToken, getSupabaseClient } from '../services/supabaseService.js';
import { CAREER_ROLES } from '../data/seedData.js';
import { memoryStore } from '../utils/memoryStore.js';

export const getCareers = async (req, res) => {
  try {
    const supabase = req.token ? getSupabaseClientWithToken(req.token) : getSupabaseClient();
    const { data, error } = await supabase.from('career_roles').select('*, career_role_skills(*)').order('title');
    if (!error && data && data.length > 0) {
      return res.json({ careers: data });
    }
    // Return verified seed catalog
    res.json({ careers: CAREER_ROLES });
  } catch (err) {
    res.json({ careers: CAREER_ROLES });
  }
};

export const getCareerById = async (req, res) => {
  try {
    const supabase = req.token ? getSupabaseClientWithToken(req.token) : getSupabaseClient();
    const { data, error } = await supabase.from('career_roles').select('*, career_role_skills(*)').eq('id', req.params.id).single();
    if (!error && data) {
      return res.json({ career: data });
    }
    const found = CAREER_ROLES.find(c => c.id === req.params.id || c.title.toLowerCase() === req.params.id.toLowerCase());
    if (found) return res.json({ career: found });
    res.status(404).json({ error: 'Career not found' });
  } catch (err) {
    const found = CAREER_ROLES.find(c => c.id === req.params.id || c.title.toLowerCase() === req.params.id.toLowerCase());
    if (found) return res.json({ career: found });
    res.status(500).json({ error: err.message });
  }
};

export const selectCareer = async (req, res) => {
  try {
    const { careerTitle } = req.body;
    const userId = req.user?.id || 'demo-user-1';

    // Try Supabase update
    try {
      const supabase = getSupabaseClientWithToken(req.token);
      await supabase.from('profiles').update({ target_career: careerTitle }).eq('id', userId);
    } catch (e) {}

    // Update memoryStore
    if (memoryStore.profiles[userId]) {
      memoryStore.profiles[userId].target_career = careerTitle;
      memoryStore.profiles[userId].updated_at = new Date().toISOString();
    }

    res.json({
      profile: memoryStore.profiles[userId] || { id: userId, target_career: careerTitle },
      message: `Target career updated to ${careerTitle}`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
