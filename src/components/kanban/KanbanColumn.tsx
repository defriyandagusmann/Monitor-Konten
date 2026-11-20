'use client';

import React from 'react';
import { ContentItem, ContentStage, StageDefinition } from '@/types';
import { ContentCard } from './ContentCard';
import { 
  Lightbulb, 
  FileText, 
  Camera, 
  Film, 
  CheckCircle2, 
  Send,
  Plus
} from 'lucide-react';
import { useContent } from '@/context/ContentContext';

interface KanbanColumnProps {
  stage: StageDefinition;
  items: ContentItem[];
}

export function KanbanColumn({ stage, items }: KanbanColumnProps) {
  const { setIsNewModalOpen, addContent } = useContent();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Lightbulb': return <Lightbulb className="w-4 h-4 text-amber-400" />;
      case 'FileText': return <FileText className="w-4 h-4 text-coral-400" />;
      case 'Camera': return <Camera className="w-4 h-4 text-blue-400" />;
      case 'Film': return <Film className="w-4 h-4 text-purple-400" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-4 h-4 text-pink-400" />;
      case 'Send': return <Send className="w-4 h-4 text-emerald-400" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col w-80 flex-shrink-0 rounded-2xl glass-panel-subtle p-3 h-full border border-white/5">
      
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-midnight-850 border border-white/5">
            {getIcon(stage.icon)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-bold text-slate-100">
                {stage.title}
              </h2>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-midnight-800 text-slate-300 font-semibold border border-white/5">
                {items.length}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              {stage.subtitle}
            </p>
          </div>
        </div>

        {/* Add button inside column */}
        <button
          onClick={() => {
            setIsNewModalOpen(true);
          }}
          title={`Tambah konten di tahap ${stage.title}`}
          className="p-1.5 text-slate-400 hover:text-coral-300 hover:bg-midnight-800 rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Card List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[450px]">
        {items.length > 0 ? (
          items.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-48 border border-dashed border-slate-700/60 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-400 mb-2">Belum ada konten di tahap ini</p>
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="text-[11px] text-coral-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Tambah Ide</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
}

