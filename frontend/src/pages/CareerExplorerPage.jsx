import React, { useState, useEffect } from 'react';
import {
  Compass,
  Search,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Briefcase,
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import api from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';

const sampleCareers = [
  {
    id: 'career-1',
    title: 'Full Stack Developer',
    description: 'Designs, constructs, and deploys both client-facing frontends and robust scalable backend APIs.',
    level: 'Mid to Senior',
    avg_salary: '$115,000 / yr',
    demand: 'Very High',
    required_skills: [
      { name: 'JavaScript', proficiency: 'Advanced' },
      { name: 'React', proficiency: 'Advanced' },
      { name: 'Node.js', proficiency: 'Intermediate' },
      { name: 'SQL', proficiency: 'Intermediate' },
      { name: 'Git', proficiency: 'Advanced' },
      { name: 'REST APIs', proficiency: 'Advanced' },
      { name: 'Docker', proficiency: 'Beginner' }
    ],
    suggested_projects: [
      'Full Stack E-Commerce Platform with Stripe payments',
      'Real-time collaborative kanban board with WebSockets',
      'SaaS Analytics dashboard with multi-tenant auth'
    ]
  },
  {
    id: 'career-2',
    title: 'Frontend Engineer',
    description: 'Specializes in user interfaces, component design systems, accessibility, and high performance web experiences.',
    level: 'Junior to Mid',
    avg_salary: '$105,000 / yr',
    demand: 'High',
    required_skills: [
      { name: 'JavaScript', proficiency: 'Expert' },
      { name: 'React', proficiency: 'Advanced' },
      { name: 'TypeScript', proficiency: 'Intermediate' },
      { name: 'CSS/Tailwind', proficiency: 'Advanced' },
      { name: 'Performance Optimization', proficiency: 'Intermediate' }
    ],
    suggested_projects: [
      'Design System component library published to NPM',
      'Interactive Canvas/WebGL animation showcase'
    ]
  },
  {
    id: 'career-3',
    title: 'Backend Engineer',
    description: 'Architects microservices, databases, transactional pipelines, and high-throughput server backends.',
    level: 'Mid to Senior',
    avg_salary: '$120,000 / yr',
    demand: 'High',
    required_skills: [
      { name: 'Node.js', proficiency: 'Advanced' },
      { name: 'Python', proficiency: 'Intermediate' },
      { name: 'PostgreSQL', proficiency: 'Advanced' },
      { name: 'Redis', proficiency: 'Intermediate' },
      { name: 'System Design', proficiency: 'Advanced' }
    ],
    suggested_projects: [
      'Distributed rate limiter and caching layer',
      'Event-driven order processing engine with Kafka/RabbitMQ'
    ]
  },
  {
    id: 'career-4',
    title: 'DevOps & Cloud Engineer',
    description: 'Manages cloud infrastructure, Kubernetes clusters, CI/CD pipelines, and site reliability automation.',
    level: 'Mid to Lead',
    avg_salary: '$130,000 / yr',
    demand: 'Critical',
    required_skills: [
      { name: 'Docker', proficiency: 'Advanced' },
      { name: 'Kubernetes', proficiency: 'Intermediate' },
      { name: 'AWS', proficiency: 'Advanced' },
      { name: 'CI/CD Pipelines', proficiency: 'Advanced' },
      { name: 'Terraform', proficiency: 'Intermediate' }
    ],
    suggested_projects: [
      'Multi-region Terraform infrastructure provisioning',
      'GitOps Kubernetes deployment pipeline with ArgoCD'
    ]
  },
  {
    id: 'career-5',
    title: 'AI / ML Engineer',
    description: 'Develops deep learning models, fine-tunes LLMs, builds RAG systems, and deploys intelligent pipelines.',
    level: 'Mid to Senior',
    avg_salary: '$140,000 / yr',
    demand: 'Very High',
    required_skills: [
      { name: 'Python', proficiency: 'Expert' },
      { name: 'PyTorch / TensorFlow', proficiency: 'Intermediate' },
      { name: 'LLM Prompt Engineering', proficiency: 'Advanced' },
      { name: 'Vector Databases', proficiency: 'Intermediate' }
    ],
    suggested_projects: [
      'Autonomous multi-agent research assistant with LangChain/LangGraph',
      'Fine-tuned sentiment and document classification model'
    ]
  }
];

export default function CareerExplorerPage() {
  const [careers, setCareers] = useState(sampleCareers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [activeUserTarget, setActiveUserTarget] = useState('Full Stack Developer');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [cRes, pRes] = await Promise.allSettled([
          api.get('/api/careers'),
          api.get('/api/profile')
        ]);
        if (cRes.status === 'fulfilled' && cRes.value.data?.careers?.length > 0) {
          setCareers(cRes.value.data.careers);
        }
        if (pRes.status === 'fulfilled' && pRes.value.data?.profile?.target_career) {
          setActiveUserTarget(pRes.value.data.profile.target_career);
        }
      } catch (err) {
        console.warn('Career fetch error', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSelectTargetCareer = async (careerTitle) => {
    setUpdating(true);
    try {
      await api.post('/api/profile', { target_career: careerTitle });
      setActiveUserTarget(careerTitle);
      // Trigger new analysis for the new career
      await api.post('/api/analysis/run', { targetCareer: careerTitle });
    } catch (err) {
      console.error('Failed to set target career', err);
    } finally {
      setUpdating(false);
    }
  };

  const filtered = careers.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner text="Exploring industry roles..." />;

  return (
    <div className="space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Career Trajectory Explorer</h1>
          <p className="text-sm text-slate-400 mt-1">
            Discover technical roles, view required competencies, and set your target career goal.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search roles or technologies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 text-sm"
          />
        </div>
      </div>

      {/* Grid of Career Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => {
          const isCurrentTarget = item.title.toLowerCase() === activeUserTarget.toLowerCase();

          return (
            <div
              key={item.id}
              className={`glass-card p-6 border transition-all duration-300 flex flex-col justify-between ${
                isCurrentTarget
                  ? 'border-violet-500 bg-violet-950/20 shadow-xl shadow-violet-500/10'
                  : 'border-white/10 hover:border-violet-500/40 hover:-translate-y-1'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Demand: {item.demand || 'High'}
                  </span>
                  {isCurrentTarget && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-violet-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active Goal
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{item.description}</p>

                <div className="space-y-1.5 py-3 border-y border-white/5 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Experience Level:</span>
                    <span className="text-white font-medium">{item.level || 'Mid'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Compensation:</span>
                    <span className="text-emerald-400 font-medium">{item.avg_salary || '$110,000 / yr'}</span>
                  </div>
                </div>

                {/* Skills tags preview */}
                <div className="mt-4">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Core Competencies
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(item.required_skills || []).slice(0, 5).map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[11px] bg-white/5 border border-white/10 text-slate-300"
                      >
                        {s.name || s.skill_name || s}
                      </span>
                    ))}
                    {(item.required_skills?.length || 0) > 5 && (
                      <span className="px-2 py-0.5 rounded-md text-[11px] text-slate-500">
                        +{(item.required_skills?.length || 0) - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCareer(item)}
                  className="btn-secondary text-xs py-2 px-3 flex-1"
                >
                  View Details
                </button>
                <button
                  type="button"
                  disabled={isCurrentTarget || updating}
                  onClick={() => handleSelectTargetCareer(item.title)}
                  className={`text-xs py-2 px-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    isCurrentTarget
                      ? 'bg-violet-600/30 text-violet-300 border border-violet-500/30 cursor-default'
                      : 'btn-primary'
                  }`}
                >
                  {isCurrentTarget ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Selected</span>
                    </>
                  ) : (
                    <span>Set Target</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedCareer && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-2xl w-full p-6 sm:p-8 border-violet-500/30 bg-navy-900 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest">
                  Role Deep-Dive
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">{selectedCareer.title}</h2>
              </div>
              <button
                onClick={() => setSelectedCareer(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {selectedCareer.description}
            </p>

            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Full Technical Skill Matrix
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(selectedCareer.required_skills || []).map((sk, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-white">{sk.name || sk.skill_name || sk}</span>
                    <span className="px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 font-medium">
                      {sk.proficiency || sk.required_proficiency || 'Intermediate'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {selectedCareer.suggested_projects && selectedCareer.suggested_projects.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Recommended Portfolio Projects
                </h4>
                <div className="space-y-2">
                  {selectedCareer.suggested_projects.map((proj, pIdx) => (
                    <div
                      key={pIdx}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-300 flex items-start gap-2.5"
                    >
                      <Sparkles className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                      <span>{proj}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
              <button
                onClick={() => setSelectedCareer(null)}
                className="btn-secondary text-xs px-4"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleSelectTargetCareer(selectedCareer.title);
                  setSelectedCareer(null);
                }}
                className="btn-primary text-xs px-5"
              >
                Select As Target Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
