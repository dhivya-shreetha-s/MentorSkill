import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  ExternalLink,
  Clock,
  Layers,
  Filter,
  Sparkles,
  Tag
} from 'lucide-react';
import api from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';

const sampleResources = [
  {
    id: 'res-1',
    title: 'The Modern JavaScript Tutorial',
    provider: 'javascript.info',
    skill: 'JavaScript',
    type: 'Documentation',
    difficulty: 'Intermediate',
    duration: '25 Hours',
    is_free: true,
    url: 'https://javascript.info/',
    description: 'From the basics to advanced topics with simple, but detailed explanations.'
  },
  {
    id: 'res-2',
    title: 'Full Stack Open 2024',
    provider: 'University of Helsinki',
    skill: 'React',
    type: 'Course',
    difficulty: 'Intermediate',
    duration: '60 Hours',
    is_free: true,
    url: 'https://fullstackopen.com/en/',
    description: 'Deep dive into modern web development with JavaScript, React, Node.js, and TypeScript.'
  },
  {
    id: 'res-3',
    title: 'Node.js Design Patterns & Architecture',
    provider: 'Node.js Official',
    skill: 'Node.js',
    type: 'Documentation',
    difficulty: 'Advanced',
    duration: '15 Hours',
    is_free: true,
    url: 'https://nodejs.org/en/learn',
    description: 'Explore the Node.js event loop, streams, clusters, and asynchronous design.'
  },
  {
    id: 'res-4',
    title: 'Docker for Beginners - Hands-on Labs',
    provider: 'Play with Docker',
    skill: 'Docker',
    type: 'Tutorial',
    difficulty: 'Beginner',
    duration: '8 Hours',
    is_free: true,
    url: 'https://training.play-with-docker.com/',
    description: 'Interactive browser-based Docker labs with container orchestration.'
  },
  {
    id: 'res-5',
    title: 'PostgreSQL Deep Dive for Developers',
    provider: 'Postgres Tutorial',
    skill: 'SQL',
    type: 'Tutorial',
    difficulty: 'Intermediate',
    duration: '12 Hours',
    is_free: true,
    url: 'https://www.postgresqltutorial.com/',
    description: 'Indexing, window functions, CTEs, and query plan optimization.'
  },
  {
    id: 'res-6',
    title: 'System Design Interview Primer',
    provider: 'GitHub Open Source',
    skill: 'System Design',
    type: 'Documentation',
    difficulty: 'Advanced',
    duration: '40 Hours',
    is_free: true,
    url: 'https://github.com/donnemartin/system-design-primer',
    description: 'Comprehensive guide to scaling systems to millions of concurrent users.'
  },
  {
    id: 'res-7',
    title: 'TypeScript for JavaScript Programmers',
    provider: 'TypeScript Team',
    skill: 'TypeScript',
    type: 'Documentation',
    difficulty: 'Intermediate',
    duration: '10 Hours',
    is_free: true,
    url: 'https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html',
    description: 'Type annotations, interfaces, generics, and narrowing in modern TS.'
  },
  {
    id: 'res-8',
    title: 'Building Production REST APIs with Express',
    provider: 'freeCodeCamp',
    skill: 'Node.js',
    type: 'Video',
    difficulty: 'Intermediate',
    duration: '6 Hours',
    is_free: true,
    url: 'https://www.youtube.com/watch?v=Oe421EPjeBE',
    description: 'Complete hands-on walkthrough building secure production-ready APIs.'
  }
];

export default function LearningHubPage() {
  const [resources, setResources] = useState(sampleResources);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResources() {
      try {
        const res = await api.get('/api/resources');
        if (res.data?.resources && res.data.resources.length > 0) {
          setResources(res.data.resources);
        }
      } catch (err) {
        console.warn('Resource load note', err);
      } finally {
        setLoading(false);
      }
    }
    loadResources();
  }, []);

  if (loading) return <LoadingSpinner text="Curating technical learning catalog..." />;

  const skillsList = ['All', ...new Set(resources.map((r) => r.skill).filter(Boolean))];
  const typesList = ['All', 'Course', 'Tutorial', 'Documentation', 'Video'];

  const filtered = resources.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSkill = selectedSkill === 'All' || item.skill?.toLowerCase() === selectedSkill.toLowerCase();
    const matchesType = selectedType === 'All' || item.type?.toLowerCase() === selectedType.toLowerCase();

    return matchesSearch && matchesSkill && matchesType;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Curated Learning Hub</h1>
        <p className="text-sm text-slate-400 mt-1">
          High-yield technical courses, interactive tutorials, and verified documentation recommended by AI agents.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-5 border-white/10 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search resources, topics, or platforms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 text-sm"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="input-field bg-navy-900 text-sm md:w-44"
            >
              {typesList.map((t) => (
                <option key={t} value={t}>Type: {t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Skill Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          <span className="text-xs font-semibold text-slate-400 shrink-0">Skill:</span>
          {skillsList.map((sk) => (
            <button
              key={sk}
              onClick={() => setSelectedSkill(sk)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedSkill === sk
                  ? 'bg-violet-600 text-white'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              {sk}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((res) => (
          <div
            key={res.id}
            className="glass-card p-6 border-white/10 hover:border-violet-500/40 hover:-translate-y-1 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/20">
                  {res.type || 'Course'}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                  {res.is_free !== false ? 'FREE' : 'PAID'}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-1.5 leading-snug">
                {res.title}
              </h3>
              <p className="text-xs text-violet-400 font-medium mb-3">
                by {res.provider}
              </p>

              <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
                {res.description}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 py-3 border-t border-white/5 mb-4">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-violet-400" />
                  <span>{res.duration || 'Self-Paced'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>{res.difficulty || 'Intermediate'}</span>
                </div>
              </div>

              <a
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="btn-primary w-full text-xs py-2.5 flex items-center justify-center gap-2"
              >
                <span>Visit Resource</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
