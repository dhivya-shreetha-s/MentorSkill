import { getSupabaseClientWithToken, getSupabaseClient, withTimeout } from '../services/supabaseService.js';
import { memoryStore, getUserSkills } from '../utils/memoryStore.js';

// Master skills list
const DEFAULT_MASTER_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js', 'Express',
  'Python', 'Django', 'FastAPI', 'Flask', 'SQL', 'PostgreSQL', 'MySQL', 'MongoDB',
  'HTML', 'CSS', 'Tailwind CSS', 'Git', 'GitHub', 'Docker', 'Kubernetes', 'AWS',
  'REST APIs', 'GraphQL', 'Data Structures', 'Algorithms', 'Machine Learning',
  'Deep Learning', 'PyTorch', 'Pandas', 'NumPy', 'CI/CD', 'Linux'
];

export const getMasterSkills = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { data } = await withTimeout(supabase.from('skills').select('*').order('name'), 1500);
    if (data && data.length > 0) return res.json({ skills: data });
    res.json({ skills: DEFAULT_MASTER_SKILLS.map(name => ({ id: name, name })) });
  } catch (e) {
    res.json({ skills: DEFAULT_MASTER_SKILLS.map(name => ({ id: name, name })) });
  }
};

export const getUserSkillsController = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user-1';
    try {
      const supabase = getSupabaseClientWithToken(req.token);
      const { data, error } = await supabase.from('user_skills').select('*').eq('user_id', userId).order('created_at');
      if (!error && data && data.length > 0) {
        return res.json({ skills: data });
      }
    } catch (e) {}

    res.json({ skills: getUserSkills(userId) });
  } catch (err) {
    const userId = req.user?.id || 'demo-user-1';
    res.json({ skills: getUserSkills(userId) });
  }
};

export const addUserSkill = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user-1';
    const { skill_name, proficiency_level, evidence } = req.body;

    const newSkill = {
      id: `us-${Date.now()}`,
      user_id: userId,
      skill_name,
      proficiency_level: proficiency_level || 'Beginner',
      source: 'self_reported',
      verified: false,
      confidence_score: 0.6,
      evidence: evidence || 'Self-reported by user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      if (req.token && req.token !== 'demo-token') {
        const supabase = getSupabaseClientWithToken(req.token);
        const dbPayload = {
          user_id: userId,
          skill_name,
          proficiency_level: proficiency_level || 'Beginner',
          source: 'self_reported',
          verified: false,
          confidence_score: 0.6,
          evidence: evidence || 'Self-reported by user'
        };
        const { data, error } = await supabase.from('user_skills').upsert(dbPayload, { onConflict: 'user_id,skill_name' }).select().single();
        if (!error && data) {
          return res.json({ skill: data });
        }
      }
    } catch (e) {}

    if (!memoryStore.userSkills[userId]) memoryStore.userSkills[userId] = [];
    const existingIdx = memoryStore.userSkills[userId].findIndex(s => s.skill_name?.toLowerCase() === skill_name?.toLowerCase());
    if (existingIdx >= 0) {
      memoryStore.userSkills[userId][existingIdx] = newSkill;
    } else {
      memoryStore.userSkills[userId].push(newSkill);
    }

    res.json({ skill: newSkill });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const batchSaveUserSkills = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user-1';
    const { skills } = req.body;

    if (!Array.isArray(skills)) {
      return res.status(400).json({ error: 'Skills must be an array' });
    }

    const formatted = skills.map((s, idx) => ({
      id: `us-${Date.now()}-${idx}`,
      user_id: userId,
      skill_name: s.skill_name || s.name,
      proficiency_level: s.proficiency_level || s.proficiency || 'Beginner',
      source: 'onboarding',
      verified: false,
      confidence_score: 0.6,
      created_at: new Date().toISOString()
    }));

    try {
      if (req.token && req.token !== 'demo-token') {
        const supabase = getSupabaseClientWithToken(req.token);
        const dbPayloads = formatted.map(s => ({
          user_id: userId,
          skill_name: s.skill_name,
          proficiency_level: s.proficiency_level,
          source: 'onboarding',
          verified: false,
          confidence_score: 0.6
        }));
        await supabase.from('user_skills').upsert(dbPayloads, { onConflict: 'user_id,skill_name' });
      }
    } catch (e) {}

    memoryStore.userSkills[userId] = formatted;
    res.json({ skills: formatted, message: 'Skills saved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUserSkill = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user-1';
    const { id } = req.params;
    const { proficiency_level, evidence } = req.body;

    try {
      const supabase = getSupabaseClientWithToken(req.token);
      const { data, error } = await supabase.from('user_skills')
        .update({ proficiency_level, evidence, updated_at: new Date().toISOString() })
        .eq('id', id).select().single();
      if (!error && data) {
        return res.json({ skill: data });
      }
    } catch (e) {}

    const skills = memoryStore.userSkills[userId] || [];
    const skill = skills.find(s => s.id === id || s.skill_name.toLowerCase() === id.toLowerCase());
    if (skill) {
      if (proficiency_level) skill.proficiency_level = proficiency_level;
      if (evidence) skill.evidence = evidence;
      skill.updated_at = new Date().toISOString();
      return res.json({ skill });
    }

    res.status(404).json({ error: 'Skill not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUserSkill = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user-1';
    const { id } = req.params;

    try {
      const supabase = getSupabaseClientWithToken(req.token);
      await supabase.from('user_skills').delete().eq('id', id);
    } catch (e) {}

    if (memoryStore.userSkills[userId]) {
      memoryStore.userSkills[userId] = memoryStore.userSkills[userId].filter(
        s => s.id !== id && s.skill_name.toLowerCase() !== id.toLowerCase()
      );
    }

    res.json({ message: 'Skill deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Aliases for compatibility
export { getUserSkillsController as getUserSkills, getUserSkillsController as getSkills, addUserSkill as addSkill, updateUserSkill as updateSkill, deleteUserSkill as deleteSkill };
