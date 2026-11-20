'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Type, FastForward } from 'lucide-react';

interface ScriptTeleprompterModalProps {
  title: string;
  hook: string;
  body: string;
  cta: string;
  onClose: () => void;
}

export function ScriptTeleprompterModal({
  title,
  hook,
  body,
  cta,
  onClose,
}: ScriptTeleprompterModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(2); // 1 to 5
  const [fontSize, setFontSize] = useState(32); // px
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effect
  useEffect(() => {
    let intervalId: any = null;
    if (isPlaying && scrollerRef.current) {
      intervalId = setInterval(() => {
        if (scrollerRef.current) {
          scrollerRef.current.scrollTop += scrollSpeed;
        }
      }, 30);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying, scrollSpeed]);

  const handleReset = () => {
    setIsPlaying(false);
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = 0;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-midnight-950 text-white select-none animate-in fade-in duration-200">
      
      {/* Top Controls Bar */}
      <div className="p-4 glass-panel border-b border-white/10 flex items-center justify-between gap-4">
        
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-coral-400">
            Mode Teleprompter
          </span>
          <h3 className="text-sm font-bold text-white truncate max-w-md">
            {title}
          </h3>
        </div>

        {/* Center Player Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-coral-500 to-rose-600 text-white shadow-glow-coral hover:brightness-110 transition"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>Jeda (Pause)</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Mulai Baca (Play)</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            title="Ulangi dari awal"
            className="p-2 rounded-xl bg-midnight-800 text-slate-300 hover:text-white border border-slate-700 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Settings & Close */}
        <div className="flex items-center gap-4">
          
          {/* Speed */}
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="text-slate-400">Kecepatan:</span>
            <input
              type="range"
              min="1"
              max="6"
              value={scrollSpeed}
              onChange={(e) => setScrollSpeed(Number(e.target.value))}
              className="w-20 accent-coral-500"
            />
            <span className="font-mono text-coral-300">{scrollSpeed}x</span>
          </div>

          {/* Font Size */}
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <Type className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="range"
              min="20"
              max="54"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-20 accent-coral-500"
            />
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-midnight-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>

        </div>

      </div>

      {/* Teleprompter Scrolling Content */}
      <div
        ref={scrollerRef}
        className="flex-1 overflow-y-auto px-6 py-20 max-w-4xl mx-auto w-full leading-relaxed tracking-wide space-y-12"
        style={{ fontSize: `${fontSize}px` }}
      >
        {/* Hook */}
        {hook && (
          <div className="border-l-4 border-coral-500 pl-6 py-2">
            <p className="text-xs uppercase tracking-widest font-bold text-coral-400 mb-2">
              [HOOK PEMBUKA - 3 DETIK PERTAMA]
            </p>
            <p className="font-bold text-coral-100">
              {hook}
            </p>
          </div>
        )}

        {/* Body */}
        {body && (
          <div className="space-y-6 text-slate-100">
            {body.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}

        {/* CTA */}
        {cta && (
          <div className="border-l-4 border-amber-400 pl-6 py-2">
            <p className="text-xs uppercase tracking-widest font-bold text-amber-400 mb-2">
              [CALL TO ACTION - PENUTUP]
            </p>
            <p className="font-semibold text-amber-200">
              {cta}
            </p>
          </div>
        )}

        <div className="h-96" /> {/* Extra bottom padding for comfortable reading */}
      </div>

    </div>
  );
}

