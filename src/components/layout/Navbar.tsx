'use client';

import React from 'react';
import { useContent } from '@/context/ContentContext';
import { 
  Sparkles, 
  Search, 
  Plus, 
  Layers, 
  LogOut, 
  Sun,
  Moon,
} from 'lucide-react';

export function Navbar() {
  const { 
    currentUser, 
    loginWithGoogle, 
    logout, 
    searchQuery, 
    setSearchQuery,
    setIsNewModalOpen,
    theme,
    toggleTheme,
  } = useContent();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200 dark:border-white/10 px-4 lg:px-6 py-3 transition-colors duration-200">
      <div className="flex items-center justify-between gap-4">
        
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-coral-500 via-rosegold-500 to-champagne-500 shadow-glow-coral p-0.5">
            <div className="w-full h-full bg-white dark:bg-midnight-900 rounded-[10px] flex items-center justify-center transition-colors">
              <Sparkles className="w-5 h-5 text-coral-500 dark:text-coral-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 transition-colors">
                Monitor<span className="text-coral-500 dark:text-coral-400">Konten</span>
              </h1>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-coral-500/10 text-coral-600 dark:text-coral-300 border border-coral-500/20">
                STUDIO
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block transition-colors">
              Pipeline Alur Skrip hingga Posting Terpadu
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-xl mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari judul, topik, hook, atau naskah konten..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-midnight-850/80 border border-slate-300 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-coral-500 focus:ring-1 focus:ring-coral-500 transition-all"
            />
          </div>
        </div>

        {/* Right Section: Theme Toggle, Create Button, Profile */}
        <div className="flex items-center gap-2.5">
          
          {/* Theme Toggle Button (Light / Dark) */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Ganti ke Mode Terang (Light Mode)' : 'Ganti ke Mode Gelap (Dark Mode)'}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-midnight-850 dark:hover:bg-midnight-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 transition-all shadow-sm"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-90 duration-200" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600 animate-in spin-in-90 duration-200" />
            )}
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
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-white/10">
              <div 
                className="flex items-center gap-2 p-1 rounded-xl"
              >
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-coral-500/40">
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
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                    {currentUser.full_name}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
                    {currentUser.email}
                  </p>
                </div>
              </div>

              <button
                onClick={logout}
                title="Keluar / Logout"
                className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium bg-white text-slate-800 hover:bg-slate-50 border border-slate-300 dark:border-transparent dark:text-slate-900 dark:bg-white dark:hover:bg-slate-100 transition shadow-sm"
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
      <div className="md:hidden mt-2.5 pt-2 border-t border-slate-200 dark:border-white/5">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari konten..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-midnight-850/80 border border-slate-300 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-coral-500"
          />
        </div>
      </div>
    </header>
  );
}
