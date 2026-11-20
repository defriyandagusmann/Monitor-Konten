'use client';

import React from 'react';
import { useContent } from '@/context/ContentContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { ContentCalendar } from '@/components/calendar/ContentCalendar';
import { ScriptLabView } from '@/components/script/ScriptLabView';
import { AnalyticsView } from '@/components/analytics/AnalyticsView';
import { ContentDetailModal } from '@/components/modals/ContentDetailModal';
import { NewContentModal } from '@/components/modals/NewContentModal';
import { Kanban, CalendarDays, FileEdit, BarChart3 } from 'lucide-react';

export default function Home() {
  const { activeTab, setActiveTab } = useContent();

  const tabs = [
    { id: 'kanban' as const, label: 'Pipeline', icon: Kanban },
    { id: 'calendar' as const, label: 'Kalender', icon: CalendarDays },
    { id: 'scriptlab' as const, label: 'Script Lab', icon: FileEdit },
    { id: 'analytics' as const, label: 'Metrik', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-midnight-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Desktop Sidebar */}
        <Sidebar />

        {/* Content View Area */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-y-auto max-h-[calc(100vh-65px)]">
          
          {/* Mobile Bottom Navigation Pills */}
          <div className="lg:hidden flex items-center justify-around p-1.5 mb-4 glass-panel rounded-2xl border border-slate-200 dark:border-white/10">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? 'bg-coral-500/10 dark:bg-coral-500/20 text-coral-600 dark:text-coral-300 border border-coral-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active View Switcher */}
          {activeTab === 'kanban' && <KanbanBoard />}
          {activeTab === 'calendar' && <ContentCalendar />}
          {activeTab === 'scriptlab' && <ScriptLabView />}
          {activeTab === 'analytics' && <AnalyticsView />}

        </main>

      </div>

      {/* Global Modals */}
      <ContentDetailModal />
      <NewContentModal />

    </div>
  );
}
