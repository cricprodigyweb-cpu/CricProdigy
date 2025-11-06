'use client';

import { useRouter } from 'next/navigation';
import { HomeIcon, ActivityIcon, UtensilsIcon, CameraIcon, BarChartIcon } from './Icons';

export default function Sidebar() {
  const router = useRouter();

  const navItems = [
    { icon: HomeIcon, label: 'Home', path: '/player-hub', active: true },
    { icon: ActivityIcon, label: 'Training', path: '/player-hub', active: false },
    { icon: UtensilsIcon, label: 'Diet', path: '/player-hub', active: false },
    { icon: CameraIcon, label: 'AI Camera', path: '/ai-analysis', active: false },
    { icon: BarChartIcon, label: 'Progress', path: '/player-hub', active: false },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 bg-black border-r border-emerald-500/20 flex flex-col items-center py-6 z-50 shadow-lg shadow-emerald-500/5">
      {/* Logo */}
      <div className="mb-12">
        <div className="flex flex-col items-center gap-1">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" fill="#10b981" opacity="0.3"/>
            <path d="M16 8 L16 24 M8 16 L24 16" stroke="#10b981" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col gap-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          return (
            <button
              key={item.label}
              onClick={() => router.push(item.path)}
              className={`group relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                item.active 
                  ? 'bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/20' 
                  : 'text-white/30 hover:text-emerald-400 hover:bg-emerald-500/10'
              }`}
              title={item.label}
            >
              <Icon />
              
              {/* Active indicator */}
              {item.active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-400 rounded-r shadow-lg shadow-emerald-400/50" />
              )}
              
              {/* Tooltip */}
              <div className="absolute left-full ml-4 px-3 py-2 bg-black/95 backdrop-blur-sm border border-emerald-500/30 text-white text-sm font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl shadow-emerald-500/20">
                {item.label}
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
