import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qejmpopvibkjwaarexsg.supabase.co';
const supabaseKey = 'sb_publishable_C60SCo0D4UR7Wow4eDFIWg_PlzweXBL';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Testing Supabase client over HTTPS...');
  try {
    const { data, error } = await supabase.from('career_roles').select('*').limit(5);
    console.log('career_roles query result:', { data, error });
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
