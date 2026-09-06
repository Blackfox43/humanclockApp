import React, { useState, useEffect } from 'react';
import { TimeFormat, ClockState } from './types';
import { deriveClockState, formatTwoDigits, calculateDigitalRoot24, formatCanonicalExample } from './utils/vortexMath';
import { Navbar } from './components/Navbar';
import { LiveClockHero } from './components/LiveClockHero';
import { ExplanationCard } from './components/ExplanationCard';
import { ConversionRules } from './components/ConversionRules';
import { SimpleDigitalFormatSection } from './components/SimpleDigitalFormatSection';
import { VortexDiagramSection } from './components/VortexDiagramSection';
import { ConversionTable } from './components/ConversionTable';
import { PracticalApplications } from './components/PracticalApplications';
import { FormulasAndCode } from './components/FormulasAndCode';
import { PrintableGuideModal } from './components/PrintableGuideModal';
import { SocialCarouselModal } from './components/SocialCarouselModal';
import { ShareTimeModal } from './components/ShareTimeModal';
import { Compass, Sparkles, Printer, Share2, Layers, BookOpen, Clock, Check, X, RotateCcw } from 'lucide-react';

export default function App() {
  const [timeFormat, setTimeFormat] = useState<TimeFormat>('24h');
  const [isPrintGuideOpen, setIsPrintGuideOpen] = useState<boolean>(false);
  const [isCarouselOpen, setIsCarouselOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [shareModalTime, setShareModalTime] = useState<{ hour: number; minute: number } | null>(null);
  
  // Deep-link state
  const [deepLinkData, setDeepLinkData] = useState<{
    hour: number;
    minute: number;
  } | null>(null);

  const [clockState, setClockState] = useState<ClockState>(() => deriveClockState(new Date()));

  // Check URL parameters for deep-linking (e.g. ?time=14:30 or ?h=14&m=30)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const timeParam = searchParams.get('time');
      const hParam = searchParams.get('h');
      const mParam = searchParams.get('m');
      const fParam = searchParams.get('f');

      let targetHour: number | null = null;
      let targetMinute: number | null = null;

      if (timeParam && timeParam.includes(':')) {
        const [hStr, mStr] = timeParam.split(':');
        const h = parseInt(hStr, 10);
        const m = parseInt(mStr, 10);
        if (!isNaN(h) && !isNaN(m) && h >= 0 && h <= 23 && m >= 0 && m <= 59) {
          targetHour = h;
          targetMinute = m;
        }
      } else if (hParam !== null && mParam !== null) {
        const h = parseInt(hParam, 10);
        const m = parseInt(mParam, 10);
        if (!isNaN(h) && !isNaN(m) && h >= 0 && h <= 23 && m >= 0 && m <= 59) {
          targetHour = h;
          targetMinute = m;
        }
      }

      if (fParam === '12h' || fParam === '24h') {
        setTimeFormat(fParam);
      }

      if (targetHour !== null && targetMinute !== null) {
        setDeepLinkData({ hour: targetHour, minute: targetMinute });
      }
    } catch {
      // Ignore URL parsing errors
    }
  }, []);

  // Global live clock heartbeat for header synchronization
  useEffect(() => {
    const interval = setInterval(() => {
      setClockState(deriveClockState(new Date()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleTimeFormat = () => {
    setTimeFormat((prev) => (prev === '24h' ? '12h' : '24h'));
  };

  const handleOpenShare = (h?: number, m?: number) => {
    if (h !== undefined && m !== undefined) {
      setShareModalTime({ hour: h, minute: m });
    } else if (deepLinkData) {
      setShareModalTime({ hour: deepLinkData.hour, minute: deepLinkData.minute });
    } else {
      setShareModalTime({
        hour: clockState.hour24,
        minute: clockState.minute,
      });
    }
    setIsShareModalOpen(true);
  };

  const handleClearDeepLink = () => {
    setDeepLinkData(null);
    if (typeof window !== 'undefined' && window.history) {
      const url = new URL(window.location.href);
      url.searchParams.delete('time');
      url.searchParams.delete('h');
      url.searchParams.delete('m');
      url.searchParams.delete('f');
      window.history.replaceState({}, '', url.pathname);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-300 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navigation */}
      <Navbar
        timeFormat={timeFormat}
        onToggleTimeFormat={toggleTimeFormat}
        onOpenPrintGuide={() => setIsPrintGuideOpen(true)}
        onOpenCarousel={() => setIsCarouselOpen(true)}
        onOpenShareModal={() => handleOpenShare()}
        currentClockState={clockState}
      />

      {/* Deep Link Notification Banner (if user opened a shared link) */}
      {deepLinkData && (
        <div
          id="shared-time-toast"
          className="w-full bg-amber-500/10 border-b border-amber-500/30 px-4 py-2.5 text-xs font-mono text-amber-300 flex flex-wrap items-center justify-between gap-3 sticky top-16 z-30 backdrop-blur-md"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>Viewing Shared Deep-Link Time:</span>
            <strong className="text-white px-2 py-0.5 rounded bg-slate-950 border border-amber-500/40">
              {formatCanonicalExample(deepLinkData.hour, deepLinkData.minute)}
            </strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenShare(deepLinkData.hour, deepLinkData.minute)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors"
            >
              <Share2 className="w-3 h-3" />
              <span>Share Back</span>
            </button>
            <button
              onClick={handleClearDeepLink}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-3 h-3 text-amber-400" />
              <span>Switch to Live Time</span>
            </button>
            <button
              onClick={handleClearDeepLink}
              className="p-1 rounded-md text-slate-400 hover:text-white"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Sections */}
      <main className="flex-1 flex flex-col">
        {/* Deliverable: Main Top-Level Definition Banner */}
        <section id="top-definition-banner" className="w-full bg-slate-900/90 border-b border-slate-800 backdrop-blur-sm sticky top-14 z-20 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-center md:text-left">
                <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0 hidden sm:flex">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                    Universal Definition
                  </div>
                  <h1 className="text-base sm:text-lg md:text-xl font-extrabold text-white tracking-tight leading-snug">
                    “The Human Clock reduces any hour to a single digit (1–9). Minutes and seconds stay exactly the same.”
                  </h1>
                </div>
              </div>

              {/* Quick Visual 3-Step Pill & Example */}
              <div className="shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs shadow-inner">
                <span className="text-slate-500 text-[11px]">Format:</span>
                <span className="text-amber-400 font-bold tracking-tight">14:30 → 1+4=5 → H[5]:30</span>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Live Clock & Simulation Hero */}
        <LiveClockHero
          timeFormat={timeFormat}
          onToggleTimeFormat={toggleTimeFormat}
          onOpenShareTime={(h, m) => handleOpenShare(h, m)}
          initialHour={deepLinkData?.hour}
          initialMinute={deepLinkData?.minute}
          initialIsLive={deepLinkData === null}
        />

        {/* Deliverable 1: One-Paragraph Neutral Explanation */}
        <ExplanationCard />

        {/* Deliverables 2 & 6: Exact Conversion Rules & Beginner Instructions */}
        <ConversionRules />

        {/* Concrete Deliverable: Simple Digital Format (Phone Lock Screen & Complications) */}
        <SimpleDigitalFormatSection />

        {/* Deliverable 3: Clean Visual Clock Face & Geometry Diagram */}
        <VortexDiagramSection />

        {/* Deliverable 4: Full 24-Hour Conversion Reference Table */}
        <ConversionTable />

        {/* Deliverable 5: Three Practical Ways to Start Today */}
        <PracticalApplications />

        {/* Deliverable 7: Copy-Paste Formulas and Mini Code Snippets */}
        <FormulasAndCode />

        {/* Ready-to-Publish Callout Banner */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mb-8">
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">
                READY-TO-PUBLISH ASSETS & SHARING
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Share Current Time or Export Field Assets
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                Post your current Human Time directly to X and Bluesky with deep links, print the single-page PDF cheatsheet, or browse the 6-slide carousel deck.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                id="footer-open-share-btn"
                onClick={() => handleOpenShare()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-xs font-semibold font-mono text-amber-400 border border-amber-500/30 transition-colors shadow-sm"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Human Time</span>
              </button>
              <button
                id="footer-open-carousel-btn"
                onClick={() => setIsCarouselOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold font-mono text-slate-200 border border-slate-700 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Social Carousel</span>
              </button>
              <button
                id="footer-open-print-btn"
                onClick={() => setIsPrintGuideOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-semibold font-mono text-slate-950 shadow-md transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>1-Page Guide</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="h-12 border-t border-slate-800 bg-black/40 flex items-center text-[10px] font-mono text-slate-500">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="uppercase tracking-widest text-[9px] sm:text-[10px]">The Human Clock • Base-9 Modulo & Doubling Cycle (1-2-4-8-7-5)</span>
          </div>
          <div className="flex items-center gap-4 text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-500">
            <span>Minutes Unchanged</span>
            <span>•</span>
            <span>Control Triad: 3-6-9</span>
            <span>•</span>
            <span className="text-amber-500/70 font-bold">Parallel Utility</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ShareTimeModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        initialHour={shareModalTime?.hour}
        initialMinute={shareModalTime?.minute}
        timeFormat={timeFormat}
      />

      <PrintableGuideModal
        isOpen={isPrintGuideOpen}
        onClose={() => setIsPrintGuideOpen(false)}
      />

      <SocialCarouselModal
        isOpen={isCarouselOpen}
        onClose={() => setIsCarouselOpen(false)}
      />
    </div>
  );
}
