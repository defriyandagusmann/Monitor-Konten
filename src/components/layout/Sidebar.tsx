'use client';

import React from 'react';
import { useContent } from '@/context/ContentContext';
import { 
  Kanban, 
  CalendarDays, 
  FileEdit, 
  BarChart3, 
  Users, 
  Settings, 
  Radio, 
  Sparkles,
  ChevronRight,
  Database,
  Layers
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
    setIsSettingsOpen
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
    <aside className="w-64 glass-panel border-r border-white/10 hidden lg:flex flex-col justify-between p-4 min-h-[calc(100vh-65px)]">
      
      <div className="space-y-6">
        
        {/* Main Navigation */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 mb-2">
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
                      ? 'bg-gradient-to-r from-coral-500/20 to-champagne-500/10 text-white border border-coral-500/30 font-medium'
                      : 'text-slate-300 hover:text-white hover:bg-midnight-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-coral-400' : 'text-slate-400'}`} />
                    <span className="text-xs">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? 'bg-coral-500/30 text-coral-200'
                          : 'bg-midnight-800 text-slate-400'
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
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Filter Platform
            </p>
            {platformFilter !== 'all' && (
              <button 
                onClick={() => setPlatformFilter('all')}
                className="text-[10px] text-coral-400 hover:underline"
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
                      ? 'bg-midnight-800 text-white font-medium border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-midnight-850'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: p.color || '#94A3B8' }} 
                    />
                    <span>{p.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Anggota Tim (Multi-User Presence) */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Kolaborator Tim
            </p>
            {memberFilter !== 'all' && (
              <button 
                onClick={() => setMemberFilter('all')}
                className="text-[10px] text-coral-400 hover:underline"
              >
                Semua
              </button>
            )}
          </div>
          <div className="space-y-1">
            {profiles.map((profile) => {
              const isSelected = memberFilter === profile.id;
              const assignedCount = contents.filter(c => c.assigned_to === profile.id).length;
              return (
                <button
                  key={profile.id}
                  onClick={() => setMemberFilter(isSelected ? 'all' : profile.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition ${
                    isSelected
                      ? 'bg-coral-500/15 text-coral-300 border border-coral-500/30'
                      : 'text-slate-300 hover:bg-midnight-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0 border border-slate-700">
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-slate-700 flex items-center justify-center text-[10px] text-white">
                          {profile.full_name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className="truncate text-xs">{profile.full_name}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-midnight-800 text-slate-400 ml-1">
                    {assignedCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Supabase & Integration Banner */}
      <div className="pt-4 border-t border-white/10">
        <div 
          onClick={() => setIsSettingsOpen(true)}
          className="cursor-pointer p-3 rounded-xl bg-gradient-to-br from-midnight-850 to-midnight-800 border border-slate-700/60 hover:border-coral-500/40 transition group"
        >
          <div className="flex items-center gap-2 mb-1">
            <Database className="w-4 h-4 text-champagne-400 group-hover:text-coral-400 transition" />
            <span className="text-xs font-semibold text-slate-200">Supabase & Google Auth</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Data tersinkron otomatis antar akun. Klik untuk panduan setup database.
          </p>
          <div className="mt-2 flex items-center text-[10px] font-medium text-coral-400 group-hover:text-coral-300">
            <span>Buka Pengaturan</span>
            <ChevronRight className="w-3 h-3 ml-0.5 group-hover:translate-x-0.5 transition" />
          </div>
        </div>
      </div>

    </aside>
  );
}

