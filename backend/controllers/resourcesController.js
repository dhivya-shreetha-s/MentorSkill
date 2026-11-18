import { getSupabaseClientWithToken, getSupabaseClient, withTimeout } from '../services/supabaseService.js';
import { LEARNING_RESOURCES } from '../data/seedData.js';

export const getResources = async (req, res) => {
  try {
    const supabase = getSupabaseClientWithToken(req.token);
    if (supabase) {
      try {
        const { data, error } = await withTimeout(
          supabase.from('learning_resources').select('*').order('skill_name'),
          2000
        );
        if (!error && data && data.length > 0) {
          return res.json({ resources: data });
        }
      } catch (e) {}
    }

    res.json({ resources: LEARNING_RESOURCES });
  } catch (err) {
    res.json({ resources: LEARNING_RESOURCES });
  }
};

export const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseClientWithToken(req.token);
    if (supabase) {
      try {
        const { data, error } = await withTimeout(
          supabase.from('learning_resources').select('*').eq('id', id).single(),
          2000
        );
        if (!error && data) {
          return res.json({ resource: data });
        }
      } catch (e) {}
    }

    const found = LEARNING_RESOURCES.find(r => r.skill_name.toLowerCase() === id.toLowerCase() || r.title.toLowerCase().includes(id.toLowerCase()));
    if (found) return res.json({ resource: found });

    res.json({ resource: LEARNING_RESOURCES[0] });
  } catch (err) {
    res.json({ resource: LEARNING_RESOURCES[0] });
  }
};

export const getResourcesBySkill = async (req, res) => {
  try {
    const { skillName } = req.params;
    const supabase = getSupabaseClientWithToken(req.token);
    if (supabase) {
      try {
        const { data, error } = await withTimeout(
          supabase.from('learning_resources').select('*').ilike('skill_name', `%${skillName}%`),
          2000
        );
        if (!error && data && data.length > 0) {
          return res.json({ resources: data });
        }
      } catch (e) {}
    }

    const filtered = LEARNING_RESOURCES.filter(r => 
      r.skill_name.toLowerCase().includes(skillName.toLowerCase())
    );
    res.json({ resources: filtered });
  } catch (err) {
    const filtered = LEARNING_RESOURCES.filter(r => 
      r.skill_name.toLowerCase().includes(req.params.skillName.toLowerCase())
    );
    res.json({ resources: filtered });
  }
};
