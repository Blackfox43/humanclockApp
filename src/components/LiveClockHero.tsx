import React, { useState, useEffect } from 'react';
import { VortexClockDial } from './VortexClockDial';
import { TimeFormat, ClockState } from '../types';
import {
  deriveClockState,
  DOUBLING_CYCLE,
  TRIAD_AXIS,
  getDigitalRootExplanation,
  formatCanonicalExample,
} from '../utils/vortexMath';
import { Play, Pause, RotateCcw, Clock, Eye, Sparkles, Layers, Sliders, Info, Share2 } from 'lucide-react';

interface LiveClockHeroProps {
  timeFormat: TimeFormat;
  onToggleTimeFormat: () => void;
  onOpenShareTime?: (hour: number, minute: number) => void;
  initialHour?: number;
  initialMinute?: number;
  initialIsLive?: boolean;
}

export const LiveClockHero: React.FC<LiveClockHeroProps> = ({
  timeFormat,
  onToggleTimeFormat,
  onOpenShareTime,
  initialHour,
  initialMinute,
  initialIsLive = true,
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(() => {
    if (initialHour !== undefined && initialMinute !== undefined && !initialIsLive) {
      const d = new Date();
      d.setHours(initialHour, initialMinute, 0, 0);
      return d;
    }
    return new Date();
  });
  const [isLive, setIsLive] = useState<boolean>(() => (initialHour !== undefined && !initialIsLive ? false : true));
  const [simulatedHour, setSimulatedHour] = useState<number>(() => initialHour ?? new Date().getHours());
  const [simulatedMinute, setSimulatedMinute] = useState<number>(() => initialMinute ?? new Date().getMinutes());
  const [showOverlayRing, setShowOverlayRing] = useState<boolean>(true);
  const [showDoublingLines, setShowDoublingLines] = useState<boolean>(true);
  const [showControlTriad, setShowControlTriad] = useState<boolean>(true);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);

  // Sync if initialHour or initialMinute changes from outside (e.g. deep link)
  useEffect(() => {
    if (initialHour !== undefined && initialMinute !== undefined) {
      setSimulatedHour(initialHour);
      setSimulatedMinute(initialMinute);
      setIsLive(initialIsLive);
      const d = new Date();
      d.setHours(initialHour, initialMinute, 0, 0);
      setCurrentTime(d);
    }
  }, [initialHour, initialMinute, initialIsLive]);

  // Live ticking
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setSimulatedHour(now.getHours());
      setSimulatedMinute(now.getMinutes());
    }, 1000);
    return () => clearInterval(interval);
  }, [isLive]);

  // Derived effective time
  const effectiveDate = React.useMemo(() => {
    if (isLive) return currentTime;
    const d = new Date();
    d.setHours(simulatedHour, simulatedMinute, 0, 0);
    return d;
  }, [isLive, currentTime, simulatedHour, simulatedMinute]);

  const clockState: ClockState = React.useMemo(() => {
    return deriveClockState(effectiveDate);
  }, [effectiveDate]);

  const activeHumanHour = timeFormat === '24h' ? clockState.humanHour24 : clockState.humanHour12;
  const activeCalcFormula = timeFormat === '24h' ? clockState.rootCalculation24 : clockState.rootCalculation12;
  const isDoubling = timeFormat === '24h' ? clockState.isDoublingNode24 : clockState.isDoublingNode12;
  const isTriad = timeFormat === '24h' ? clockState.isControlTriad24 : clockState.isControlTriad12;

  // Preset testing moments for quick exploration
  const presets = [
    { label: 'Morning (07:15 AM)', h: 7, m: 15 },
    { label: 'Noon (12:00 PM)', h: 12, m: 0 },
    { label: 'Afternoon (02:30 PM / 14:30)', h: 14, m: 30 },
    { label: 'Evening (08:45 PM / 20:45)', h: 20, m: 45 },
    { label: 'Late Night (11:20 PM / 23:20)', h: 23, m: 20 },
    { label: 'Midnight (00:00)', h: 0, m: 0 },
  ];

  const applyPreset = (h: number, m: number) => {
    setIsLive(false);
    setSimulatedHour(h);
    setSimulatedMinute(m);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    setCurrentTime(d);
  };

  const resumeLive = () => {
    const now = new Date();
    setCurrentTime(now);
    setSimulatedHour(now.getHours());
    setSimulatedMinute(now.getMinutes());
    setIsLive(true);
  };

  return (
    <section id="live-clock-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Banner / System Tag */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs font-mono tracking-wider uppercase text-slate-400">
            {isLive ? 'Real-Time Synchronized Dial' : 'Simulated Time Explorer'}
          </span>
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-slate-400 font-bold uppercase tracking-widest border border-slate-700">
            BASE MODULO: 9
          </span>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          <button
            id="toggle-time-format-btn"
            onClick={onToggleTimeFormat}
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border border-slate-800 bg-slate-900 text-slate-200 hover:border-slate-700 transition-colors"
          >
            Mode: {timeFormat === '24h' ? '24-Hour (00–23)' : '12-Hour (AM/PM)'}
          </button>

          {onOpenShareTime && (
            <button
              id="hero-header-share-btn"
              onClick={() =>
                onOpenShareTime(
                  timeFormat === '24h' ? clockState.hour24 : clockState.hour12,
                  clockState.minute
                )
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-colors shadow-sm"
              title="Share current Human Time"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>
          )}

          {isLive ? (
            <button
              id="pause-live-btn"
              onClick={() => setIsLive(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors border border-slate-700"
            >
              <Pause className="w-3.5 h-3.5 text-amber-400" />
              Scrub Time
            </button>
          ) : (
            <button
              id="resume-live-btn"
              onClick={resumeLive}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              Sync Live Time
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Clock Dial Stage */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-900/40 p-6 sm:p-8 rounded-2xl border border-slate-800 backdrop-blur-sm relative overflow-hidden">
          {/* Subtle radial glow in background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Dial View Options Bar */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-4 text-xs">
            <span className="text-amber-500 text-[10px] font-bold uppercase tracking-widest">
              DIAL GEOMETRY CONTROLS
            </span>
            <div className="flex items-center gap-2">
              <button
                id="toggle-overlay-ring-btn"
                onClick={() => setShowOverlayRing(!showOverlayRing)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  showOverlayRing
                    ? 'bg-slate-800 text-slate-200 border border-slate-700'
                    : 'bg-slate-950 text-slate-500 border border-slate-900'
                }`}
              >
                <Eye className="w-3 h-3" />
                12h Overlay
              </button>

              <button
                id="toggle-doubling-path-btn"
                onClick={() => setShowDoublingLines(!showDoublingLines)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  showDoublingLines
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'bg-slate-950 text-slate-500 border border-slate-900'
                }`}
              >
                <Layers className="w-3 h-3" />
                Cycle (1-2-4-8-7-5)
              </button>

              <button
                id="toggle-triad-axis-btn"
                onClick={() => setShowControlTriad(!showControlTriad)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  showControlTriad
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-950 text-slate-500 border border-slate-900'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                Axis (3-6-9)
              </button>
            </div>
          </div>

          {/* The Clock Face */}
          <div className="py-2">
            <VortexClockDial
              humanHour={activeHumanHour}
              minute={clockState.minute}
              second={clockState.second}
              showOverlayRing={showOverlayRing}
              showDoublingLines={showDoublingLines}
              showControlTriad={showControlTriad}
              size={360}
              interactiveNode={selectedNode}
              onSelectNode={(num) => setSelectedNode(num === selectedNode ? null : num)}
            />
          </div>

          {/* Dial Footnote */}
          <div className="mt-4 text-center text-xs text-slate-400 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-amber-500/70 shrink-0" />
            <span className="text-[11px] font-mono">9 is anchored at 12 o'clock (0° zenith). Click any digit node to view harmonic properties.</span>
          </div>
        </div>

        {/* Right Column: Comparative Readouts & Explanation Breakdown */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Main Dual-Time Display Box */}
          <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">
                  PARALLEL TIME READOUT
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded">
                  Current Human Hour: H[{activeHumanHour}]
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">
                Base-9 Digital Root
              </span>
            </div>

            {/* Large Human Time Readout */}
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-amber-400 font-mono">
                H[{activeHumanHour}]
              </span>
              <span className="text-3xl sm:text-4xl font-light text-slate-300 font-mono">
                :{String(clockState.minute).padStart(2, '0')}
              </span>
              <span className="text-xl sm:text-2xl font-light text-slate-500 font-mono">
                :{String(clockState.second).padStart(2, '0')}
              </span>
              <span className="ml-2 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                {timeFormat === '24h' ? '24H ROOT' : clockState.period}
              </span>
            </div>

            {/* Standard Time Comparison Subtitle */}
            <div className="mt-2 flex items-center gap-3 text-sm text-slate-400 font-mono border-t border-slate-800 pt-3">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>
                Standard Time:{' '}
                <strong className="text-slate-200">
                  {timeFormat === '24h'
                    ? `${String(clockState.hour24).padStart(2, '0')}:${String(clockState.minute).padStart(2, '0')}:${String(clockState.second).padStart(2, '0')}`
                    : `${clockState.hour12}:${String(clockState.minute).padStart(2, '0')}:${String(clockState.second).padStart(2, '0')} ${clockState.period}`}
                </strong>
              </span>
            </div>

            {/* Digital Root Step-by-Step Box */}
            <div className="mt-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div className="flex items-center justify-between text-slate-400 mb-1.5 font-mono">
                <span className="text-amber-500 font-bold text-[10px] uppercase tracking-wider">CONVERSION FORMAT:</span>
                <span className="text-slate-500 font-mono text-[10px]">Hour → Root → H[Digit]:Min</span>
              </div>
              <p className="font-mono text-emerald-400 font-bold text-sm sm:text-base">
                {formatCanonicalExample(
                  timeFormat === '24h' ? clockState.hour24 : clockState.hour12,
                  clockState.minute
                )}
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-900 font-mono">
                <span>Canonical Template:</span>
                <strong className="text-amber-300">14:30 → 1+4=5 → H[5]:30</strong>
              </div>
            </div>

            {/* Mathematical Classification Tag */}
            <div className="mt-4 flex items-center gap-2">
              {isDoubling ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Doubling Cycle Node (1 → 2 → 4 → 8 → 7 → 5)</span>
                </div>
              ) : isTriad ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>
                    {activeHumanHour === 9
                      ? 'Polar Apex Node (9 fixed at top)'
                      : 'Control Axis Triad Node (3 ↔ 6)'}
                  </span>
                </div>
              ) : null}
            </div>

            {/* Share Time Action Trigger */}
            {onOpenShareTime && (
              <div className="mt-4 pt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  id="hero-readout-share-btn"
                  onClick={() =>
                    onOpenShareTime(
                      timeFormat === '24h' ? clockState.hour24 : clockState.hour12,
                      clockState.minute
                    )
                  }
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold transition-all shadow-sm group"
                >
                  <Share2 className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>Share H[{activeHumanHour}]:{String(clockState.minute).padStart(2, '0')} to X or Bluesky</span>
                </button>
              </div>
            )}
          </div>

          {/* Interactive Scrubbing Slider Control */}
          <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-mono font-medium text-slate-300">
                <Sliders className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-amber-500 text-[10px] font-bold uppercase tracking-widest">
                  TIME TRAVEL SCRUBBER
                </span>
              </div>
              {!isLive && (
                <button
                  onClick={resumeLive}
                  className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono"
                >
                  <RotateCcw className="w-3 h-3" /> Reset to Live
                </button>
              )}
            </div>

            {/* Hour Slider */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                  <span>Hour (0–23):</span>
                  <span className="text-slate-200 font-semibold">{simulatedHour}:00</span>
                </div>
                <input
                  id="scrub-hour-slider"
                  type="range"
                  min="0"
                  max="23"
                  value={simulatedHour}
                  onChange={(e) => {
                    setIsLive(false);
                    setSimulatedHour(parseInt(e.target.value, 10));
                  }}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
                />
              </div>

              {/* Minute Slider */}
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                  <span>Minute (0–59):</span>
                  <span className="text-slate-200 font-semibold">:{String(simulatedMinute).padStart(2, '0')}</span>
                </div>
                <input
                  id="scrub-minute-slider"
                  type="range"
                  min="0"
                  max="59"
                  value={simulatedMinute}
                  onChange={(e) => {
                    setIsLive(false);
                    setSimulatedMinute(parseInt(e.target.value, 10));
                  }}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
                />
              </div>
            </div>

            {/* Quick Test Presets */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-2 font-bold">
                Instant Scenarios:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {presets.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => applyPreset(p.h, p.m)}
                    className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 hover:border-slate-700 text-[11px] font-mono text-slate-300 transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Node Inspector Callout (when a user clicks a node) */}
          {selectedNode !== null && (
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-amber-400 font-bold text-[11px] uppercase tracking-wider">
                  NODE {selectedNode} PROPERTIES:
                </span>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-slate-500 hover:text-slate-300 p-1"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                {selectedNode === 9
                  ? 'Fixed Polar Apex at 12 o\'clock (0°). Center attractor for all higher harmonics (9×2=18→9).'
                  : (DOUBLING_CYCLE as readonly number[]).includes(selectedNode)
                  ? `Member of the Vortex Doubling Cycle (1 → 2 → 4 → 8 → 7 → 5 → 1). Connected by continuous energy loops.`
                  : `Member of the 3-6-9 Control Axis. Oscillates between 3 and 6 (3×2=6, 6×2=12→3).`}
              </p>
              <div className="mt-2 text-[11px] font-mono text-slate-400">
                Clock Hours that map here:{' '}
                <span className="text-amber-400">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
                    .filter((h) => deriveClockState(new Date(2026, 0, 1, h, 0)).humanHour24 === selectedNode)
                    .map((h) => `${String(h).padStart(2, '0')}:00`)
                    .join(', ')}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
