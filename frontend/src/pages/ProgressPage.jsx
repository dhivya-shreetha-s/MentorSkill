import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
  BarChart2,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import api from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';

const sampleProgressData = [
  { month: 'Week 1', score: 25 },
  { month: 'Week 2', score: 32 },
  { month: 'Week 3', score: 40 },
  { month: 'Week 4', score: 48 },
  { month: 'Week 5', score: 55 },
  { month: 'Week 6', score: 62 }
];

const sampleAssessmentScores = [
  { topic: 'JavaScript', score: 85 },
  { topic: 'React', score: 78 },
  { topic: 'Node.js', score: 65 },
  { topic: 'SQL', score: 72 },
  { topic: 'Docker', score: 60 }
];

const sampleHistory = [
  { id: 1, title: 'JavaScript Core & ES6+', topic: 'JavaScript', score: 85, passed: true, date: '2025-05-10' },
  { id: 2, title: 'React Components & Hooks', topic: 'React', score: 78, passed: true, date: '2025-05-18' },
  { id: 3, title: 'Node.js & Express Basics', topic: 'Node.js', score: 65, passed: false, date: '2025-05-24' }
];

export default function ProgressPage() {
  const [readinessData, setReadinessData] = useState(sampleProgressData);
  const [assessmentScores, setAssessmentScores] = useState(sampleAssessmentScores);
  const [history, setHistory] = useState(sampleHistory);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      try {
        const res = await api.get('/api/progress/analytics');
        if (res.data) {
          if (res.data.readinessOverTime) setReadinessData(res.data.readinessOverTime);
          if (res.data.scoresByTopic) setAssessmentScores(res.data.scoresByTopic);
          if (res.data.assessmentHistory) setHistory(res.data.assessmentHistory);
        }
      } catch (err) {
        console.warn('Progress analytics fetch note', err);
      } finally {
        setLoading(false);
      }
    }
    loadProgress();
  }, []);

  if (loading) return <LoadingSpinner text="Compiling learner progress metrics..." />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Career Progress & Analytics</h1>
        <p className="text-sm text-slate-400 mt-1">
          Quantitative tracking of your skill elevation and assessment milestones over time.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 border-white/10">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Current Readiness
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">62%</span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +37% total
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Target Role: Full Stack Dev</p>
        </div>

        <div className="glass-card p-5 border-white/10">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Assessments Passed
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">
              {history.filter((h) => h.passed).length}
            </span>
            <span className="text-xs text-slate-400">of {history.length} attempted</span>
          </div>
          <p className="text-xs text-emerald-400 mt-1">67% Success rate</p>
        </div>

        <div className="glass-card p-5 border-white/10">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Milestones Cleared
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">4</span>
            <span className="text-xs text-slate-400">of 12 total</span>
          </div>
          <p className="text-xs text-violet-400 mt-1">Stage 2 Active</p>
        </div>

        <div className="glass-card p-5 border-white/10">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Hours Invested
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">48 hrs</span>
            <span className="text-xs text-slate-400">tracked</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">~8 hrs / week average</p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart: Readiness Over Time */}
        <div className="glass-card p-6 border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Career Readiness Trajectory</h2>
              <p className="text-xs text-slate-400">Weekly progression score</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-600/20 text-violet-300 border border-violet-500/20">
              Readiness %
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={readinessData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Scores by Topic */}
        <div className="glass-card p-6 border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Assessment Scores by Topic</h2>
              <p className="text-xs text-slate-400">Diagnostic performance Breakdown</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Score %
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assessmentScores}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="topic" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                />
                <Bar dataKey="score" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Assessment History Table */}
      <div className="glass-card p-6 border-white/10">
        <h2 className="text-base font-bold text-white mb-4">Verified Assessment Record</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Assessment Title</th>
                <th className="pb-3 font-semibold">Topic</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Score</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 font-semibold text-white">{item.title}</td>
                  <td className="py-3 text-slate-300">{item.topic}</td>
                  <td className="py-3 text-slate-400">{item.date}</td>
                  <td className="py-3 font-bold text-white">{item.score}%</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.passed
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {item.passed ? 'PASSED' : 'RETAKE'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
