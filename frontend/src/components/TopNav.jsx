import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Menu,
  Bell,
  LogOut,
  User as UserIcon,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export default function TopNav({ onOpenSidebar, userProfile }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (err) {
      console.error('Failed to log out', err);
    }
  };

  const displayName = userProfile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Learner';
  const displayRole = userProfile?.target_career || 'Exploring Careers';

  return (
    <header className="h-16 bg-navy-900/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Open Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs text-slate-400 font-medium">AI Agent Pipeline Online</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick run analysis pill */}
        <Link
          to="/skill-gap"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-600/20 text-violet-300 border border-violet-500/30 hover:bg-violet-600/30 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Run Gap Analysis</span>
        </Link>

        {/* Notifications trigger */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 relative transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-violet-500 ring-2 ring-navy-900"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-navy-900 border border-white/10 shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-sm font-semibold text-white">Notifications</span>
                <span className="text-xs text-violet-400">2 New</span>
              </div>
              <div className="py-2 space-y-2">
                <div className="p-2 rounded-lg bg-white/5 text-xs">
                  <p className="text-slate-200 font-medium">Roadmap Stage 1 Available</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Your personalized learning modules are ready.</p>
                </div>
                <div className="p-2 rounded-lg bg-white/5 text-xs">
                  <p className="text-slate-200 font-medium">New Assessment Recommended</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Validate your React proficiency score.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-white/5 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-purple-600 text-white font-semibold flex items-center justify-center text-sm shadow-md shadow-violet-500/20">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-semibold text-white leading-tight">{displayName}</div>
              <div className="text-[11px] text-slate-400 leading-tight">{displayRole}</div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-navy-900 border border-white/10 shadow-2xl py-2 z-50">
              <div className="px-4 py-2 border-b border-white/10 md:hidden">
                <p className="text-sm font-medium text-white">{displayName}</p>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </div>
              <Link
                to="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <UserIcon className="w-4 h-4 text-violet-400" />
                Profile Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
