-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  education TEXT,
  college TEXT,
  current_year TEXT,
  field_of_study TEXT,
  target_career TEXT,
  preferred_learning_style TEXT,
  hours_per_week INTEGER DEFAULT 10,
  career_readiness_score NUMERIC(5,2) DEFAULT 0,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- skills master list
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- user_skills
CREATE TABLE IF NOT EXISTS public.user_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  proficiency_level TEXT CHECK (proficiency_level IN ('Beginner','Intermediate','Advanced','Expert')),
  source TEXT DEFAULT 'self_reported',
  verified BOOLEAN DEFAULT FALSE,
  confidence_score NUMERIC(3,2) DEFAULT 0.5,
  evidence TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, skill_name)
);

-- career_roles
CREATE TABLE IF NOT EXISTS public.career_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL UNIQUE,
  description TEXT,
  level TEXT DEFAULT 'Mid',
  avg_salary TEXT,
  demand TEXT DEFAULT 'High',
  suggested_projects TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- career_role_skills
CREATE TABLE IF NOT EXISTS public.career_role_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  career_role_id UUID REFERENCES public.career_roles(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  required_proficiency TEXT CHECK (required_proficiency IN ('Beginner','Intermediate','Advanced','Expert')),
  priority TEXT DEFAULT 'required' CHECK (priority IN ('required','recommended','optional')),
  is_prerequisite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- assessments
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('Beginner','Intermediate','Advanced')),
  time_limit_minutes INTEGER DEFAULT 15,
  passing_score INTEGER DEFAULT 70,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- assessment_questions
CREATE TABLE IF NOT EXISTS public.assessment_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  difficulty TEXT CHECK (difficulty IN ('Beginner','Intermediate','Advanced')),
  points INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- assessment_results
CREATE TABLE IF NOT EXISTS public.assessment_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE,
  score NUMERIC(5,2),
  total_questions INTEGER,
  correct_answers INTEGER,
  time_taken_minutes NUMERIC(5,2),
  answers JSONB,
  performance_feedback TEXT,
  weak_topics TEXT[],
  strong_topics TEXT[],
  passed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- roadmaps
CREATE TABLE IF NOT EXISTS public.roadmaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  career_role TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','archived','draft')),
  total_milestones INTEGER DEFAULT 0,
  completed_milestones INTEGER DEFAULT 0,
  progress_percentage NUMERIC(5,2) DEFAULT 0,
  ai_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- roadmap_milestones
CREATE TABLE IF NOT EXISTS public.roadmap_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  roadmap_id UUID REFERENCES public.roadmaps(id) ON DELETE CASCADE,
  stage TEXT CHECK (stage IN ('Beginner','Intermediate','Advanced','Industry Readiness')),
  order_index INTEGER NOT NULL,
  skill_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  learning_objectives TEXT[],
  estimated_hours INTEGER DEFAULT 10,
  status TEXT DEFAULT 'locked' CHECK (status IN ('locked','available','in_progress','completed','skipped')),
  resources JSONB,
  practical_exercise TEXT,
  completion_criteria TEXT,
  priority TEXT DEFAULT 'normal',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- learning_resources
CREATE TABLE IF NOT EXISTS public.learning_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_name TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('course','tutorial','documentation','video','project','exercise')),
  url TEXT,
  provider TEXT,
  difficulty TEXT CHECK (difficulty IN ('Beginner','Intermediate','Advanced')),
  duration_hours NUMERIC(5,1),
  is_free BOOLEAN DEFAULT TRUE,
  rating NUMERIC(3,2),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- user_progress
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  milestone_id UUID REFERENCES public.roadmap_milestones(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not_started',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, milestone_id)
);

-- agent_logs
CREATE TABLE IF NOT EXISTS public.agent_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  agent_name TEXT NOT NULL,
  workflow TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','running','completed','failed')),
  input_summary TEXT,
  output_summary TEXT,
  execution_time_ms INTEGER,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- mentor_chats
CREATE TABLE IF NOT EXISTS public.mentor_chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user','assistant')),
  content TEXT NOT NULL,
  context_used JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- roadmap_history
CREATE TABLE IF NOT EXISTS public.roadmap_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  roadmap_id UUID REFERENCES public.roadmaps(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  change_reason TEXT,
  previous_state JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON public.user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_user_id ON public.assessment_results(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmaps_user_id ON public.roadmaps(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_milestones_roadmap_id ON public.roadmap_milestones(roadmap_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_logs_user_id ON public.agent_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_mentor_chats_user_id ON public.mentor_chats(user_id);
CREATE INDEX IF NOT EXISTS idx_career_role_skills_career_id ON public.career_role_skills(career_role_id);

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_role_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;

-- profiles RLS policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- user_skills RLS
CREATE POLICY "Users can manage own skills" ON public.user_skills FOR ALL USING (auth.uid() = user_id);

-- assessment_results RLS
CREATE POLICY "Users can manage own results" ON public.assessment_results FOR ALL USING (auth.uid() = user_id);

-- roadmaps RLS
CREATE POLICY "Users can manage own roadmaps" ON public.roadmaps FOR ALL USING (auth.uid() = user_id);

-- roadmap_milestones RLS
CREATE POLICY "Users can view own milestones" ON public.roadmap_milestones FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.roadmaps r WHERE r.id = roadmap_id AND r.user_id = auth.uid())
);
CREATE POLICY "Users can update own milestones" ON public.roadmap_milestones FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.roadmaps r WHERE r.id = roadmap_id AND r.user_id = auth.uid())
);
CREATE POLICY "Users can insert own milestones" ON public.roadmap_milestones FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.roadmaps r WHERE r.id = roadmap_id AND r.user_id = auth.uid())
);
CREATE POLICY "Backend can delete milestones" ON public.roadmap_milestones FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.roadmaps r WHERE r.id = roadmap_id AND r.user_id = auth.uid())
);

-- user_progress RLS
CREATE POLICY "Users can manage own progress" ON public.user_progress FOR ALL USING (auth.uid() = user_id);

-- agent_logs RLS
CREATE POLICY "Users can view own agent logs" ON public.agent_logs FOR ALL USING (auth.uid() = user_id);

-- mentor_chats RLS
CREATE POLICY "Users can manage own chats" ON public.mentor_chats FOR ALL USING (auth.uid() = user_id);

-- roadmap_history RLS
CREATE POLICY "Users can view own roadmap history" ON public.roadmap_history FOR ALL USING (auth.uid() = user_id);

-- Public catalog policies
CREATE POLICY "Authenticated read skills" ON public.skills FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read careers" ON public.career_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read career skills" ON public.career_role_skills FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read assessments" ON public.assessments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read questions" ON public.assessment_questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read resources" ON public.learning_resources FOR SELECT TO authenticated USING (true);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER user_skills_updated_at BEFORE UPDATE ON public.user_skills FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER roadmaps_updated_at BEFORE UPDATE ON public.roadmaps FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER roadmap_milestones_updated_at BEFORE UPDATE ON public.roadmap_milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER user_progress_updated_at BEFORE UPDATE ON public.user_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER agent_logs_updated_at BEFORE UPDATE ON public.agent_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
