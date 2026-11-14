import React from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Sparkles,
  ArrowRight,
  Target,
  BarChart3,
  Map,
  Compass,
  Cpu,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Users,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function LandingPage() {
  const agents = [
    {
      name: 'Career Architect',
      role: 'Role & Market Alignment',
      description: 'Maps industry role requirements and identifies essential competencies in real-time.',
      icon: Compass,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Skill Gap Analyzer',
      role: 'Deficiency Detection',
      description: 'Calculates readiness scores and pinpoints critical missing proficiencies.',
      icon: BarChart3,
      color: 'from-violet-500 to-purple-500'
    },
    {
      name: 'Roadmap Synthesizer',
      role: 'Curriculum Planning',
      description: 'Builds adaptive 4-stage step-by-step milestones personalized to your available hours.',
      icon: Map,
      color: 'from-amber-500 to-orange-500'
    },
    {
      name: 'Resource Scout',
      role: 'Content Curation',
      description: 'Discovers verified documentation, high-yield courses, tutorials and hands-on exercises.',
      icon: Layers,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      name: 'Assessment Evaluator',
      role: 'Diagnostic Testing',
      description: 'Generates role-specific quizzes to scientifically validate self-reported proficiency levels.',
      icon: ShieldCheck,
      color: 'from-pink-500 to-rose-500'
    },
    {
      name: 'AI Career Mentor',
      role: '24/7 Contextual Guidance',
      description: 'Answers career questions, suggests interview topics, and provides tactical advice.',
      icon: Brain,
      color: 'from-indigo-500 to-violet-600'
    }
  ];

  const features = [
    {
      icon: Target,
      title: 'Precision Skill Mapping',
      description: 'Catalog your strengths and benchmark them against real-world engineering and tech industry roles.'
    },
    {
      icon: Zap,
      title: 'Autonomous Multi-Agent AI',
      description: 'Six specialized Groq LLaMA-powered agents collaborate simultaneously to orchestrate your career success.'
    },
    {
      icon: BarChart3,
      title: 'Dynamic Readiness Index',
      description: 'Track your career readiness percentage with intuitive visual radar charts and milestone checklists.'
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Profile Setup',
      desc: 'Declare your educational background, target career aspirations, and current skill set.'
    },
    {
      step: '02',
      title: 'AI Gap Analysis',
      desc: 'Our multi-agent pipeline compares your capabilities against live industry role benchmarks.'
    },
    {
      step: '03',
      title: 'Personalized Roadmap',
      desc: 'Receive sequenced milestones from Beginner to Industry-Ready with curated resources.'
    },
    {
      step: '04',
      title: 'Continuous Mastery',
      desc: 'Take interactive assessments, chat with your AI mentor, and track your readiness rise.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#020817] text-slate-100 flex flex-col selection:bg-violet-600 selection:text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-40 bg-[#020817]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/25 group-hover:scale-105 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Mentor<span className="text-violet-400">Skill</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/auth"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              to="/auth"
              className="btn-primary text-sm flex items-center gap-2 shadow-lg shadow-violet-600/30"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-600/20 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-purple-600/15 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-8">
            <Sparkles className="w-4 h-4 text-violet-400" />
            Powered by Groq LLaMA 3.3 Multi-Agent Swarm
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-8">
            Your Skills. Your Career.{' '}
            <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
              Your AI Mentor.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
            MentorSkill uses an intelligent multi-agent network to evaluate your profile, pinpoint your exact skill gaps, and guide your journey to engineering excellence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/auth"
              className="btn-primary text-base px-8 py-3.5 flex items-center gap-2.5 shadow-xl shadow-violet-600/30 hover:scale-105 transition-all w-full sm:w-auto justify-center"
            >
              <span>Launch Your Career Roadmap</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/auth"
              className="btn-secondary text-base px-8 py-3.5 w-full sm:w-auto justify-center"
            >
              Explore Demo Roles
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-white/10">
            <div>
              <div className="text-3xl font-bold text-white">6</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">AI Agents</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-violet-400">100%</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Personalized</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">4-Stage</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Learning Roadmap</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-400">&lt; 30s</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Analysis Speed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 bg-navy-900/40 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-3">Architected For Growth</h2>
            <p className="text-3xl sm:text-4xl font-bold text-white">Everything You Need to Break Into Tech</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="glass-card p-8 hover:border-violet-500/40 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-3">Seamless Progression</h2>
            <p className="text-3xl sm:text-4xl font-bold text-white">How MentorSkill Guides You</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="glass-card p-6 relative border-white/10 hover:border-violet-500/30 transition-all"
              >
                <span className="text-4xl font-black text-violet-500/20 block mb-4">
                  {step.step}
                </span>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Your AI Agents */}
      <section className="py-20 bg-navy-900/60 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-3">Multi-Agent Swarm Intelligence</h2>
            <p className="text-3xl sm:text-4xl font-bold text-white mb-4">Meet Your Dedicated AI Specialists</p>
            <p className="text-sm text-slate-400">Each agent specializes in a distinct phase of your technical mentorship, working together asynchronously.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent, idx) => {
              const Icon = agent.icon;
              return (
                <div
                  key={idx}
                  className="glass-card p-6 border-white/10 hover:border-violet-500/40 hover:-translate-y-1 transition-all group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${agent.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">{agent.name}</h4>
                      <span className="text-[11px] font-semibold text-violet-300 uppercase tracking-wider">{agent.role}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{agent.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="glass-card p-12 text-center border-violet-500/30 relative overflow-hidden shadow-2xl bg-gradient-to-b from-white/[0.08] to-transparent">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Ready to Accelerate Your Tech Career?
            </h2>
            <p className="text-base text-slate-300 max-w-xl mx-auto mb-8">
              Join MentorSkill today. Get an objective skill gap analysis and step onto a structured path to your dream role.
            </p>
            <Link
              to="/auth"
              className="btn-primary text-base px-8 py-3.5 inline-flex items-center gap-2 shadow-xl shadow-violet-600/40"
            >
              <span>Get Started Now — It's Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/10 py-8 bg-navy-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-violet-400" />
            <span>MentorSkill © {new Date().getFullYear()} — Autonomous AI Career Navigation</span>
          </div>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">API Status</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
