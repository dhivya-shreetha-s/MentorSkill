import { getSupabaseClientWithToken } from '../services/supabaseService.js';
import { memoryStore, getUserProfile } from '../utils/memoryStore.js';

export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user-1';
    try {
      if (req.token && req.token !== 'demo-token') {
        const supabase = getSupabaseClientWithToken(req.token);
        const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
        if (!error && data) {
          memoryStore.profiles[userId] = { ...data };
          return res.json({ profile: data });
        }
      }
    } catch (e) {}

    const profile = getUserProfile(userId);
    res.json({ profile });
  } catch (err) {
    const userId = req.user?.id || 'demo-user-1';
    res.json({ profile: getUserProfile(userId) });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user-1';
    const allowedFields = [
      'full_name', 'email', 'education', 'college', 'current_year',
      'field_of_study', 'target_career', 'preferred_learning_style',
      'hours_per_week', 'career_readiness_score', 'onboarding_completed'
    ];

    const dbPayload = { id: userId, updated_at: new Date().toISOString() };
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        dbPayload[key] = req.body[key];
      }
    }

    try {
      if (req.token && req.token !== 'demo-token') {
        const supabase = getSupabaseClientWithToken(req.token);
        const { data, error } = await supabase.from('profiles').upsert(dbPayload).select().single();
        if (!error && data) {
          memoryStore.profiles[userId] = { ...data };
          return res.json({ profile: data });
        }
      }
    } catch (e) {
      console.warn('Supabase profile update warning:', e.message);
    }

    // Update memoryStore
    memoryStore.profiles[userId] = {
      ...(memoryStore.profiles[userId] || getUserProfile('demo-user-1')),
      ...req.body,
      id: userId,
      updated_at: new Date().toISOString()
    };

    res.json({ profile: memoryStore.profiles[userId] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
