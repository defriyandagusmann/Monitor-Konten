'use client';

import React from 'react';
import { useContent } from '@/context/ContentContext';
import { 
  Sparkles, 
  Search, 
  Plus, 
  Radio, 
  Layers, 
  Database, 
  LogOut, 
  UserCheck, 
  Flame,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';

export function Navbar() {
  const { 
    currentUser, 
    loginWithGoogle, 
    logout, 
    isRealtimeActive, 
    isConfigured, 
    searchQuery, 
    setSearchQuery,
    platformFilter,
    setPlatformFilter,
    setIsNewModalOpen,
    setIsSettingsOpen,
    profiles
  } = useContent();

  const platforms = [
    { id: 'all', label: 'Semua Platform', icon: Layers },
    { id: 'tiktok', label: 'TikTok', color: '#F43F5E' },
    { id: 'instagram', label: 'Instagram', color: '#E11D48' },
    { id: 'youtube_shorts', label: 'YT Shorts', color: '#EF4444' },
    { id: 'youtube_long', label: 'YT Video', color: '#EA580C' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-coral-500 via-rosegold-500 to-champagne-500 shadow-glow-coral p-0.5">
            <div className="w-full h-full bg-midnight-900 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-coral-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                Monitor<span className="text-coral-400">Konten</span>
              </h1>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-coral-500/10 text-coral-300 border border-coral-500/20">
                PRO STUDIO
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Pipeline Alur Skrip hingga Posting Terpadu
            </p>
          </div>
        </div>

        {/* Search Bar & Platform Pills */}
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-xl mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari judul, topik, hook, atau skrip..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-midnight-850/80 border border-slate-700/60 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-coral-500/60 focus:ring-1 focus:ring-coral-500/50 transition-all"
            />
          </div>
        </div>

        {/* Right Section: Sync Badge, Create Button, Profile */}
        <div className="flex items-center gap-3">
          
          {/* Realtime / Supabase Indicator */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all bg-midnight-850 hover:bg-midnight-800"
            title="Klik untuk melihat konfigurasi Database & Supabase"
          >
            {isRealtimeActive ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-400 hidden sm:inline">Supabase Live</span>
              </>
            ) : isConfigured ? (
              <>
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                <span className="text-blue-400 hidden sm:inline">Supabase Siap</span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-champagne-400"></span>
                <span className="text-champagne-300 hidden sm:inline">Demo Mode</span>
              </>
            )}
            <Database className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {/* New Content Button */}
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="btn-coral-glow flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Buat Konten Baru</span>
            <span className="sm:hidden">Baru</span>
          </button>

          {/* User Profile / Google Login */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-1 border-l border-white/10">
              <div 
                onClick={loginWithGoogle}
                title={`Login sebagai: ${currentUser.full_name} (${currentUser.role}). Klik untuk beralih role.`}
                className="cursor-pointer flex items-center gap-2 group p-1 rounded-xl hover:bg-midnight-800 transition"
              >
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-coral-500/40 group-hover:border-coral-400 transition">
                  {currentUser.avatar_url ? (
                    <img
                      src={currentUser.avatar_url}
                      alt={currentUser.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-coral-500 to-champagne-500 flex items-center justify-center text-xs font-bold text-white">
                      {currentUser.full_name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-medium text-slate-200 leading-tight group-hover:text-coral-300 transition">
                    {currentUser.full_name}
                  </p>
                  <p className="text-[10px] text-slate-400 capitalize">
                    {currentUser.role}
                  </p>
                </div>
              </div>

              <button
                onClick={logout}
                title="Keluar / Logout"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium bg-white text-slate-900 hover:bg-slate-100 transition shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Login Google</span>
            </button>
          )}

        </div>

      </div>

      {/* Mobile search bar */}
      <div className="md:hidden mt-2.5 pt-2 border-t border-white/5">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari konten..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-midnight-850/80 border border-slate-700/60 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-coral-500/60"
          />
        </div>
      </div>
    </header>
  );
}

