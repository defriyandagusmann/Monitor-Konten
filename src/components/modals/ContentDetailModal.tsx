'use client';

import React, { useState, useEffect } from 'react';
import { useContent } from '@/context/ContentContext';
import { STAGES } from '@/lib/mockData';
import { ContentItem, ContentStage, Platform, Priority } from '@/types';
import { 
  X, 
  Trash2, 
  Check, 
  Clock, 
  FileText, 
  Video, 
  CheckCircle2, 
  Calendar, 
  ExternalLink, 
  Sparkles, 
  Eye, 
  Share2,
  AlertCircle,
  Play,
  RotateCcw
} from 'lucide-react';
import { calculateScriptStats, formatDateIndo, formatSecondsToTime } from '@/lib/utils';
import { ScriptTeleprompterModal } from '../script/ScriptTeleprompterModal';

export function ContentDetailModal() {
  const { 
    selectedContentId, 
    setSelectedContentId, 
    contents, 
    updateContent, 
    deleteContent, 
    profiles, 
    channels 
  } = useContent();

  const content = contents.find((c) => c.id === selectedContentId);

  const [activeTab, setActiveTab] = useState<'script' | 'production' | 'review' | 'publish'>('script');
  const [isTeleprompterOpen, setIsTeleprompterOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<Platform>('tiktok');
  const [stage, setStage] = useState<ContentStage>('idea');
  const [priority, setPriority] = useState<Priority>('medium');
  const [hookScript, setHookScript] = useState('');
  const [bodyScript, setBodyScript] = useState('');
  const [ctaScript, setCtaScript] = useState('');
  const [visualNotes, setVisualNotes] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [storageAssetUrl, setStorageAssetUrl] = useState('');
  const [publishedUrl, setPublishedUrl] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');

  // Sync state when content changes
  useEffect(() => {
    if (content) {
      setTitle(content.title || '');
      setPlatform(content.platform || 'tiktok');
      setStage(content.stage || 'idea');
      setPriority(content.priority || 'medium');
      setHookScript(content.hook_script || '');
      setBodyScript(content.body_script || '');
      setCtaScript(content.cta_script || '');
      setVisualNotes(content.visual_notes || '');
      setAssignedTo(content.assigned_to || '');
      setStorageAssetUrl(content.storage_asset_url || '');
      setPublishedUrl(content.published_url || '');
      setScheduledAt(content.scheduled_at ? content.scheduled_at.substring(0, 16) : '');
    }
  }, [content]);

  if (!selectedContentId || !content) return null;

  // Realtime script metrics
  const fullScript = `${hookScript} ${bodyScript} ${ctaScript}`;
  const stats = calculateScriptStats(fullScript);

  const handleSave = async () => {
    await updateContent(content.id, {
      title,
      platform,
      stage,
      priority,
      hook_script: hookScript,
      body_script: bodyScript,
      cta_script: ctaScript,
      visual_notes: visualNotes,
      assigned_to: assignedTo,
      storage_asset_url: storageAssetUrl,
      published_url: publishedUrl,
      scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      video_duration_sec: stats.readingSeconds,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleStageChange = async (newStage: ContentStage) => {
    setStage(newStage);
    await updateContent(content.id, { stage: newStage });
  };

  const handleDelete = async () => {
    if (confirm('Yakin ingin menghapus konten ini? Data tidak dapat dikembalikan.')) {
      await deleteContent(content.id);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
        
        <div className="relative w-full max-w-4xl max-h-[92vh] glass-dropdown rounded-3xl border border-white/10 flex flex-col overflow-hidden shadow-2xl">
          
          {/* Header Bar */}
          <div className="p-4 sm:p-6 border-b border-white/10 flex items-start justify-between gap-4 bg-midnight-900/60">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Stage Badge Dropdown */}
                <select
                  value={stage}
                  onChange={(e) => handleStageChange(e.target.value as ContentStage)}
                  className="text-xs font-semibold px-3 py-1 rounded-xl bg-midnight-800 text-coral-300 border border-coral-500/40 focus:outline-none cursor-pointer"
                >
                  {STAGES.map((s) => (
                    <option key={s.id} value={s.id}>
                      Tahap: {s.title}
                    </option>
                  ))}
                </select>

                {/* Platform Dropdown */}
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as Platform)}
                  className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-midnight-800 text-slate-300 border border-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="tiktok">Platform: TikTok</option>
                  <option value="instagram">Platform: Instagram</option>
                  <option value="youtube_shorts">Platform: YT Shorts</option>
                  <option value="youtube_long">Platform: YouTube Video</option>
                  <option value="linkedin">Platform: LinkedIn</option>
                </select>

                {/* Priority */}
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-midnight-800 text-amber-300 border border-amber-500/30 focus:outline-none cursor-pointer"
                >
                  <option value="low">Prioritas: Rendah</option>
                  <option value="medium">Prioritas: Normal</option>
                  <option value="high">Prioritas: Tinggi</option>
                  <option value="urgent">Prioritas: Urgent</option>
                </select>
              </div>

              {/* Title input */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Judul Konten..."
                className="w-full text-base sm:text-lg font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-coral-500/50 focus:outline-none transition pb-0.5"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleDelete}
                title="Hapus Konten"
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedContentId(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-midnight-800 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 px-4 sm:px-6 pt-2 border-b border-white/5 bg-midnight-950/40">
            <button
              onClick={() => setActiveTab('script')}
              className={`flex items-center gap-2 px-3 py-2.5 text-xs font-semibold border-b-2 transition ${
                activeTab === 'script'
                  ? 'border-coral-500 text-coral-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Naskah & Hook Editor</span>
            </button>

            <button
              onClick={() => setActiveTab('production')}
              className={`flex items-center gap-2 px-3 py-2.5 text-xs font-semibold border-b-2 transition ${
                activeTab === 'production'
                  ? 'border-coral-500 text-coral-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Produksi & Editing</span>
            </button>

            <button
              onClick={() => setActiveTab('review')}
              className={`flex items-center gap-2 px-3 py-2.5 text-xs font-semibold border-b-2 transition ${
                activeTab === 'review'
                  ? 'border-coral-500 text-coral-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Review & Approval</span>
            </button>

            <button
              onClick={() => setActiveTab('publish')}
              className={`flex items-center gap-2 px-3 py-2.5 text-xs font-semibold border-b-2 transition ${
                activeTab === 'publish'
                  ? 'border-coral-500 text-coral-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Jadwal & Posting</span>
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* TAB 1: SCRIPT & HOOK */}
            {activeTab === 'script' && (
              <div className="space-y-5">
                {/* Script Bar Stats & Teleprompter CTA */}
                <div className="glass-panel p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-4 text-xs">
                    <div>
                      <span className="text-slate-400">Total Kata: </span>
                      <span className="font-mono font-bold text-white">{stats.wordCount}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Karakter: </span>
                      <span className="font-mono font-bold text-white">{stats.charCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-champagne-300">
                      <Clock className="w-3.5 h-3.5 text-champagne-400" />
                      <span>Estimasi Durasi Bicara: </span>
                      <span className="font-mono font-bold">{formatSecondsToTime(stats.readingSeconds)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsTeleprompterOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-midnight-800 text-coral-300 border border-coral-500/30 hover:bg-coral-500/20 transition"
                  >
                    <Play className="w-3.5 h-3.5 text-coral-400 fill-coral-400" />
                    <span>Mode Teleprompter</span>
                  </button>
                </div>

                {/* 1. HOOK SCRIPT (First 3 Seconds) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-coral-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>1. Hook Video (3 Detik Pertama yang Menentukan)</span>
                    </label>
                    <span className="text-[11px] text-slate-400">Gunakan pertanyaan mengejutkan atau kontradiksi</span>
                  </div>
                  <textarea
                    rows={2}
                    value={hookScript}
                    onChange={(e) => setHookScript(e.target.value)}
                    placeholder="Contoh: Jangan pernah posting video reels di jam ini kalau nggak mau views kamu anjlok..."
                    className="w-full p-3 rounded-xl bg-midnight-850/90 border border-coral-500/30 text-white text-xs leading-relaxed placeholder-slate-400 focus:outline-none focus:border-coral-500"
                  />
                </div>

                {/* 2. BODY SCRIPT & VISUAL NOTES (Two-Column Video Production Format) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Spoken Word (Audio) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-200">
                      2. Naskah Bicara (Isi / Materi)
                    </label>
                    <textarea
                      rows={8}
                      value={bodyScript}
                      onChange={(e) => setBodyScript(e.target.value)}
                      placeholder="Tuliskan poin-poin penjelasan atau narasi lengkap yang akan diucapkan..."
                      className="w-full p-3 rounded-xl bg-midnight-850/70 border border-slate-700/60 text-slate-100 text-xs leading-relaxed placeholder-slate-400 focus:outline-none focus:border-coral-500"
                    />
                  </div>

                  {/* Visual Cues & B-Roll */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-200">
                      Catatan Visual & B-Roll
                    </label>
                    <textarea
                      rows={8}
                      value={visualNotes}
                      onChange={(e) => setVisualNotes(e.target.value)}
                      placeholder="Petunjuk visual untuk editor/cameraman (misal: B-roll laptop, teks popup pop-in, sound effect whoosh)..."
                      className="w-full p-3 rounded-xl bg-midnight-850/70 border border-slate-700/60 text-slate-100 text-xs leading-relaxed placeholder-slate-400 focus:outline-none focus:border-coral-500 font-mono"
                    />
                  </div>

                </div>

                {/* 3. CTA SCRIPT */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    3. Call to Action (CTA Akhir)
                  </label>
                  <input
                    type="text"
                    value={ctaScript}
                    onChange={(e) => setCtaScript(e.target.value)}
                    placeholder="Contoh: Komen 'TEMPLATE' di bawah untuk dapatkan link unduhan gratisnya!"
                    className="w-full p-3 rounded-xl bg-midnight-850/70 border border-amber-500/30 text-white text-xs placeholder-slate-400 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: PRODUCTION & EDITING */}
            {activeTab === 'production' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Assignee */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">
                      Penanggung Jawab / Talent / Editor
                    </label>
                    <select
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-midnight-850 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-coral-500 cursor-pointer"
                    >
                      <option value="">-- Pilih Anggota Tim --</option>
                      {profiles.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.full_name} ({p.role})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Channel / Akun Target */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">
                      Akun Channel
                    </label>
                    <select
                      value={content.channel_id || ''}
                      onChange={(e) => updateContent(content.id, { channel_id: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-midnight-850 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-coral-500 cursor-pointer"
                    >
                      {channels.map((ch) => (
                        <option key={ch.id} value={ch.id}>
                          {ch.name} ({ch.handle})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Cloud Asset / Footage Link */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                    <span>Link Folder Footage / Draft Video (Google Drive / Dropbox)</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={storageAssetUrl}
                      onChange={(e) => setStorageAssetUrl(e.target.value)}
                      placeholder="https://drive.google.com/drive/folders/..."
                      className="flex-1 p-2.5 rounded-xl bg-midnight-850 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-coral-500"
                    />
                    {storageAssetUrl && (
                      <a
                        href={storageAssetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-midnight-800 hover:bg-midnight-700 text-blue-400 text-xs font-semibold flex items-center gap-1 border border-slate-700"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Buka</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Workflow Shortcut Buttons */}
                <div className="pt-2">
                  <p className="text-xs text-slate-400 mb-2 font-medium">Ubah Status Cepat:</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleStageChange('production')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                        stage === 'production'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                          : 'bg-midnight-800 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      🎬 Sedang Produksi & Syuting
                    </button>
                    <button
                      onClick={() => handleStageChange('editing')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                        stage === 'editing'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : 'bg-midnight-800 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      ✂️ Masuk Tahap Editing
                    </button>
                    <button
                      onClick={() => handleStageChange('review')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                        stage === 'review'
                          ? 'bg-pink-500/20 text-pink-300 border-pink-500/40'
                          : 'bg-midnight-800 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      🔍 Ajukan ke Review Tim
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: REVIEW & APPROVAL */}
            {activeTab === 'review' && (
              <div className="space-y-6">
                <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-pink-500 space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-pink-400" />
                    <h4 className="text-sm font-bold text-white">Review & Persetujuan Tim</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Pastikan hook sesuai durasi 3 detik, audio jernih tanpa noise berlebih, visual B-roll sinkron, dan call-to-action jelas sebelum disetujui untuk tayang.
                  </p>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={() => handleStageChange('published')}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Approve (Siap Tayang / Posted)</span>
                    </button>

                    <button
                      onClick={() => handleStageChange('editing')}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 transition flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-4 h-4 text-rose-400" />
                      <span>Minta Revisi Video (Kembalikan ke Editor)</span>
                    </button>

                    <button
                      onClick={() => handleStageChange('scripting')}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition flex items-center gap-1.5"
                    >
                      <FileText className="w-4 h-4 text-amber-400" />
                      <span>Revisi Skrip & Hook</span>
                    </button>
                  </div>
                </div>

                {/* Audit trail / Activity history preview */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Riwayat Konten
                  </h4>
                  <div className="p-3 rounded-xl bg-midnight-900/60 border border-white/5 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>Dibuat pada:</span>
                      <span className="font-mono text-slate-300">{formatDateIndo(content.created_at)}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>Terakhir diperbarui:</span>
                      <span className="font-mono text-slate-300">{formatDateIndo(content.updated_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: PUBLISH & SCHEDULE */}
            {activeTab === 'publish' && (
              <div className="space-y-5">
                {/* Schedule Picker */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-champagne-400" />
                    <span>Jadwal Tayang (Tanggal & Waktu)</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full sm:w-auto p-2.5 rounded-xl bg-midnight-850 border border-slate-700 text-xs text-white focus:outline-none focus:border-coral-500"
                  />
                  <p className="text-[11px] text-slate-400">
                    Konten ini akan muncul di kalender publikasi pada waktu yang dipilih.
                  </p>
                </div>

                {/* Published URL */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tautan Video yang Sudah Tayang (URL Postingan Live)</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={publishedUrl}
                      onChange={(e) => setPublishedUrl(e.target.value)}
                      placeholder="https://www.tiktok.com/@kreator/video/..."
                      className="flex-1 p-2.5 rounded-xl bg-midnight-850 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-coral-500"
                    />
                    {publishedUrl && (
                      <a
                        href={publishedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1 border border-emerald-500/30"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Buka Link</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      handleStageChange('published');
                      if (!publishedUrl) {
                        setPublishedUrl('https://tiktok.com/@live-post');
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:brightness-110 transition flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Tandai Sebagai Sudah Diposting</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Footer Bar */}
          <div className="p-4 sm:px-6 border-t border-white/10 flex items-center justify-between gap-3 bg-midnight-900/80">
            <div className="text-[11px] text-slate-400">
              {savedSuccess ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Perubahan tersimpan secara realtime!
                </span>
              ) : (
                <span>Ketik dan klik Simpan untuk memperbarui</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedContentId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-midnight-800 transition"
              >
                Tutup
              </button>
              <button
                onClick={handleSave}
                className="btn-coral-glow px-5 py-2 rounded-xl text-xs font-bold tracking-wide"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Teleprompter Overlay */}
      {isTeleprompterOpen && (
        <ScriptTeleprompterModal
          title={title}
          hook={hookScript}
          body={bodyScript}
          cta={ctaScript}
          onClose={() => setIsTeleprompterOpen(false)}
        />
      )}
    </>
  );
}

