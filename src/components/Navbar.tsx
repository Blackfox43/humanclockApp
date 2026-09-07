import React, { useState } from 'react';
import { TimeFormat, ClockState, AppPageId, ViewMode } from '../types';
import {
  Clock,
  Printer,
  Share2,
  Compass,
  Layers,
  Table2,
  BookOpen,
  Sparkles,
  Smartphone,
  Code2,
  Menu,
  X,
  SlidersHorizontal,
} from 'lucide-react';

interface NavbarProps {
  timeFormat: TimeFormat;
  onToggleTimeFormat: () => void;
  viewMode: ViewMode;
  onToggleViewMode: () => void;
  onOpenPrintGuide: () => void;
  onOpenCarousel: () => void;
  onOpenShareModal: () => void;
  onSelectPage?: (page: AppPageId) => void;
  currentClockState: ClockState;
}

export const Navbar: React.FC<NavbarProps> = ({
  timeFormat,
  onToggleTimeFormat,
  viewMode,
  onToggleViewMode,
  onOpenPrintGuide,
  onOpenCarousel,
  onOpenShareModal,
  onSelectPage,
  currentClockState,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const currentHumanHour =
    timeFormat === '24h'
      ? currentClockState.humanHour24
      : currentClockState.humanHour12;

  const handleMobileNavSelect = (page: AppPageId) => {
    onSelectPage?.(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Logo and Brand */}
        <button
          onClick={() => {
            onSelectPage?.('dial');
            setIsMobileMenuOpen(false);
          }}
          className="flex items-center gap-2.5 sm:gap-3 text-left hover:opacity-90 transition-opacity cursor-pointer group shrink-0"
          title="Go to Live Clock Dial"
        >
          <div className="w-8 h-8 rounded-full border-2 border-amber-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <div className="w-1 h-3.5 bg-amber-500 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-bold text-white tracking-tight text-sm sm:text-base md:text-lg uppercase">
                Human Clock <span className="text-amber-500 font-mono text-xs font-semibold">v1.0</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[9px] font-mono bg-slate-800 text-slate-300 border border-slate-700 font-bold uppercase tracking-widest">
                Base-9
              </span>
            </div>
            <p className="text-[10px] text-amber-500/70 font-mono uppercase tracking-wider hidden lg:block">
              Parallel Time System • Digital Roots & Vortex Doubling
            </p>
          </div>
        </button>

        {/* Live Parallel Time Pill (Desktop) */}
        <div className="hidden xl:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono">
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

        {/* Action Controls & Mode Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Priority 1: Prominent Minimal / Full Mode Toggle */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
            <button
              id="view-mode-minimal-btn"
              onClick={() => {
                if (viewMode !== 'minimal') onToggleViewMode();
              }}
              className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all font-semibold ${
                viewMode === 'minimal'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Minimal Mode: Daily glance clock with large readout and simplified dial"
            >
              Minimal
            </button>
            <button
              id="view-mode-full-btn"
              onClick={() => {
                if (viewMode !== 'full') onToggleViewMode();
              }}
              className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all font-semibold ${
                viewMode === 'full'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Full Mode: Educational view with geometry controls, scrubber, and 24h table"
            >
              Full
            </button>
          </div>

          {/* Desktop Secondary Actions */}
          <div className="hidden md:flex items-center gap-1.5 sm:gap-2">
            {/* Quick Format Toggle */}
            <button
              onClick={onToggleTimeFormat}
              title="Toggle between 24-hour and 12-hour digital root calculations"
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors"
            >
              {timeFormat === '24h' ? '24h Root' : '12h Root'}
            </button>

            {/* Share Human Time Button */}
            <button
              id="nav-open-share-btn"
              onClick={onOpenShareModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-colors shadow-sm"
              title="Share current Human Time to X, Bluesky, or copy deep link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>

            {/* Social Carousel Button */}
            <button
              id="nav-open-carousel-btn"
              onClick={onOpenCarousel}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Deck</span>
            </button>

            {/* 1-Page Guide / PDF Print Button */}
            <button
              id="nav-open-print-guide-btn"
              onClick={onOpenPrintGuide}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>1-Page Guide</span>
            </button>
          </div>

          {/* Priority 4: Clean Hamburger Button for Mobile */}
          <button
            id="mobile-nav-toggle-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Priority 4: Mobile Slide-down Menu Drawer */}
      {isMobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden w-full bg-slate-950/98 border-b border-slate-800 p-4 space-y-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-2 duration-200"
        >
          {/* Quick Format Switch */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
            <span className="text-slate-400">Calculation Mode:</span>
            <button
              onClick={onToggleTimeFormat}
              className="px-3 py-1 rounded-lg bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30"
            >
              {timeFormat === '24h' ? '24-Hour (00–23)' : '12-Hour (AM/PM)'}
            </button>
          </div>

          {/* Pages (Full Mode) */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 px-1 font-bold">
              Navigate Pages
            </span>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => handleMobileNavSelect('dial')}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 hover:bg-slate-800"
              >
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Live Dial</span>
              </button>
              <button
                onClick={() => handleMobileNavSelect('rules')}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 hover:bg-slate-800"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Rules</span>
              </button>
              <button
                onClick={() => handleMobileNavSelect('table')}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 hover:bg-slate-800"
              >
                <Table2 className="w-4 h-4 text-amber-400" />
                <span>24h Table</span>
              </button>
              <button
                onClick={() => handleMobileNavSelect('digital')}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 hover:bg-slate-800"
              >
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span>Widgets</span>
              </button>
            </div>
          </div>

          {/* Mobile Actions Grid */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-900">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenShareModal();
              }}
              className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-amber-400"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenCarousel();
              }}
              className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Deck</span>
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenPrintGuide();
              }}
              className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs font-mono"
            >
              <Printer className="w-4 h-4" />
              <span>Guide</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
