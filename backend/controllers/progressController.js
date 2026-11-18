import { getSupabaseClientWithToken, withTimeout } from '../services/supabaseService.js';
import { memoryStore, getUserProfile, getUserSkills } from '../utils/memoryStore.js';
import { getDefaultRoadmap } from './roadmapController.js';

export const getProgress = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user-1';

    let profile = getUserProfile(userId);
    let skills = getUserSkills(userId);
    let roadmap = memoryStore.roadmaps[userId] || getDefaultRoadmap(userId);
    let assessments = memoryStore.assessmentResults[userId] || [];

    const supabase = getSupabaseClientWithToken(req.token);
    if (supabase) {
      try {
        const [pRes, sRes, rRes, aRes] = await withTimeout(
          Promise.all([
            supabase.from('profiles').select('*').eq('id', userId).single(),
            supabase.from('user_skills').select('*').eq('user_id', userId),
            supabase.from('roadmaps').select('*, roadmap_milestones(*)').eq('user_id', userId).eq('status', 'active').limit(1),
            supabase.from('assessment_results').select('*').eq('user_id', userId).order('created_at', { ascending: false })
          ]),
          2000
        );

        if (pRes?.data) profile = pRes.data;
        if (sRes?.data?.length > 0) skills = sRes.data;
        if (rRes?.data?.length > 0) roadmap = rRes.data[0];
        if (aRes?.data?.length > 0) assessments = aRes.data;
      } catch (e) {}
    }

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
      : 75;

    const progressData = {
      careerReadinessScore: profile?.career_readiness_score || 45.0,
      targetCareer: profile?.target_career || 'Full Stack Developer',
      totalSkills: skills?.length || 0,
      strongSkills: skills?.filter(s => s.proficiency_level === 'Advanced' || s.proficiency_level === 'Expert').length || 0,
      skillBreakdown: skillProficiencyBreakdown,
      roadmap: {
        totalMilestones: roadmap?.total_milestones || roadmap?.milestones?.length || 4,
        completedMilestones: roadmap?.completed_milestones || 1,
        progressPercentage: roadmap?.progress_percentage || 25
      },
      assessments: {
        total: totalAssessments,
        passed: passedAssessments,
        averageScore: avgScore,
        recentResults: assessments.slice(0, 5)
      },
      recentActivity: [
        { type: 'skill_assessment', title: 'Technical Assessment Completed', timestamp: new Date().toISOString() },
        { type: 'roadmap_update', title: 'Roadmap Milestone Activated', timestamp: new Date(Date.now() - 3600000).toISOString() }
      ]
    };

    res.json({
      progress: progressData,
      ...progressData
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
