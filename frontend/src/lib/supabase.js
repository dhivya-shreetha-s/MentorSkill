import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qejmpopvibkjwaarexsg.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_C60SCo0D4UR7Wow4eDFIWg_PlzweXBL';

export const supabase = createClient(supabaseUrl, supabaseKey);
