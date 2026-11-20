'use client';

import React from 'react';
import { useContent } from '@/context/ContentContext';
import { STAGES } from '@/lib/mockData';
import { 
  BarChart3, 
  PieChart, 
  Users, 
  Layers 
} from 'lucide-react';

export function AnalyticsView() {
  const { contents, profiles } = useContent();

  const total = contents.length;
  const published = contents.filter(c => c.stage === 'published').length;

  // Platform counts
  const tiktokCount = contents.filter(c => c.platform === 'tiktok').length;
  const igCount = contents.filter(c => c.platform === 'instagram').length;
  const ytShortsCount = contents.filter(c => c.platform === 'youtube_shorts').length;
  const ytLongCount = contents.filter(c => c.platform === 'youtube_long').length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="glass-panel p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 border-l-4 border-l-coral-500 transition-colors">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-coral-500" />
            <span>Dashboard Performa Pipeline Tim</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Ringkasan kecepatan produksi konten, distribusi platform, dan beban kerja tim.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-midnight-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400">Total Konten: </span>
            <span className="text-slate-900 dark:text-white font-bold">{total}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300">
            <span>Posted: </span>
            <span className="font-bold">{published}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Stage Funnel Distribution */}
        <div className="glass-panel p-5 rounded-2xl space-y-4 transition-colors">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-500" />
            <span>Distribusi Alur Fase Konten</span>
          </h3>

          <div className="space-y-3">
            {STAGES.map((s) => {
              const count = contents.filter(c => c.stage === s.id).length;
              const percent = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={s.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{s.title}</span>
                    <span className="text-slate-500 dark:text-slate-400 font-mono">{count} ({percent}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-midnight-850 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-coral-500 to-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Platform Breakdown */}
        <div className="glass-panel p-5 rounded-2xl space-y-4 transition-colors">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-coral-500" />
            <span>Target Platform Tayang</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-midnight-850/80 border border-rose-200 dark:border-rose-500/20 space-y-1">
              <span className="text-xs text-rose-700 dark:text-rose-300 font-semibold">TikTok</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{tiktokCount}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Video Pendek</p>
            </div>

            <div className="p-3.5 rounded-xl bg-pink-50/70 dark:bg-midnight-850/80 border border-pink-200 dark:border-pink-500/20 space-y-1">
              <span className="text-xs text-pink-700 dark:text-pink-300 font-semibold">Instagram Reels</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{igCount}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Reels & Carousel</p>
            </div>

            <div className="p-3.5 rounded-xl bg-red-50/70 dark:bg-midnight-850/80 border border-red-200 dark:border-red-500/20 space-y-1">
              <span className="text-xs text-red-700 dark:text-red-300 font-semibold">YouTube Shorts</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{ytShortsCount}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Short-form Video</p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-midnight-850/80 border border-amber-200 dark:border-amber-500/20 space-y-1">
              <span className="text-xs text-amber-700 dark:text-amber-300 font-semibold">YouTube Video</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{ytLongCount}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Long-form Studio</p>
            </div>
          </div>
        </div>

      </div>

      {/* Team Workload */}
      <div className="glass-panel p-5 rounded-2xl space-y-4 transition-colors">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300 flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-500" />
          <span>Beban Kerja Kolaborator Tim (Akun Google)</span>
        </h3>

        {profiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {profiles.map((profile) => {
              const assigned = contents.filter(c => c.assigned_to === profile.id);
              return (
                <div key={profile.id} className="p-4 rounded-xl bg-slate-50 dark:bg-midnight-850/70 border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-300 dark:border-slate-600 flex-shrink-0">
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs text-slate-700 dark:text-white font-bold">
                          {profile.full_name ? profile.full_name.charAt(0) : 'U'}
                        </div>
                      )}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{profile.full_name || profile.email}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">{profile.email}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Konten Ditugaskan:</span>
                    <span className="font-bold text-coral-600 dark:text-coral-300">{assigned.length}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
            Belum ada anggota tim yang login dengan akun Google.
          </div>
        )}
      </div>

    </div>
  );
}
