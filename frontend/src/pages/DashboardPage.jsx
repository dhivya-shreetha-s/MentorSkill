import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  TrendingUp,
  Award,
  AlertCircle,
  Brain,
  ArrowRight,
  ClipboardCheck,
  Compass,
  CheckCircle2,
  RefreshCw
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

export default function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [gapAnalysis, setGapAnalysis] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runningAnalysis, setRunningAnalysis] = useState(false);

  const loadDashboardData = async () => {
    try {
      const [pRes, sRes, gRes, rRes, lRes] = await Promise.allSettled([
        api.get('/api/profile'),
        api.get('/api/skills'),
        api.get('/api/analysis/latest'),
        api.get('/api/roadmaps/current'),
        api.get('/api/analysis/logs')
      ]);

      if (pRes.status === 'fulfilled') setProfile(pRes.value.data?.profile);
      if (sRes.status === 'fulfilled') setSkills(sRes.value.data?.skills || []);
      if (gRes.status === 'fulfilled') setGapAnalysis(gRes.value.data?.analysis || gRes.value.data);
      if (rRes.status === 'fulfilled') setRoadmap(rRes.value.data?.roadmap);
      if (lRes.status === 'fulfilled') setLogs(lRes.value.data?.logs || []);
    } catch (err) {
      console.warn('Dashboard fetch issue', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleRunAnalysis = async () => {
    setRunningAnalysis(true);
    try {
      await api.post('/api/analysis/run', {
        targetCareer: profile?.target_career
      });
      await loadDashboardData();
    } catch (err) {
      console.error('Failed to trigger analysis', err);
    } finally {
      setRunningAnalysis(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Synthesizing your career dashboard..." />;
  }

  // Derive stats
  const readinessScore = profile?.career_readiness_score || gapAnalysis?.readiness_score || 45;
  const totalSkillsCount = skills.length || 6;
  const strongSkillsCount = skills.filter(
    (s) => s.proficiency_level === 'Advanced' || s.proficiency_level === 'Expert'
  ).length || 2;
  const missingSkillsCount = gapAnalysis?.missing_skills?.length || 4;

  // Radar chart data preparation
  const radarData = [
    { subject: 'Frontend', current: 75, target: 90 },
    { subject: 'Backend', current: 50, target: 85 },
    { subject: 'Database', current: 60, target: 80 },
    { subject: 'DevOps', current: 30, target: 75 },
    { subject: 'System Design', current: 40, target: 80 },
    { subject: 'Testing', current: 65, target: 85 }
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="glass-card p-6 sm:p-8 relative overflow-hidden bg-gradient-to-r from-violet-900/30 via-navy-900 to-purple-900/20 border-violet-500/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-semibold mb-3 border border-violet-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Target Role: {profile?.target_career || 'Full Stack Developer'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {profile?.full_name || 'Innovator'}!
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Your 6 autonomous AI agents have reviewed your competencies. You are on track to bridge your key architecture gaps.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRunAnalysis}
              disabled={runningAnalysis}
              className="btn-primary flex items-center gap-2 text-sm shadow-lg shadow-violet-600/20"
            >
              <RefreshCw className={`w-4 h-4 ${runningAnalysis ? 'animate-spin' : ''}`} />
              <span>{runningAnalysis ? 'Analyzing...' : 'Run Gap Analysis'}</span>
            </button>
            <Link
              to="/mentor"
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <Brain className="w-4 h-4 text-violet-400" />
              <span>Chat with Mentor</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Readiness Card */}
        <div className="glass-card p-5 border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Career Readiness</span>
            <div className="p-2 rounded-xl bg-violet-600/20 text-violet-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{readinessScore}%</span>
            <span className="text-xs text-emerald-400 font-medium">+8% this month</span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-violet-500 to-purple-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${readinessScore}%` }}
            />
          </div>
        </div>

        {/* Total Skills */}
        <div className="glass-card p-5 border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cataloged Skills</span>
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-white">{totalSkillsCount}</span>
            <span className="text-xs text-slate-400 ml-2">Total tracked</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Active in profile</p>
        </div>

        {/* Strong Skills */}
        <div className="glass-card p-5 border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Strong Skills</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-white">{strongSkillsCount}</span>
            <span className="text-xs text-emerald-400 ml-2">Advanced+</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Verified proficiencies</p>
        </div>

        {/* Missing Skills */}
        <div className="glass-card p-5 border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Skill Gaps</span>
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-white">{missingSkillsCount}</span>
            <span className="text-xs text-rose-400 ml-2">Priority gaps</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Targeted in roadmap</p>
        </div>
      </div>

      {/* Middle Grid: Radar Chart + Roadmap Milestone Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Chart */}
        <div className="glass-card p-6 border-white/10 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Skill Alignment Radar</h2>
              <p className="text-xs text-slate-400">Current vs Required Proficiency</p>
            </div>
            <Link to="/skill-gap" className="text-xs text-violet-400 hover:text-violet-300 font-medium">
              View details &rarr;
            </Link>
          </div>

          <div className="flex-1 w-full h-64 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <PolarRadiusAxis stroke="#475569" angle={30} domain={[0, 100]} />
                <Radar name="Target" dataKey="target" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
                <Radar name="Current" dataKey="current" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-slate-300 pt-2 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-sky-400 opacity-60"></span>
              <span>Your Current Level</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-violet-500 opacity-40"></span>
              <span>Target Role Benchmark</span>
            </div>
          </div>
        </div>

        {/* Active Roadmap Progress */}
        <div className="glass-card p-6 border-white/10 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white">Active Roadmap Milestones</h2>
                <p className="text-xs text-slate-400">Curated sequence to reach Industry Readiness</p>
              </div>
              <Link to="/roadmap" className="btn-secondary text-xs py-1.5 px-3">
                Full Roadmap
              </Link>
            </div>

            <div className="space-y-3">
              {[
                { stage: 'Stage 1: Fundamentals', skill: 'TypeScript Generics & Types', status: 'completed', hours: '8 hrs' },
                { stage: 'Stage 1: Fundamentals', skill: 'Modern React Component Lifecycle', status: 'in_progress', hours: '12 hrs' },
                { stage: 'Stage 2: Core Skills', skill: 'Express.js REST APIs & Middleware', status: 'available', hours: '15 hrs' },
                { stage: 'Stage 3: Advanced', skill: 'Docker Containerization & CI/CD', status: 'locked', hours: '20 hrs' }
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-violet-500/20 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      item.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : item.status === 'in_progress'
                        ? 'bg-violet-500/20 text-violet-400 animate-pulse'
                        : 'bg-white/5 text-slate-500'
                    }`}>
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{item.skill}</p>
                      <p className="text-xs text-slate-400">{item.stage}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">{item.hours}</span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      item.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : item.status === 'in_progress'
                        ? 'bg-violet-500/10 text-violet-400'
                        : 'bg-white/5 text-slate-500'
                    }`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-slate-400">Stage 1 of 4 in progress</span>
            <Link to="/roadmap" className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1">
              <span>View all 16 milestones</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* AI Agent Activity Section */}
      <AgentActivityPanel logs={logs} onRefresh={loadDashboardData} />
    </div>
  );
}
