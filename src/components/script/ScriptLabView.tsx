'use client';

import React, { useState } from 'react';
import { useContent } from '@/context/ContentContext';
import { 
  FileEdit, 
  Sparkles, 
  Plus, 
  Flame, 
  Zap, 
  HelpCircle, 
  BookOpen, 
  Play, 
  Copy, 
  Check 
} from 'lucide-react';
import { calculateScriptStats } from '@/lib/utils';
import { ScriptTeleprompterModal } from './ScriptTeleprompterModal';

export function ScriptLabView() {
  const { contents, setSelectedContentId, setIsNewModalOpen } = useContent();
  const [selectedScriptId, setSelectedScriptId] = useState<string>(contents[0]?.id || '');
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);
  const [isTeleprompterOpen, setIsTeleprompterOpen] = useState(false);

  const selectedContent = contents.find((c) => c.id === selectedScriptId) || contents[0];

  const hookFormulas = [
    {
      name: 'The Contrarian (Melawan Mitos)',
      desc: 'Bongkar keyakinan salah yang dipercaya banyak orang.',
      example: 'Jangan pernah mulai video kamu pakai kata X kalau nggak mau penonton langsung swipe!',
      tag: 'Viral Retention',
    },
    {
      name: 'The Immediate Value (Janji Solusi Cepat)',
      desc: 'Berikan solusi spesifik dalam durasi tertentu.',
      example: 'Cuma ubah 2 settingan ini di HP kamu, hasil foto langsung kayak kamera 20 juta.',
      tag: 'High Save Rate',
    },
    {
      name: 'The Costly Mistake (Kerugian Diam-Diam)',
      desc: 'Sentuh rasa takut ketinggalan / kerugian audiens.',
      example: '1 kesalahan sepele ini yang bikin akun kamu sepi views padahal udah rajin upload.',
      tag: 'Curiosity Peak',
    },
    {
      name: 'The Story / Behind The Scenes',
      desc: 'Ajak audiens melihat proses autentik tanpa sensor.',
      example: 'Gimana rasanya bikin video yang ditonton 1 juta orang pertama kali...',
      tag: 'High Watch Time',
    },
  ];

  const stats = selectedContent 
    ? calculateScriptStats(`${selectedContent.hook_script} ${selectedContent.body_script} ${selectedContent.cta_script}`)
    : { wordCount: 0, charCount: 0, readingSeconds: 0 };

  const copyToClipboard = (text: string, name: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormula(name);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-5 h-full">
      
      {/* Left List: Scripts in progress */}
      <div className="w-full lg:w-80 glass-panel rounded-2xl p-4 flex flex-col space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <FileEdit className="w-4 h-4 text-coral-400" />
            <h3 className="text-xs font-bold text-white">Daftar Skrip</h3>
          </div>
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="p-1 rounded-lg bg-coral-500/20 text-coral-300 hover:bg-coral-500/30 transition text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[600px]">
          {contents.map((item) => {
            const isSelected = item.id === selectedContent?.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedScriptId(item.id)}
                className={`cursor-pointer p-3 rounded-xl border transition ${
                  isSelected
                    ? 'bg-coral-500/15 border-coral-500/40 text-white'
                    : 'bg-midnight-850/60 border-slate-800 text-slate-300 hover:bg-midnight-800'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span className="capitalize font-semibold">{item.platform}</span>
                  <span className="px-1.5 py-0.2 rounded bg-midnight-800 text-slate-300 capitalize">
                    {item.stage}
                  </span>
                </div>
                <h4 className="text-xs font-semibold line-clamp-1">{item.title}</h4>
                {item.hook_script && (
                  <p className="text-[11px] text-slate-400 italic line-clamp-1 mt-1">
                    &ldquo;{item.hook_script}&rdquo;
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Center: Script Editor Canvas */}
      <div className="flex-1 glass-panel rounded-2xl p-5 flex flex-col space-y-4">
        {selectedContent ? (
          <>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-coral-400">
                  Script Lab Focus
                </span>
                <h2 className="text-base font-bold text-white">
                  {selectedContent.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTeleprompterOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-midnight-800 text-coral-300 border border-coral-500/30 hover:bg-coral-500/20 transition"
                >
                  <Play className="w-3.5 h-3.5 fill-coral-400 text-coral-400" />
                  <span>Teleprompter</span>
                </button>
                <button
                  onClick={() => setSelectedContentId(selectedContent.id)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-coral-500 text-white shadow-glow-coral hover:bg-coral-600 transition"
                >
                  Edit Lengkap
                </button>
              </div>
            </div>

            {/* Script Metrics Bar */}
            <div className="flex items-center gap-6 text-xs p-3 rounded-xl bg-midnight-900/60 border border-white/5">
              <div>
                <span className="text-slate-400">Total Kata: </span>
                <span className="font-mono font-bold text-white">{stats.wordCount}</span>
              </div>
              <div>
                <span className="text-slate-400">Karakter: </span>
                <span className="font-mono font-bold text-white">{stats.charCount}</span>
              </div>
              <div className="text-champagne-300">
                <span>Estimasi Durasi: </span>
                <span className="font-mono font-bold">{stats.readingSeconds} detik</span>
              </div>
            </div>

            {/* Hook Highlight */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-coral-500/10 to-transparent border border-coral-500/20 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-coral-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Hook 3 Detik Pertama
                </span>
              </div>
              <p className="text-sm font-semibold text-coral-100 italic">
                {selectedContent.hook_script || '(Belum ada hook yang ditulis)'}
              </p>
            </div>

            {/* Body & CTA */}
            <div className="flex-1 space-y-3 overflow-y-auto">
              <div className="p-4 rounded-xl bg-midnight-900/40 border border-white/5 space-y-1.5">
                <span className="text-xs font-bold text-slate-300">Naskah Utama</span>
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                  {selectedContent.body_script || '(Belum ada isi naskah yang ditulis)'}
                </p>
              </div>

              {selectedContent.cta_script && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                  <span className="text-xs font-bold text-amber-400">Call to Action (CTA)</span>
                  <p className="text-xs text-amber-100">{selectedContent.cta_script}</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 text-xs">
            Pilih skrip dari daftar di sebelah kiri
          </div>
        )}
      </div>

      {/* Right Column: High Retention Hook Formulas */}
      <div className="w-full lg:w-80 glass-panel rounded-2xl p-4 flex flex-col space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-white/5">
          <Sparkles className="w-4 h-4 text-champagne-400" />
          <h3 className="text-xs font-bold text-white">Formula Hook Terbukti</h3>
        </div>

        <div className="space-y-3 overflow-y-auto max-h-[600px] pr-1">
          {hookFormulas.map((formula, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-midnight-850/70 border border-slate-700/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">{formula.name}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-coral-500/20 text-coral-300 font-semibold">
                  {formula.tag}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{formula.desc}</p>
              <div className="p-2 rounded bg-midnight-900 text-[11px] text-slate-300 italic border border-white/5 flex items-center justify-between gap-2">
                <span>&ldquo;{formula.example}&rdquo;</span>
                <button
                  onClick={() => copyToClipboard(formula.example, formula.name)}
                  title="Salin contoh hook"
                  className="p-1 text-slate-400 hover:text-coral-300 transition"
                >
                  {copiedFormula === formula.name ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Teleprompter Modal */}
      {isTeleprompterOpen && selectedContent && (
        <ScriptTeleprompterModal
          title={selectedContent.title}
          hook={selectedContent.hook_script}
          body={selectedContent.body_script}
          cta={selectedContent.cta_script}
          onClose={() => setIsTeleprompterOpen(false)}
        />
      )}

    </div>
  );
}

