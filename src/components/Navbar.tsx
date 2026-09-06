import React from 'react';
import { TimeFormat, ClockState } from '../types';
import { Clock, Printer, Share2, Compass, Layers, Table2, BookOpen, Sparkles } from 'lucide-react';

interface NavbarProps {
  timeFormat: TimeFormat;
  onToggleTimeFormat: () => void;
  onOpenPrintGuide: () => void;
  onOpenCarousel: () => void;
  onOpenShareModal: () => void;
  currentClockState: ClockState;
}

export const Navbar: React.FC<NavbarProps> = ({
  timeFormat,
  onToggleTimeFormat,
  onOpenPrintGuide,
  onOpenCarousel,
  onOpenShareModal,
  currentClockState,
}) => {
  const currentHumanHour =
    timeFormat === '24h'
      ? currentClockState.humanHour24
      : currentClockState.humanHour12;

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-amber-500 flex items-center justify-center shrink-0">
            <div className="w-1 h-3.5 bg-amber-500 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-tight text-base sm:text-lg uppercase">
                Human Clock <span className="text-amber-500 font-mono text-xs sm:text-sm font-semibold">v1.0</span>
              </span>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[9px] font-mono bg-slate-800 text-slate-300 border border-slate-700 font-bold uppercase tracking-widest">
                Base-9
              </span>
            </div>
            <p className="text-[10px] text-amber-500/70 font-mono uppercase tracking-wider hidden md:block">
              Parallel Time System • Digital Roots & Vortex Doubling
            </p>
          </div>
        </div>

        {/* Live Parallel Time Pill */}
        <div className="hidden lg:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="text-slate-400">Live:</span>
          <strong className="text-amber-400 font-bold">
            H[{currentHumanHour}]:{String(currentClockState.minute).padStart(2, '0')}:
            {String(currentClockState.second).padStart(2, '0')}
          </strong>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">
            Std:{' '}
            <span className="text-slate-200">
              {timeFormat === '24h'
                ? `${String(currentClockState.hour24).padStart(2, '0')}:${String(currentClockState.minute).padStart(2, '0')}`
                : `${currentClockState.hour12}:${String(currentClockState.minute).padStart(2, '0')} ${currentClockState.period}`}
            </span>
          </span>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Format Toggle */}
          <button
            onClick={onToggleTimeFormat}
            title="Toggle between 24-hour and 12-hour digital root calculations"
            className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors"
          >
            {timeFormat === '24h' ? '24h' : '12h'}
          </button>

          {/* Share Human Time Button */}
          <button
            id="nav-open-share-btn"
            onClick={onOpenShareModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-colors shadow-sm"
            title="Share current Human Time to X, Bluesky, or copy deep link"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Time</span>
          </button>

          {/* Social Carousel Button */}
          <button
            id="nav-open-carousel-btn"
            onClick={onOpenCarousel}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Carousel Deck</span>
          </button>

          {/* 1-Page Guide / PDF Print Button */}
          <button
            id="nav-open-print-guide-btn"
            onClick={onOpenPrintGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">1-Page Guide</span>
            <span className="sm:hidden">Guide</span>
          </button>
        </div>
      </div>
    </header>
  );
};
