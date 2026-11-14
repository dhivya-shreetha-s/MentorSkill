import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Layers,
  ShieldAlert
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';
import api from '../lib/api';
import AgentActivityPanel from '../components/AgentActivityPanel';
import LoadingSpinner from '../components/LoadingSpinner';

export default function SkillGapPage() {
  const [analysis, setAnalysis] = useState(null);
  const [profile, setProfile] = useState(null);
  const [userSkills, setUserSkills] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runningAnalysis, setRunningAnalysis] = useState(false);

  const fetchAnalysisData = async () => {
    try {
      const [aRes, pRes, sRes, lRes] = await Promise.allSettled([
        api.get('/api/analysis/latest'),
        api.get('/api/profile'),
        api.get('/api/skills'),
        api.get('/api/analysis/logs')
      ]);

      if (aRes.status === 'fulfilled') setAnalysis(aRes.value.data?.analysis || aRes.value.data);
      if (pRes.status === 'fulfilled') setProfile(pRes.value.data?.profile);
      if (sRes.status === 'fulfilled') setUserSkills(sRes.value.data?.skills || []);
      if (lRes.status === 'fulfilled') setLogs(lRes.value.data?.logs || []);
    } catch (err) {
      console.warn('Analysis fetch issue', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysisData();
  }, []);

  const handleRunAnalysis = async () => {
    setRunningAnalysis(true);
    try {
      await api.post('/api/analysis/run', {
        targetCareer: profile?.target_career
      });
      await fetchAnalysisData();
    } catch (err) {
      console.error('Run analysis failed', err);
    } finally {
      setRunningAnalysis(false);
    }
  };

  if (loading) return <LoadingSpinner text="Computing multi-agent skill gap matrix..." />;

  const readinessScore = profile?.career_readiness_score || analysis?.readiness_score || 55;

  const currentSkillsList = userSkills.length > 0 ? userSkills : [
    { skill_name: 'JavaScript', proficiency_level: 'Advanced' },
    { skill_name: 'React', proficiency_level: 'Intermediate' },
    { skill_name: 'HTML/CSS', proficiency_level: 'Advanced' },
    { skill_name: 'Git', proficiency_level: 'Intermediate' }
  ];

  const requiredSkillsList = analysis?.required_skills || [
    { skill_name: 'JavaScript', required_proficiency: 'Advanced' },
    { skill_name: 'React', required_proficiency: 'Advanced' },
    { skill_name: 'Node.js', required_proficiency: 'Intermediate' },
    { skill_name: 'SQL', required_proficiency: 'Intermediate' },
    { skill_name: 'Docker', required_proficiency: 'Beginner' },
    { skill_name: 'TypeScript', required_proficiency: 'Intermediate' }
  ];

  const missingSkillsList = analysis?.missing_skills || [
    { skill_name: 'Node.js', priority: 'Critical', required_proficiency: 'Intermediate', reason: 'Core requirement for API layer architecture' },
    { skill_name: 'SQL', priority: 'High', required_proficiency: 'Intermediate', reason: 'Essential for data persistence and queries' },
    { skill_name: 'Docker', priority: 'Medium', required_proficiency: 'Beginner', reason: 'Containerization needed for modern deployment' },
    { skill_name: 'TypeScript', priority: 'High', required_proficiency: 'Intermediate', reason: 'Standard for type safety in enterprise React backends' }
  ];

  const radarData = [
    { subject: 'Frontend', current: 75, target: 90 },
    { subject: 'Backend', current: 40, target: 80 },
    { subject: 'Database', current: 45, target: 75 },
    { subject: 'DevOps', current: 20, target: 70 },
    { subject: 'System Design', current: 35, target: 75 },
    { subject: 'Testing', current: 50, target: 80 }
  ];

  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
            CRITICAL
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            HIGH
          </span>
        );
      case 'medium':
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            MEDIUM
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="glass-card p-6 sm:p-8 relative overflow-hidden bg-gradient-to-r from-violet-950/40 via-navy-900 to-navy-950 border-white/10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/30 text-xs font-semibold mb-3">
              <Cpu className="w-3.5 h-3.5" />
              <span>Skill Gap Diagnostic Agent</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Target Role: {profile?.target_career || 'Full Stack Developer'}
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              Autonomous comparison of your profile against {requiredSkillsList.length} requisite competencies.
            </p>
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={runningAnalysis}
            className="btn-primary flex items-center gap-2 text-sm shadow-xl shadow-violet-600/30 self-start lg:self-auto"
          >
            <RefreshCw className={`w-4 h-4 ${runningAnalysis ? 'animate-spin' : ''}`} />
            <span>{runningAnalysis ? 'AI Swarm Running...' : 'Re-Run Gap Analysis'}</span>
          </button>
        </div>
      </div>

      {/* Readiness & Radar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Circular Progress Gauge */}
        <div className="glass-card p-6 border-white/10 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
            Role Readiness Index
          </span>
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* SVG circular gauge */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="text-white/10"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className="text-violet-500 transition-all duration-1000 ease-out"
                strokeWidth="8"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * readinessScore) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-white">{readinessScore}%</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Readiness
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-4 max-w-xs leading-relaxed">
            {readinessScore > 70
              ? 'Strong alignment! Focus on advanced stage milestones and portfolio demonstration.'
              : 'Target your high-priority missing skills to bridge the readiness gap.'}
          </p>
        </div>

        {/* Radar Chart */}
        <div className="glass-card p-6 border-white/10 lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-base font-bold text-white">Full Domain Competency Chart</h2>
              <p className="text-xs text-slate-400">Target Role benchmark versus your current mastery</p>
            </div>
          </div>

          <div className="flex-1 w-full h-64 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <PolarRadiusAxis stroke="#475569" angle={30} domain={[0, 100]} />
                <Radar name="Target Benchmark" dataKey="target" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
                <Radar name="Your Current Level" dataKey="current" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-slate-300 pt-2 border-t border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-sky-400 opacity-70"></span>
              <span>Your Skills</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-violet-500 opacity-50"></span>
              <span>Role Baseline</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Column Skills Comparison Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Col 1: Current Skills */}
        <div className="glass-card p-6 border-white/10 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Current Skills</h2>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
              {currentSkillsList.length}
            </span>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-96 pr-1">
            {currentSkillsList.map((s, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between"
              >
                <span className="font-semibold text-xs text-white">{s.skill_name || s.name}</span>
                <span className="text-[11px] font-medium text-emerald-400">
                  {s.proficiency_level || 'Intermediate'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Col 2: Required Skills */}
        <div className="glass-card p-6 border-white/10 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-violet-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Required Skills</h2>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400">
              {requiredSkillsList.length}
            </span>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-96 pr-1">
            {requiredSkillsList.map((r, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between"
              >
                <span className="font-semibold text-xs text-white">{r.skill_name || r.name}</span>
                <span className="text-[11px] font-medium text-violet-300">
                  {r.required_proficiency || r.proficiency || 'Advanced'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Col 3: Missing Skills (Highlighted in Red / Amber) */}
        <div className="glass-card p-6 border-rose-500/30 bg-rose-950/10 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-rose-500/20 mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <h2 className="text-sm font-bold text-rose-300 uppercase tracking-wider">Missing Skills</h2>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300">
              {missingSkillsList.length} Gaps
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-96 pr-1">
            {missingSkillsList.map((m, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white/[0.03] border border-rose-500/20 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">{m.skill_name || m.name}</span>
                  {getPriorityBadge(m.priority)}
                </div>
                {m.reason && (
                  <p className="text-[11px] text-slate-300 leading-tight">{m.reason}</p>
                )}
                <div className="text-[10px] text-slate-400">
                  Target Proficiency: <span className="text-white font-medium">{m.required_proficiency || 'Intermediate'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Activity Logs */}
      <AgentActivityPanel logs={logs} onRefresh={fetchAnalysisData} />
    </div>
  );
}
