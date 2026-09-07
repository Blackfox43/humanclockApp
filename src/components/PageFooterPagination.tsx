import React from 'react';
import { AppPageId } from '../types';
import { PAGES, PageMeta } from './PageNavigation';
import { ChevronLeft, ChevronRight, Compass } from 'lucide-react';

interface PageFooterPaginationProps {
  currentPage: AppPageId;
  onSelectPage: (page: AppPageId) => void;
}

export const PageFooterPagination: React.FC<PageFooterPaginationProps> = ({
  currentPage,
  onSelectPage,
}) => {
  const currentIndex = PAGES.findIndex((p) => p.id === currentPage);
  const prevPage: PageMeta | null = currentIndex > 0 ? PAGES[currentIndex - 1] : null;
  const nextPage: PageMeta | null =
    currentIndex < PAGES.length - 1 ? PAGES[currentIndex + 1] : null;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-800/80">
      {/* Previous / Next Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {prevPage ? (
          <button
            id="pagination-prev-btn"
            onClick={() => {
              onSelectPage(prevPage.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left text-slate-300 hover:text-white transition-all group shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 text-amber-500 group-hover:-translate-x-1 transition-transform shrink-0" />
            <div>
              <span className="block text-[10px] font-mono uppercase tracking-widest text-slate-500">
                Previous Page
              </span>
              <span className="block text-sm font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
                {prevPage.label}
              </span>
            </div>
          </button>
        ) : (
          <div className="hidden sm:block" />
        )}

        {nextPage && (
          <button
            id="pagination-next-btn"
            onClick={() => {
              onSelectPage(nextPage.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 px-5 py-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-right text-slate-300 hover:text-white transition-all group shadow-sm"
          >
            <div>
              <span className="block text-[10px] font-mono uppercase tracking-widest text-slate-500 text-left sm:text-right">
                Next Page
              </span>
              <span className="block text-sm font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
                {nextPage.label}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-amber-500 group-hover:translate-x-1 transition-transform shrink-0" />
          </button>
        )}
      </div>

      {/* Quick Jump Bar across all pages */}
      <div className="mt-8 pt-6 border-t border-slate-900 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-500">
        <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-400">
          <Compass className="w-3.5 h-3.5 text-amber-500" />
          Jump to section:
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {PAGES.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                onSelectPage(p.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                currentPage === p.id
                  ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/40'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {p.shortLabel}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
