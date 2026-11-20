'use client';

import React, { useState } from 'react';
import { useContent } from '@/context/ContentContext';
import { 
  X, 
  Database, 
  Check, 
  Copy, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  Sparkles 
} from 'lucide-react';

export function SupabaseGuideModal() {
  const { isSettingsOpen, setIsSettingsOpen, isConfigured, isRealtimeActive } = useContent();
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isSettingsOpen) return null;

  const copySqlSchema = () => {
    const sqlScript = `-- Salin dan jalankan script ini di menu "SQL Editor" di dashboard Supabase Anda:
-- Silakan buka file supabase/schema.sql pada project untuk script lengkap.`;
    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-2xl glass-dropdown rounded-3xl border border-white/10 flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-midnight-900/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Konfigurasi Supabase & Google Login</span>
                {isRealtimeActive ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                    Terkoneksi Live
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                    Demo Mode (Mock Sinkron)
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-slate-400">
                Data real-time tersinkronisasi antar anggota tim gratis menggunakan Supabase
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-midnight-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-6 overflow-y-auto max-h-[75vh] text-xs">
          
          {/* Status Alert */}
          <div className="p-4 rounded-2xl bg-midnight-850/80 border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Status Koneksi Saat Ini:</span>
              <span className={`font-semibold ${isRealtimeActive ? 'text-emerald-400' : 'text-champagne-300'}`}>
                {isRealtimeActive ? '🟢 Live Realtime Terhubung' : '🟡 Demo Mode Siap Digunakan'}
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Saat ini aplikasi berjalan sempurna menggunakan penyimpanan lokal (LocalStorage). Bila ingin menghubungkan ke database online Supabase agar semua anggota tim di tempat berbeda melihat data yang sama secara langsung:
            </p>
          </div>

          {/* 3 Simple Setup Steps */}
          <div className="space-y-4">
            <h3 className="font-bold uppercase tracking-wider text-coral-400 text-[11px]">
              3 Langkah Mudah Menghubungkan Supabase Gratis:
            </h3>

            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-midnight-900/60 border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-coral-500/20 text-coral-400 flex items-center justify-center text-[10px]">1</span>
                  Buat Proyek Gratis di Supabase
                </span>
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-coral-400 hover:underline flex items-center gap-1 text-[11px]"
                >
                  <span>Buka Supabase.com</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Daftar akun gratis, buat organisasi baru dan buat project baru (pilih region terdekat: Singapore).
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-midnight-900/60 border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-coral-500/20 text-coral-400 flex items-center justify-center text-[10px]">2</span>
                  Jalankan SQL Schema Database
                </span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Di dashboard Supabase, buka menu <strong>SQL Editor</strong>, lalu salin dan jalankan seluruh isi file:
              </p>
              <div className="p-2.5 rounded-lg bg-midnight-950 border border-slate-800 flex items-center justify-between font-mono text-[11px] text-coral-300">
                <span>supabase/schema.sql</span>
                <span className="text-[10px] text-slate-400">(Tersedia di folder proyek Anda)</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-midnight-900/60 border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-coral-500/20 text-coral-400 flex items-center justify-center text-[10px]">3</span>
                  Salin URL & Anon Key ke .env.local
                </span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Buka menu <strong>Project Settings $\rightarrow$ API</strong> di Supabase, lalu masukkan ke file <code className="text-coral-300">.env.local</code>:
              </p>
              <div className="p-3 rounded-lg bg-midnight-950 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
                <p>NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co</p>
                <p>NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh... (Anon Public Key)</p>
              </div>
            </div>

            {/* Step 4: Google OAuth Note */}
            <div className="p-4 rounded-xl bg-midnight-900/60 border border-white/5 space-y-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">4</span>
                Aktifkan Login Google (Opsional)
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Di Supabase dashboard, buka menu <strong>Authentication $\rightarrow$ Providers $\rightarrow$ Google</strong>, aktifkan switch, dan masukkan Client ID & Secret dari Google Cloud Console.
              </p>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex items-center justify-end bg-midnight-900/70">
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-midnight-800 hover:bg-midnight-700 text-white transition"
          >
            Mengerti & Tutup
          </button>
        </div>

      </div>

    </div>
  );
}

