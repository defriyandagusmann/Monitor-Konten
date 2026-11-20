'use client';

import React, { useState } from 'react';
import { useContent } from '@/context/ContentContext';
import { ContentStage, Platform, Priority } from '@/types';
import { X, Sparkles, Plus, FileText } from 'lucide-react';
import { STAGES } from '@/lib/mockData';

export function NewContentModal() {
  const { isNewModalOpen, setIsNewModalOpen, addContent, profiles, channels } = useContent();

  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<Platform>('tiktok');
  const [stage, setStage] = useState<ContentStage>('idea');
  const [priority, setPriority] = useState<Priority>('medium');
  const [hookScript, setHookScript] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isNewModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await addContent({
        title: title.trim(),
        platform,
        stage,
        priority,
        hook_script: hookScript.trim(),
        assigned_to: assignedTo || undefined,
        scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      });

      // Reset form & close
      setTitle('');
      setHookScript('');
      setIsNewModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-lg glass-dropdown rounded-3xl border border-white/10 flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-midnight-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-coral-500/20 text-coral-400 flex items-center justify-center border border-coral-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Buat Konten Baru</h2>
              <p className="text-[11px] text-slate-400">Tambahkan ide atau skrip ke pipeline tim</p>
            </div>
          </div>

          <button
            onClick={() => setIsNewModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-midnight-800 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-200">
              Judul / Topik Konten <span className="text-coral-400">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Misal: 3 Trik Bikin Video Reels FYP di 2026..."
              className="w-full p-2.5 rounded-xl bg-midnight-850 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-coral-500"
            />
          </div>

          {/* Platform & Priority Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-200">Platform Target</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="w-full p-2.5 rounded-xl bg-midnight-850 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-coral-500 cursor-pointer"
              >
                <option value="tiktok">TikTok</option>
                <option value="instagram">Instagram Reels</option>
                <option value="youtube_shorts">YouTube Shorts</option>
                <option value="youtube_long">YouTube Video</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-200">Prioritas</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full p-2.5 rounded-xl bg-midnight-850 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-coral-500 cursor-pointer"
              >
                <option value="low">Rendah</option>
                <option value="medium">Normal</option>
                <option value="high">Tinggi</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Initial Stage */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-200">Tahap Mulai</label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as ContentStage)}
              className="w-full p-2.5 rounded-xl bg-midnight-850 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-coral-500 cursor-pointer"
            >
              {STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} ({s.subtitle})
                </option>
              ))}
            </select>
          </div>

          {/* Hook Preview */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
              <span>Hook Skrip Pembuka (Opsional)</span>
              <span className="text-[10px] text-coral-400">3 Detik Pertama</span>
            </label>
            <textarea
              rows={2}
              value={hookScript}
              onChange={(e) => setHookScript(e.target.value)}
              placeholder="Contoh: Jangan scroll dulu kalau kamu masih bingung ide konten..."
              className="w-full p-2.5 rounded-xl bg-midnight-850 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-coral-500"
            />
          </div>

          {/* Assignee */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-200">Tugaskan ke Anggota Tim</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-midnight-850 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-coral-500 cursor-pointer"
            >
              <option value="">-- Tugaskan Nanti --</option>
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.full_name} ({p.role})
                </option>
              ))}
            </select>
          </div>

          {/* Footer actions */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNewModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-midnight-800 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="btn-coral-glow px-5 py-2 rounded-xl text-xs font-bold tracking-wide flex items-center gap-1.5 disabled:opacity-50"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Tambahkan Konten'}</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}

