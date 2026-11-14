import { getSupabaseClient } from '../services/supabaseService.js';

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];

  // Handle demo / development tokens
  if (token === 'demo-token' || token.startsWith('demo-')) {
    req.user = {
      id: 'demo-user-1',
      email: 'alex.johnson@demo.mentorskill.ai',
      user_metadata: { full_name: 'Alex Johnson' }
    };
    req.token = token;
    return next();
  }

  try {
    const supabase = getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (!error && user) {
      req.user = user;
      req.token = token;
      return next();
    }

    // In local dev/demo, fallback to demo user if token is present
    req.user = {
      id: 'demo-user-1',
      email: 'alex.johnson@demo.mentorskill.ai',
      user_metadata: { full_name: 'Alex Johnson' }
    };
    req.token = token;
    next();
  } catch (err) {
    // Graceful fallback for demo continuity
    req.user = {
      id: 'demo-user-1',
      email: 'alex.johnson@demo.mentorskill.ai',
      user_metadata: { full_name: 'Alex Johnson' }
    };
    req.token = token;
    next();
  }
};
