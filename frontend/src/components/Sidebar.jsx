import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  ClipboardCheck,
  Compass,
  BarChart3,
  Map,
  BookOpen,
  Brain,
  TrendingUp,
  Sparkles,
  X
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Skill Assessment', path: '/assessments', icon: ClipboardCheck },
  { name: 'Career Explorer', path: '/careers', icon: Compass },
  { name: 'Skill Gap Analysis', path: '/skill-gap', icon: BarChart3 },
  { name: 'My Roadmap', path: '/roadmap', icon: Map },
  { name: 'Learning Hub', path: '/learning', icon: BookOpen },
  { name: 'AI Mentor', path: '/mentor', icon: Brain },
  { name: 'Progress', path: '/progress', icon: TrendingUp },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-navy-900 border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
          <NavLink to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/25 group-hover:scale-105 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                Mentor<span className="text-violet-400">Skill</span>
              </span>
              <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                AI Career Co-Pilot
              </span>
            </div>
          </NavLink>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Workspace
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024 && onClose) onClose();
                }}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="p-4 m-3 rounded-xl bg-gradient-to-br from-violet-900/40 to-purple-900/20 border border-violet-500/20">
          <div className="flex items-center gap-2 mb-2 text-violet-400">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">6 AI Specialists</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Autonomous multi-agent system analyzing your career trajectory in real-time.
          </p>
        </div>
      </aside>
    </>
  );
}
