'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import WeeklyProgress from '@/components/dashboard/WeeklyProgress';
import AICameraCard from '@/components/dashboard/AICameraCard';
import AICameraShotSelection from '@/components/dashboard/AICameraShotSelection';
import DietPlan from '@/components/dashboard/DietPlan';
import { BellIcon } from '@/components/Icons';

export default function PlayerHubPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0f0a] via-[#0f1a0f] to-[#1a251a] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-20">
        {/* Top Header */}
        <header className="border-b border-emerald-500/20 bg-black/95 backdrop-blur-xl sticky top-0 z-30 px-8 py-4 shadow-lg shadow-emerald-500/5">
          <div className="flex items-center justify-between">
            {/* Left - Logo and Navigation */}
            <div className="flex items-center gap-8">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="18" fill="#10b981" opacity="0.3"/>
                  <path d="M12 20 L18 26 L28 14" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-white text-lg font-black tracking-tight">
                  <span className="text-emerald-400">Cric</span>Prodigy
                </span>
              </div>

              {/* Navigation Links */}
              <nav className="flex items-center gap-8">
                <button className="text-white/60 font-bold text-sm hover:text-white transition-colors">
                  Home
                </button>
                <button className="text-emerald-400 font-bold text-sm border-b-2 border-emerald-400 pb-1">
                  Training
                </button>
                <button className="text-white/60 font-bold text-sm hover:text-white transition-colors">
                  Diet
                </button>
              </nav>
            </div>

            {/* Right - Notifications and Profile */}
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-emerald-500/10 rounded-lg transition-all relative group">
                <BellIcon />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>
              
              {/* Profile Avatar */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 cursor-pointer hover:scale-110 transition-transform">
                {session.user?.image ? (
                  <img 
                    src={session.user.image} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover" 
                  />
                ) : (
                  <span className="text-black font-black text-sm">
                    {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>

              {/* Analysis Button */}
              <button className="bg-gradient-to-br from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-black font-black rounded-full px-6 py-2 text-sm transition-all shadow-lg shadow-emerald-500/50 hover:shadow-emerald-500/70">
                Analysis
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="p-6 space-y-6">
          {/* Top Row - Chart and Diet Plan (Same Size) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Training Progress */}
            <WeeklyProgress />
            
            {/* Diet Plan */}
            <DietPlan />
          </div>

          {/* Bottom Row - AI Camera Section (Stretched) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AICameraCard />
            <AICameraShotSelection />
          </div>
        </div>
      </div>
    </div>
  );
}
