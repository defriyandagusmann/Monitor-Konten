'use client';

import React from 'react';
import { useContent } from '@/context/ContentContext';
import { 
  Kanban, 
  CalendarDays, 
  FileEdit, 
  BarChart3, 
  Users, 
  UserPlus,
} from 'lucide-react';

export function Sidebar() {
  const { 
    activeTab, 
    setActiveTab, 
    contents, 
    profiles, 
    memberFilter, 
    setMemberFilter,
    platformFilter,
    setPlatformFilter,
    loginWithGoogle,
  } = useContent();

  const navItems = [
    {
      id: 'kanban' as const,
      label: 'Pipeline Kanban',
      description: 'Alur kerja 6 tahap dari skrip ke post',
      icon: Kanban,
      badge: contents.length,
    },
    {
      id: 'calendar' as const,
      label: 'Kalender Posting',
      description: 'Slot tayang mingguan & bulanan',
      icon: CalendarDays,
      badge: contents.filter(c => c.scheduled_at || c.published_at).length,
    },
    {
      id: 'scriptlab' as const,
      label: 'Script Lab',
      description: 'Fokus penulisan Hook & Naskah',
      icon: FileEdit,
      badge: contents.filter(c => c.stage === 'scripting' || c.stage === 'idea').length,
    },
    {
      id: 'analytics' as const,
      label: 'Metrik & Ringkasan',
      description: 'Statistik produksi konten tim',
      icon: BarChart3,
      badge: undefined,
    },
  ];

  const platforms = [
    { id: 'all', label: 'Semua Platform' },
    { id: 'tiktok', label: 'TikTok', color: '#F43F5E' },
    { id: 'instagram', label: 'Instagram', color: '#E11D48' },
    { id: 'youtube_shorts', label: 'YT Shorts', color: '#EF4444' },
    { id: 'youtube_long', label: 'YouTube Video', color: '#EA580C' },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-slate-200 dark:border-white/10 hidden lg:flex flex-col justify-between p-4 min-h-[calc(100vh-65px)] transition-colors duration-200">
      
      <div className="space-y-6">
        
        {/* Main Navigation */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-3 mb-2">
            Workspace Tim
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-coral-500/10 dark:bg-gradient-to-r dark:from-coral-500/20 dark:to-champagne-500/10 text-coral-600 dark:text-white border border-coral-500/30 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-midnight-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-coral-500 dark:text-coral-400' : 'text-slate-400'}`} />
                    <span className="text-xs">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? 'bg-coral-500/20 text-coral-600 dark:bg-coral-500/30 dark:text-coral-200'
                          : 'bg-slate-200 dark:bg-midnight-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Filter Platform */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Filter Platform
            </p>
            {platformFilter !== 'all' && (
              <button 
                onClick={() => setPlatformFilter('all')}
                className="text-[10px] text-coral-500 dark:text-coral-400 hover:underline font-medium"
              >
                Reset
              </button>
            )}
          </div>
          <div className="space-y-1">
            {platforms.map((p) => {
              const isSelected = platformFilter === p.id;
              const count = p.id === 'all' 
                ? contents.length 
                : contents.filter(c => c.platform === p.id).length;
              return (
                <button
                  key={p.id}
                  onClick={() => setPlatformFilter(p.id)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition ${
                    isSelected
                      ? 'bg-slate-200/90 dark:bg-midnight-800 text-slate-900 dark:text-white font-semibold border border-slate-300 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-midnight-850'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: p.color || '#94A3B8' }} 
                    />
                    <span>{p.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Kolaborator Tim (Akun Google Asli yang Login) */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Kolaborator Tim
            </p>
            {memberFilter !== 'all' && (
              <button 
                onClick={() => setMemberFilter('all')}
                className="text-[10px] text-coral-500 dark:text-coral-400 hover:underline font-medium"
              >
                Semua
              </button>
            )}
          </div>

          <div className="space-y-1">
            {profiles.length > 0 ? (
              profiles.map((profile) => {
                const isSelected = memberFilter === profile.id;
                const assignedCount = contents.filter(c => c.assigned_to === profile.id).length;
                return (
                  <button
                    key={profile.id}
                    onClick={() => setMemberFilter(isSelected ? 'all' : profile.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition ${
                      isSelected
                        ? 'bg-coral-500/15 text-coral-600 dark:text-coral-300 border border-coral-500/30 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-midnight-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0 border border-slate-300 dark:border-slate-700">
                        {profile.avatar_url ? (
                          <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] text-slate-700 dark:text-white font-bold">
                            {profile.full_name ? profile.full_name.charAt(0) : 'U'}
                          </div>
                        )}
                      </div>
                      <span className="truncate text-xs">{profile.full_name || profile.email}</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-midnight-800 text-slate-600 dark:text-slate-400 ml-1">
                      {assignedCount}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-midnight-850/80 border border-slate-200 dark:border-white/5 text-center space-y-1.5">
                <Users className="w-5 h-5 mx-auto text-slate-400" />
                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                  Belum ada akun Google yang login
                </p>
                <button
                  onClick={loginWithGoogle}
                  className="text-[11px] text-coral-500 dark:text-coral-400 hover:underline font-semibold inline-flex items-center gap-1"
                >
                  <UserPlus className="w-3 h-3" />
                  <span>Login dengan Google</span>
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Clean bottom area without Supabase guide card */}
      <div className="pt-4 border-t border-slate-200 dark:border-white/10 text-center">
        <p className="text-[11px] text-slate-600 dark:text-slate-400">
          Monitor Konten Studio &copy; 2026
        </p>
      </div>

    </aside>
  );
}
