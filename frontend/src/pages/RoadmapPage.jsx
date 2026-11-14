import React, { useState, useEffect } from 'react';
import {
  Map,
  CheckCircle2,
  Clock,
  Lock,
  PlayCircle,
  ExternalLink,
  Sparkles,
  BookOpen,
  Code,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import api from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';

const sampleMilestones = [
  // Stage 1: Beginner
  {
    id: 'm-1',
    stage: 'Beginner',
    skill_name: 'JavaScript Async Patterns & Promises',
    description: 'Master async/await, Promise chaining, event loop execution, and error handling strategies.',
    estimated_hours: 12,
    status: 'completed',
    practical_exercise: 'Build a rate-limited API consumer using fetch and Promise.allSettled()',
    resources: [
      { title: 'MDN: Asynchronous JavaScript', url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous' },
      { title: 'JavaScript.info: Promises & Async', url: 'https://javascript.info/async' }
    ]
  },
  {
    id: 'm-2',
    stage: 'Beginner',
    skill_name: 'Modern React Fundamentals & Hooks',
    description: 'Understand declarative component architectures, state hooks, effect lifecycles, and props flow.',
    estimated_hours: 15,
    status: 'completed',
    practical_exercise: 'Create an interactive task manager with localStorage persistence and custom hooks',
    resources: [
      { title: 'React Official Docs: Quick Start', url: 'https://react.dev/learn' }
    ]
  },
  // Stage 2: Intermediate
  {
    id: 'm-3',
    stage: 'Intermediate',
    skill_name: 'Node.js & Express REST API Architecture',
    description: 'Design structured RESTful web services with routers, authentication middleware, and input validation.',
    estimated_hours: 18,
    status: 'in_progress',
    practical_exercise: 'Develop a secure user authentication service with JWT and password hashing',
    resources: [
      { title: 'Express.js Routing Guide', url: 'https://expressjs.com/en/guide/routing.html' },
      { title: 'REST API Best Practices', url: 'https://restfulapi.net/' }
    ]
  },
  {
    id: 'm-4',
    stage: 'Intermediate',
    skill_name: 'PostgreSQL & Database Design',
    description: 'Learn relational schema design, indexes, foreign keys, ACID transactions, and query optimization.',
    estimated_hours: 16,
    status: 'available',
    practical_exercise: 'Model an e-commerce schema with orders, products, and inventory constraints in SQL',
    resources: [
      { title: 'PostgreSQL Tutorial', url: 'https://www.postgresqltutorial.com/' }
    ]
  },
  // Stage 3: Advanced
  {
    id: 'm-5',
    stage: 'Advanced',
    skill_name: 'Docker & Containerization Workflows',
    description: 'Containerize multi-container web stacks with multi-stage Dockerfiles and docker-compose orchestration.',
    estimated_hours: 14,
    status: 'locked',
    practical_exercise: 'Package the React frontend and Express backend into an optimized Docker compose cluster',
    resources: [
      { title: 'Docker Get Started Guide', url: 'https://docs.docker.com/get-started/' }
    ]
  },
  {
    id: 'm-6',
    stage: 'Advanced',
    skill_name: 'Full Stack State Management & TypeScript',
    description: 'Type-safe full stack integration, generics, zod validation schemas, and global state stores.',
    estimated_hours: 20,
    status: 'locked',
    practical_exercise: 'Refactor client and API models into a shared TypeScript types module',
    resources: [
      { title: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/handbook/intro.html' }
    ]
  },
  // Stage 4: Industry Readiness
  {
    id: 'm-7',
    stage: 'Industry Readiness',
    skill_name: 'System Design & Scalability Principles',
    description: 'Caching with Redis, horizontal scaling, load balancers, rate limiting, and CAP theorem trade-offs.',
    estimated_hours: 24,
    status: 'locked',
    practical_exercise: 'Design and document a high-throughput URL shortening architecture with system diagrams',
    resources: [
      { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer' }
    ]
  },
  {
    id: 'm-8',
    stage: 'Industry Readiness',
    skill_name: 'CI/CD Pipelines & Production Deployment',
    description: 'Automated GitHub Actions test runner, linting, build verification, and cloud hosting deploy hooks.',
    estimated_hours: 14,
    status: 'locked',
    practical_exercise: 'Setup automated CI/CD pipeline deploying pull requests to staging environments',
    resources: [
      { title: 'GitHub Actions Documentation', url: 'https://docs.github.com/en/actions' }
    ]
  }
];

const stages = ['Beginner', 'Intermediate', 'Advanced', 'Industry Readiness'];

export default function RoadmapPage() {
  const [milestones, setMilestones] = useState(sampleMilestones);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [expandedId, setExpandedId] = useState('m-3');

  const fetchRoadmap = async () => {
    try {
      const res = await api.get('/api/roadmaps/current');
      if (res.data?.roadmap?.milestones && res.data.roadmap.milestones.length > 0) {
        setMilestones(res.data.roadmap.milestones);
      }
    } catch (err) {
      console.warn('Roadmap fetch note', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const handleMarkComplete = async (mId) => {
    try {
      setMilestones((prev) =>
        prev.map((m) => (m.id === mId ? { ...m, status: 'completed' } : m))
      );
      await api.patch(`/api/roadmaps/milestones/${mId}`, { status: 'completed' });
    } catch (err) {
      console.warn('Milestone update note', err);
    }
  };

  const handleGenerateRoadmap = async () => {
    setGenerating(true);
    try {
      const res = await api.post('/api/roadmaps/generate');
      if (res.data?.roadmap?.milestones) {
        setMilestones(res.data.roadmap.milestones);
      }
    } catch (err) {
      console.warn('Generate error note', err);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <LoadingSpinner text="Mapping your curriculum milestones..." />;

  // Calculate completion percentage
  const completedCount = milestones.filter((m) => m.status === 'completed').length;
  const progressPercent = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 bg-gradient-to-r from-violet-950/40 via-navy-900 to-purple-950/20 border-violet-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-600/20 text-violet-300 border border-violet-500/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI Roadmap Synthesizer
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Your Technical Mastery Journey
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-xl leading-relaxed">
            4 distinct phases carefully sequenced by our AI agents to take you from foundational gaps to industry-ready engineering.
          </p>
        </div>

        <button
          onClick={handleGenerateRoadmap}
          disabled={generating}
          className="btn-secondary text-xs flex items-center gap-2 self-start md:self-auto py-2.5 px-4"
        >
          <Sparkles className={`w-4 h-4 text-violet-400 ${generating ? 'animate-spin' : ''}`} />
          <span>{generating ? 'Re-Synthesizing...' : 'Regenerate Roadmap'}</span>
        </button>
      </div>

      {/* Overall Progress Bar */}
      <div className="glass-card p-6 border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Roadmap Completion</h2>
            <p className="text-xs text-slate-400">
              {completedCount} of {milestones.length} Milestones Achieved
            </p>
          </div>
          <span className="text-2xl font-black text-violet-400">{progressPercent}%</span>
        </div>
        <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-violet-600 to-purple-500 h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Timeline by Stage */}
      <div className="space-y-8">
        {stages.map((stageName, sIndex) => {
          const stageMilestones = milestones.filter(
            (m) => (m.stage || '').toLowerCase() === stageName.toLowerCase()
          );

          if (stageMilestones.length === 0) return null;

          return (
            <div key={stageName} className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center font-bold text-xs">
                  {sIndex + 1}
                </span>
                <h3 className="text-lg font-bold text-white">Stage {sIndex + 1}: {stageName}</h3>
                <span className="text-xs text-slate-500 font-medium">
                  ({stageMilestones.filter((m) => m.status === 'completed').length}/{stageMilestones.length} done)
                </span>
              </div>

              <div className="space-y-3 pl-3 sm:pl-10 border-l border-white/10">
                {stageMilestones.map((milestone) => {
                  const isExpanded = expandedId === milestone.id;
                  const isCompleted = milestone.status === 'completed';
                  const isInProgress = milestone.status === 'in_progress';
                  const isLocked = milestone.status === 'locked';

                  return (
                    <div
                      key={milestone.id}
                      className={`glass-card p-5 border transition-all ${
                        isCompleted
                          ? 'border-emerald-500/20 bg-emerald-950/[0.05]'
                          : isInProgress
                          ? 'border-violet-500/40 bg-violet-950/[0.08]'
                          : isLocked
                          ? 'border-white/5 opacity-70'
                          : 'border-white/10 hover:border-violet-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {isCompleted && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                            {isInProgress && <PlayCircle className="w-5 h-5 text-violet-400 animate-pulse" />}
                            {isLocked && <Lock className="w-5 h-5 text-slate-500" />}
                            {!isCompleted && !isInProgress && !isLocked && (
                              <div className="w-5 h-5 rounded-full border border-violet-400 flex items-center justify-center" />
                            )}
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-base font-bold text-white">
                                {milestone.skill_name}
                              </h4>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                  isCompleted
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : isInProgress
                                    ? 'bg-violet-500/20 text-violet-300'
                                    : isLocked
                                    ? 'bg-white/5 text-slate-500'
                                    : 'bg-blue-500/20 text-blue-300'
                                }`}
                              >
                                {milestone.status.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                              {milestone.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400">
                            <Clock className="w-3.5 h-3.5 text-violet-400" />
                            <span>{milestone.estimated_hours} hrs</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setExpandedId(isExpanded ? null : milestone.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-white"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Expandable Exercise & Resource details */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                          {milestone.practical_exercise && (
                            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                              <div className="flex items-center gap-2 text-xs font-semibold text-violet-400 mb-1">
                                <Code className="w-4 h-4" />
                                <span>Hands-on Practical Exercise</span>
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed">
                                {milestone.practical_exercise}
                              </p>
                            </div>
                          )}

                          {milestone.resources && milestone.resources.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2">
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>Curated Study Resources</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {milestone.resources.map((res, rIdx) => (
                                  <a
                                    key={rIdx}
                                    href={res.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-slate-200 hover:text-white hover:border-violet-500/40 transition-colors"
                                  >
                                    <span>{res.title}</span>
                                    <ExternalLink className="w-3 h-3 text-slate-400" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex justify-end pt-2">
                            {!isCompleted && !isLocked && (
                              <button
                                type="button"
                                onClick={() => handleMarkComplete(milestone.id)}
                                className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Mark Milestone Complete</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
