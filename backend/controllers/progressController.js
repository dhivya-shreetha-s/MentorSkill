import { getSupabaseClientWithToken } from '../services/supabaseService.js';
import { memoryStore, getUserProfile, getUserSkills } from '../utils/memoryStore.js';

export const getProgress = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user-1';

    let profile = getUserProfile(userId);
    let skills = getUserSkills(userId);
    let roadmap = memoryStore.roadmaps[userId] || null;
    let assessments = memoryStore.assessmentResults[userId] || [];

    try {
      const supabase = getSupabaseClientWithToken(req.token);
      const { data: p } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (p) profile = p;

      const { data: s } = await supabase.from('user_skills').select('*').eq('user_id', userId);
      if (s) skills = s;

      const { data: r } = await supabase.from('roadmaps').select('*, roadmap_milestones(*)').eq('user_id', userId).eq('status', 'active').limit(1);
      if (r?.length > 0) roadmap = r[0];

      const { data: a } = await supabase.from('assessment_results').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (a?.length > 0) assessments = a;
    } catch (e) {}

    const skillProficiencyBreakdown = {
      Beginner: 0,
      Intermediate: 0,
      Advanced: 0,
      Expert: 0
    };

    (skills || []).forEach(s => {
      if (skillProficiencyBreakdown[s.proficiency_level] !== undefined) {
        skillProficiencyBreakdown[s.proficiency_level]++;
      }
    });

    const totalAssessments = assessments.length;
    const passedAssessments = assessments.filter(a => a.passed).length;
    const avgScore = totalAssessments > 0
      ? Math.round(assessments.reduce((acc, curr) => acc + (curr.score || 0), 0) / totalAssessments)
      : 0;

    res.json({
      careerReadinessScore: profile?.career_readiness_score || 42.5,
      targetCareer: profile?.target_career || 'Full Stack Developer',
      totalSkills: skills?.length || 0,
      strongSkills: skills?.filter(s => s.proficiency_level === 'Advanced' || s.proficiency_level === 'Expert').length || 0,
      skillBreakdown: skillProficiencyBreakdown,
      roadmap: {
        totalMilestones: roadmap?.total_milestones || roadmap?.milestones?.length || 0,
        completedMilestones: roadmap?.completed_milestones || 0,
        progressPercentage: roadmap?.progress_percentage || 0
      },
      assessments: {
        total: totalAssessments,
        passed: passedAssessments,
        averageScore: avgScore,
        history: assessments
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user-1';
    const { milestone_id, status, notes } = req.body;

    try {
      const supabase = getSupabaseClientWithToken(req.token);
      await supabase.from('user_progress').upsert({
        user_id: userId,
        milestone_id,
        status,
        notes,
        updated_at: new Date().toISOString()
      });
    } catch (e) {}

    res.json({ message: 'Progress updated', milestone_id, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
