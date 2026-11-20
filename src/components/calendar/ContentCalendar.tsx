'use client';

import React, { useState } from 'react';
import { useContent } from '@/context/ContentContext';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  isToday, 
  addMonths, 
  subMonths,
  parseISO
} from 'date-fns';
import { id } from 'date-fns/locale';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  ExternalLink 
} from 'lucide-react';

export function ContentCalendar() {
  const { contents, setSelectedContentId, setIsNewModalOpen } = useContent();
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Starting blank cells for calendar grid
  const startDay = monthStart.getDay(); // 0 is Sunday
  const blanks = Array.from({ length: startDay }, (_, i) => i);

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'tiktok': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'instagram': return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      case 'youtube_shorts': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'youtube_long': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default: return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      
      {/* Calendar Header */}
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-coral-500/10 text-coral-400">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white capitalize">
              {format(currentDate, 'MMMM yyyy', { locale: id })}
            </h2>
            <p className="text-xs text-slate-400">
              Jadwal posting dan publikasi multi-platform
            </p>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-midnight-800 text-slate-300 hover:text-white border border-slate-700"
          >
            Hari Ini
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-1.5 rounded-xl bg-midnight-800 text-slate-400 hover:text-white border border-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-1.5 rounded-xl bg-midnight-800 text-slate-400 hover:text-white border border-slate-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 glass-panel rounded-2xl overflow-hidden flex flex-col border border-white/5">
        
        {/* Day of Week Header */}
        <div className="grid grid-cols-7 border-b border-white/10 bg-midnight-900/60 text-center text-xs font-semibold text-slate-400 py-2.5">
          <span>Minggu</span>
          <span>Senin</span>
          <span>Selasa</span>
          <span>Rabu</span>
          <span>Kamis</span>
          <span>Jumat</span>
          <span>Sabtu</span>
        </div>

        {/* Days Cells */}
        <div className="flex-1 grid grid-cols-7 auto-rows-fr gap-px bg-white/5 overflow-y-auto">
          {/* Blank start cells */}
          {blanks.map((b) => (
            <div key={`blank-${b}`} className="bg-midnight-950/60 min-h-[90px] p-2" />
          ))}

          {/* Actual days */}
          {daysInMonth.map((day) => {
            const dayContents = contents.filter((c) => {
              if (c.scheduled_at) {
                try {
                  return isSameDay(parseISO(c.scheduled_at), day);
                } catch {
                  return false;
                }
              }
              if (c.published_at) {
                try {
                  return isSameDay(parseISO(c.published_at), day);
                } catch {
                  return false;
                }
              }
              return false;
            });

            const isCurrentDay = isToday(day);

            return (
              <div
                key={day.toISOString()}
                className={`bg-midnight-900/90 p-2 min-h-[100px] flex flex-col justify-between transition hover:bg-midnight-850/80 group ${
                  isCurrentDay ? 'ring-1 ring-coral-500/50 bg-coral-500/5' : ''
                }`}
              >
                {/* Date Header */}
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                      isCurrentDay
                        ? 'bg-coral-500 text-white shadow-glow-coral'
                        : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    {format(day, 'd')}
                  </span>
                  
                  {dayContents.length > 0 && (
                    <span className="text-[10px] text-slate-500 font-mono">
                      {dayContents.length} post
                    </span>
                  )}
                </div>

                {/* Items on this day */}
                <div className="flex-1 space-y-1 overflow-y-auto max-h-[85px]">
                  {dayContents.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedContentId(item.id)}
                      className={`cursor-pointer px-2 py-1 rounded-lg text-[10px] font-medium border truncate transition hover:brightness-125 ${getPlatformColor(
                        item.platform
                      )}`}
                      title={`${item.title} (${item.stage})`}
                    >
                      <span className="capitalize mr-1 font-bold">
                        {item.platform === 'youtube_shorts' ? 'Shorts' : item.platform}:
                      </span>
                      <span>{item.title}</span>
                    </div>
                  ))}
                </div>

                {/* Quick Add on Hover */}
                <div className="opacity-0 group-hover:opacity-100 transition pt-1 text-right">
                  <button
                    onClick={() => setIsNewModalOpen(true)}
                    className="text-[10px] text-coral-400 hover:underline"
                  >
                    + Jadwalkan
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}

