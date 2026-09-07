import React from 'react';
import { AppPageId } from '../types';
import { Clock, BookOpen, Table2, Smartphone, Code2 } from 'lucide-react';

interface PageNavigationProps {
  activePage: AppPageId;
  onSelectPage: (page: AppPageId) => void;
}

export interface PageMeta {
  id: AppPageId;
  label: string;
  shortLabel: string;
  description: string;
  icon: React.ElementType;
  badge?: string;
}

export const PAGES: PageMeta[] = [
  {
    id: 'dial',
    label: 'Live Dial & Scrubber',
    shortLabel: 'Live Dial',
    description: 'Real-time base-9 vortex dial, time-travel scrubber & harmonic node inspector',
    icon: Clock,
    badge: 'Live',
  },
  {
    id: 'rules',
    label: 'Rules & Geometry',
    shortLabel: 'Principles',
    description: 'Digital roots, vortex math loop (1-2-4-8-7-5), 3-6-9 triad & conversion logic',
    icon: BookOpen,
  },
  {
    id: 'table',
    label: '24-Hour Reference',
    shortLabel: '24h Table',
    description: 'Complete hour-by-hour conversion table with search, filters & harmonic groups',
    icon: Table2,
    badge: '00–23',
  },
  {
    id: 'digital',
    label: 'Digital & Daily Use',
    shortLabel: 'Digital & Apps',
    description: 'Lock screen clock, Apple/Android complications & 3 practical daily habits',
    icon: Smartphone,
  },
  {
    id: 'code',
    label: 'Formulas & Code',
    shortLabel: 'Code & Math',
    description: 'Copy-paste code snippets in Python, TypeScript, Swift and Excel formulas',
    icon: Code2,
  },
];

export const PageNavigation: React.FC<PageNavigationProps> = ({
  activePage,
  onSelectPage,
}) => {
  return (
    <nav
      id="main-page-navigation"
      aria-label="Main Sections"
      className="sticky top-16 z-30 w-full bg-slate-950/95 border-b border-slate-800 backdrop-blur-md shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 scrollbar-none no-scrollbar">
          {PAGES.map((page) => {
            const Icon = page.icon;
            const isActive = activePage === page.id;
            return (
              <button
                key={page.id}
                id={`nav-tab-${page.id}`}
                onClick={() => onSelectPage(page.id)}
                className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                    isActive ? 'text-slate-950 stroke-[2.5]' : 'text-amber-400'
                  }`}
                />
                <span className="hidden md:inline">{page.label}</span>
                <span className="md:hidden">{page.shortLabel}</span>
                {page.badge && (
                  <span
                    className={`text-[9px] font-mono font-extrabold uppercase px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-slate-950/20 text-slate-950 border border-slate-950/30'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {page.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
