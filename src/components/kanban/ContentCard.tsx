'use client';

import React from 'react';
import { ContentItem, ContentStage } from '@/types';
import { useContent } from '@/context/ContentContext';
import { 
  Clock, 
  Calendar, 
  ChevronRight, 
  ChevronLeft, 
  Film, 
  FileText, 
  AlertTriangle, 
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { formatSecondsToTime, formatShortDate } from '@/lib/utils';
import { STAGES } from '@/lib/mockData';

interface ContentCardProps {
  content: ContentItem;
}

export function ContentCard({ content }: ContentCardProps) {
  const { setSelectedContentId, moveStage } = useContent();

  const platformBadge = {
    tiktok: { label: 'TikTok', bg: 'bg-rose-500/15 text-rose-300 border-rose-500/30' },
    instagram: { label: 'Instagram', bg: 'bg-pink-500/15 text-pink-300 border-pink-500/30' },
    youtube_shorts: { label: 'YT Shorts', bg: 'bg-red-500/15 text-red-300 border-red-500/30' },
    youtube_long: { label: 'YouTube Video', bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
    linkedin: { label: 'LinkedIn', bg: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
  }[content.platform] || { label: content.platform, bg: 'bg-slate-700 text-slate-300' };

  const priorityBadge = {
    urgent: { label: 'Urgent', bg: 'bg-red-500/20 text-red-300 border-red-500/30' },
    high: { label: 'Tinggi', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    medium: { label: 'Normal', bg: 'bg-slate-700/60 text-slate-300 border-slate-600' },
    low: { label: 'Rendah', bg: 'bg-slate-800 text-slate-400 border-slate-700' },
  }[content.priority];

  const currentStageIndex = STAGES.findIndex((s) => s.id === content.stage);
  const prevStage = currentStageIndex > 0 ? STAGES[currentStageIndex - 1].id : null;
  const nextStage = currentStageIndex < STAGES.length - 1 ? STAGES[currentStageIndex + 1].id : null;

  return (
    <div
      onClick={() => setSelectedContentId(content.id)}
      className="group relative cursor-pointer rounded-2xl glass-panel p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-coral-500/40 hover:shadow-glow-coral/30 space-y-3"
    >
      {/* Top: Platform & Priority */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${platformBadge.bg}`}>
            {platformBadge.label}
          </span>
          {content.priority === 'urgent' && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${priorityBadge.bg}`}>
              <AlertTriangle className="w-2.5 h-2.5" />
              {priorityBadge.label}
            </span>
          )}
        </div>

        {/* Duration badge */}
        {content.video_duration_sec > 0 && (
          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            {formatSecondsToTime(content.video_duration_sec)}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-xs font-semibold text-slate-100 group-hover:text-coral-300 transition line-clamp-2 leading-relaxed">
        {content.title}
      </h3>

      {/* Hook Script Snippet Preview */}
      {content.hook_script && (
        <div className="rounded-xl bg-midnight-900/80 p-2 border border-slate-800/80 text-[11px] leading-snug">
          <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider font-bold text-coral-400 mb-1">
            <FileText className="w-2.5 h-2.5" />
            <span>Hook Skrip</span>
          </div>
          <p className="text-slate-300 italic line-clamp-2">
            &ldquo;{content.hook_script}&rdquo;
          </p>
        </div>
      )}

      {/* Scheduled date or published link */}
      {content.scheduled_at && content.stage !== 'published' && (
        <div className="flex items-center gap-1.5 text-[11px] text-champagne-300/90 font-medium">
          <Calendar className="w-3.5 h-3.5 text-champagne-400" />
          <span>Jadwal: {formatShortDate(content.scheduled_at)}</span>
        </div>
      )}

      {content.stage === 'published' && content.published_url && (
        <a
          href={content.published_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 text-[11px] text-emerald-400 hover:underline"
        >
          <ExternalLink className="w-3 h-3" />
          <span>Lihat Postingan</span>
        </a>
      )}

      {/* Footer: Assignee & Stage quick mover */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
        {/* Assignee */}
        <div className="flex items-center gap-1.5">
          {content.assignee ? (
            <div className="flex items-center gap-1.5" title={`Ditugaskan ke: ${content.assignee.full_name}`}>
              <div className="relative w-5 h-5 rounded-full overflow-hidden border border-slate-600">
                {content.assignee.avatar_url ? (
                  <img
                    src={content.assignee.avatar_url}
                    alt={content.assignee.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-700 flex items-center justify-center text-[9px] text-white">
                    {content.assignee.full_name.charAt(0)}
                  </div>
                )}
              </div>
              <span className="text-[11px] text-slate-400 truncate max-w-[85px]">
                {content.assignee.full_name.split(' ')[0]}
              </span>
            </div>
          ) : (
            <span className="text-[10px] text-slate-400 italic">Belum ditugaskan</span>
          )}
        </div>

        {/* Quick Shift Stage Arrows */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
          {prevStage && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                moveStage(content.id, prevStage);
              }}
              title="Kembalikan ke tahap sebelumnya"
              className="p-1 rounded-lg bg-midnight-800 hover:bg-midnight-700 text-slate-400 hover:text-white transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}

          {nextStage && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                moveStage(content.id, nextStage);
              }}
              title="Lanjutkan ke tahap berikutnya"
              className="p-1 rounded-lg bg-coral-500/20 hover:bg-coral-500/30 text-coral-300 hover:text-coral-200 border border-coral-500/30 transition"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

