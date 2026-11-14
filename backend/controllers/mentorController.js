import { getSupabaseClientWithToken } from '../services/supabaseService.js';
import { getMentorResponse } from '../agents/mentorAgent.js';
import { memoryStore, getUserProfile, getUserSkills } from '../utils/memoryStore.js';

export const sendMessage = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user-1';
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // 1. Gather rich user context
    let profile = getUserProfile(userId);
    let skills = getUserSkills(userId);
    let roadmap = memoryStore.roadmaps[userId] || null;

    try {
      const supabase = getSupabaseClientWithToken(req.token);
      const { data: p } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (p) profile = p;

      const { data: s } = await supabase.from('user_skills').select('*').eq('user_id', userId);
      if (s) skills = s;

      const { data: r } = await supabase.from('roadmaps').select('*').eq('user_id', userId).eq('status', 'active').limit(1);
      if (r?.length > 0) roadmap = r[0];
    } catch (e) {}

    // 2. Fetch recent conversation history
    const history = memoryStore.mentorChats[userId] || [];

    // Save user message
    const userMsg = {
      id: `chat-${Date.now()}-u`,
      user_id: userId,
      role: 'user',
      content: message,
      created_at: new Date().toISOString()
    };
    if (!memoryStore.mentorChats[userId]) memoryStore.mentorChats[userId] = [];
    memoryStore.mentorChats[userId].push(userMsg);

    // 3. Call Groq API via mentorAgent
    const aiResult = await getMentorResponse({
      userMessage: message,
      userProfile: profile,
      userSkills: skills,
      currentRoadmap: roadmap,
      conversationHistory: history.slice(-6)
    });

    const aiMsg = {
      id: `chat-${Date.now()}-a`,
      user_id: userId,
      role: 'assistant',
      content: aiResult.response,
      created_at: new Date().toISOString()
    };
    memoryStore.mentorChats[userId].push(aiMsg);

    // Save to Supabase in background
    try {
      const supabase = getSupabaseClientWithToken(req.token);
      await supabase.from('mentor_chats').insert([userMsg, aiMsg]);
    } catch (e) {}

    res.json({
      response: aiResult.response,
      reply: aiResult.response,
      message: aiResult.response,
      chatMessage: aiMsg
    });
  } catch (err) {
    console.error('Mentor error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user-1';

    try {
      const supabase = getSupabaseClientWithToken(req.token);
      const { data, error } = await supabase.from('mentor_chats').select('*').eq('user_id', userId).order('created_at').limit(50);
      if (!error && data && data.length > 0) {
        return res.json({ history: data });
      }
    } catch (e) {}

    res.json({ history: memoryStore.mentorChats[userId] || [] });
  } catch (err) {
    const userId = req.user?.id || 'demo-user-1';
    res.json({ history: memoryStore.mentorChats[userId] || [] });
  }
};
export const clearChatHistory = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user-1';
    try {
      const supabase = getSupabaseClientWithToken(req.token);
      await supabase.from('mentor_chats').delete().eq('user_id', userId);
    } catch (e) {}

    memoryStore.mentorChats[userId] = [];
    res.json({ message: 'Chat history cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
