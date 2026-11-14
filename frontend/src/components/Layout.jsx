import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;
    async function fetchProfile() {
      if (!user) return;
      try {
        const res = await api.get('/api/profile');
        if (isMounted && res.data?.profile) {
          setUserProfile(res.data.profile);
        }
      } catch (err) {
        console.warn('Could not load profile header info', err);
      }
    }
    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, [user]);

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <TopNav
          onOpenSidebar={() => setSidebarOpen(true)}
          userProfile={userProfile}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
