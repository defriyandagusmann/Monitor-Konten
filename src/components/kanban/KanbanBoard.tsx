'use client';

import React from 'react';
import { useContent } from '@/context/ContentContext';
import { STAGES } from '@/lib/mockData';
import { KanbanColumn } from './KanbanColumn';
import { 
  Sparkles, 
  Flame, 
  Clock, 
  CheckCircle, 
  Send, 
  Video, 
  PenTool,
  Filter
} from 'lucide-react';

export function KanbanBoard() {
  const { 
    contents, 
    searchQuery, 
    platformFilter, 
    memberFilter 
  } = useContent();

  // Filter items
  const filteredContents = contents.filter((item) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchHook = item.hook_script.toLowerCase().includes(q);
      const matchBody = item.body_script.toLowerCase().includes(q);
      if (!matchTitle && !matchHook && !matchBody) return false;
    }

    // Platform filter
    if (platformFilter !== 'all' && item.platform !== platformFilter) {
      return false;
    }

    // Member filter
    if (memberFilter !== 'all' && item.assigned_to !== memberFilter) {
      return false;
    }

    return true;
  });

  // Calculate quick metrics
  const total = contents.length;
  const inScripting = contents.filter(c => c.stage === 'scripting' || c.stage === 'idea').length;
  const inProduction = contents.filter(c => c.stage === 'production' || c.stage === 'editing').length;
  const inReview = contents.filter(c => c.stage === 'review').length;
  const published = contents.filter(c => c.stage === 'published').length;

  return (
    <div className="flex flex-col h-full space-y-4">
      
      {/* Top Metric Strip (Dual-Harmony Aesthetic) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        <div className="glass-panel p-3.5 rounded-2xl flex items-center justify-between border-l-4 border-l-amber-500">
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Ide & Skrip</p>
            <p className="text-xl font-bold text-white mt-0.5">{inScripting}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
            <PenTool className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-3.5 rounded-2xl flex items-center justify-between border-l-4 border-l-coral-500">
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Take & Editing</p>
            <p className="text-xl font-bold text-white mt-0.5">{inProduction}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-coral-500/10 text-coral-400">
            <Video className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-3.5 rounded-2xl flex items-center justify-between border-l-4 border-l-pink-500">
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Review & Approval</p>
            <p className="text-xl font-bold text-white mt-0.5">{inReview}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-3.5 rounded-2xl flex items-center justify-between border-l-4 border-l-emerald-500">
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Terjadwal & Posted</p>
            <p className="text-xl font-bold text-white mt-0.5">{published}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Send className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Horizontal Scrollable Kanban Columns */}
      <div className="flex-1 flex gap-4 overflow-x-auto pb-4 pt-1">
        {STAGES.map((stage) => {
          const stageItems = filteredContents.filter((c) => c.stage === stage.id);
          return (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              items={stageItems}
            />
          );
        })}
      </div>

    </div>
  );
}

