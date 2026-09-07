import React, { useState } from 'react';
import { TimeFormat, ClockState } from '../types';
import { getCircleCoordinates, formatTwoDigits, formatCanonicalExample } from '../utils/vortexMath';
import { Copy, Check, Share2, Clock, Calendar, ArrowRight } from 'lucide-react';

interface MinimalModeViewProps {
  clockState: ClockState;
  timeFormat: TimeFormat;
  onToggleTimeFormat: () => void;
  onOpenShareTime: (h: number, m: number) => void;
  onSwitchToFullMode: () => void;
}

export const MinimalModeView: React.FC<MinimalModeViewProps> = ({
  clockState,
  timeFormat,
  onToggleTimeFormat,
  onOpenShareTime,
  onSwitchToFullMode,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [showDate, setShowDate] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('human-clock-minimal-show-date');
      if (saved !== null) return saved === 'true';
    }
    return true; // Default enabled for immediate convenience
  });

  const toggleShowDate = () => {
    setShowDate((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('human-clock-minimal-show-date', String(next));
      }
      return next;
    });
  };

  const activeHumanHour =
    timeFormat === '24h' ? clockState.humanHour24 : clockState.humanHour12;
  const currentHour =
    timeFormat === '24h' ? clockState.hour24 : clockState.hour12;
  const formattedMinutes = formatTwoDigits(clockState.minute);
  const formattedSeconds = formatTwoDigits(clockState.second);

  const humanTimeString = `H[${activeHumanHour}]:${formattedMinutes}`;
  const humanTimeFull = `H[${activeHumanHour}]:${formattedMinutes}:${formattedSeconds}`;

  const standardTime24 = `${formatTwoDigits(clockState.hour24)}:${formattedMinutes}:${formattedSeconds}`;
  const standardTime12 = `${clockState.hour12}:${formattedMinutes}:${formattedSeconds} ${clockState.period}`;

  // Formatted Gregorian Date
  const gregorianDate = clockState.date.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(humanTimeString);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Dial geometry math (clean 260px minimalist dial)
  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.38;

  // Nodes 1 through 9
  const nodes = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
    const coords = getCircleCoordinates(num, cx, cy, radius);
    const isActive = num === activeHumanHour;
    return { num, ...coords, isActive };
  });

  // Hour hand angle (points to 1-9)
  const baseHourAngle = activeHumanHour === 9 ? 0 : activeHumanHour * 40;
  const hourAngleDeg = baseHourAngle + (clockState.minute / 60) * 40;
  const hourRad = ((hourAngleDeg - 90) * Math.PI) / 180;
  const hourHandLen = radius * 0.6;

  // Minute hand angle (standard 0-60 min)
  const minuteAngleDeg = (clockState.minute + clockState.second / 60) * 6;
  const minuteRad = ((minuteAngleDeg - 90) * Math.PI) / 180;
  const minuteHandLen = radius * 0.85;

  return (
    <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col items-center animate-in fade-in duration-300">
      {/* Top Status & Settings Controls Banner */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
          </span>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
            Minimal Daily Mode
          </span>
        </div>

        {/* Settings Toggles */}
        <div className="flex items-center gap-2">
          {/* Gregorian Date Toggle */}
          <button
            id="minimal-date-toggle-btn"
            onClick={toggleShowDate}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all border ${
              showDate
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800'
            }`}
            title="Toggle Gregorian date display on/off"
          >
            <Calendar className={`w-3.5 h-3.5 ${showDate ? 'text-amber-400' : 'text-slate-500'}`} />
            <span>Date {showDate ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={onToggleTimeFormat}
            className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            title="Toggle 24h vs 12h calculations"
          >
            {timeFormat === '24h' ? '24h Root' : '12h Root'}
          </button>
          <button
            onClick={onSwitchToFullMode}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <span>Full Mode</span>
            <ArrowRight className="w-3 h-3 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Main Minimalist Card */}
      <div className="w-full bg-slate-900/60 rounded-3xl border border-slate-800 p-6 sm:p-10 shadow-2xl backdrop-blur-md flex flex-col items-center text-center relative overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Impossible-to-miss Active Human Hour Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-widest mb-4 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          Current Human Hour: <strong className="text-white text-sm">{activeHumanHour}</strong>
        </div>

        {/* Clean Gregorian Date Display (When enabled) */}
        {showDate && (
          <div
            id="minimal-date-display"
            className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-950/70 border border-slate-800/80 text-slate-400 font-mono text-xs mb-3 shadow-inner animate-in fade-in duration-200"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400/80" />
            <span>{gregorianDate}</span>
          </div>
        )}

        {/* Giant Main Human Time */}
        <div className="flex flex-wrap items-baseline justify-center gap-1 sm:gap-2 my-2 select-all">
          <span className="text-6xl sm:text-7xl md:text-8xl font-black font-mono tracking-tight text-amber-400 drop-shadow-sm">
            H[{activeHumanHour}]
          </span>
          <span className="text-5xl sm:text-6xl md:text-7xl font-light font-mono text-slate-200">
            :{formattedMinutes}
          </span>
          <span className="text-2xl sm:text-3xl font-light font-mono text-slate-500">
            :{formattedSeconds}
          </span>
        </div>

        {/* Standard Time Reference (Smaller underneath) */}
        <div className="mt-3 flex items-center gap-2 text-sm sm:text-base font-mono text-slate-400">
          <Clock className="w-4 h-4 text-slate-500 shrink-0" />
          <span>Standard:</span>
          <strong className="text-slate-200">
            {timeFormat === '24h' ? standardTime24 : standardTime12}
          </strong>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-500 text-xs hidden sm:inline">
            {timeFormat === '24h' ? `(${standardTime12})` : `(${standardTime24})`}
          </span>
        </div>

        {/* Clean Simplified Dial (9 at top, current highlighted) */}
        <div className="my-6 relative flex items-center justify-center">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="overflow-visible select-none drop-shadow-lg"
          >
            {/* Background Dial Ring */}
            <circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke="#1e293b"
              strokeWidth="2"
            />

            {/* Clean Hour Hand pointing to active 1-9 node */}
            <line
              x1={cx}
              y1={cy}
              x2={cx + Math.cos(hourRad) * hourHandLen}
              y2={cy + Math.sin(hourRad) * hourHandLen}
              stroke="#f8fafc"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Clean Minute Hand */}
            <line
              x1={cx}
              y1={cy}
              x2={cx + Math.cos(minuteRad) * minuteHandLen}
              y2={cy + Math.sin(minuteRad) * minuteHandLen}
              stroke="#94a3b8"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Center Cap */}
            <circle cx={cx} cy={cy} r="4.5" fill="#f59e0b" />
            <circle cx={cx} cy={cy} r="2" fill="#020617" />

            {/* 9 Nodes */}
            {nodes.map((node) => {
              const isTopPolar = node.num === 9;
              const nodeRadius = node.isActive ? 18 : isTopPolar ? 13 : 11;
              return (
                <g key={`mini-node-${node.num}`}>
                  {node.isActive && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={nodeRadius + 6}
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="2"
                      opacity="0.6"
                      className="animate-pulse"
                    />
                  )}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={nodeRadius}
                    fill={node.isActive ? '#fbbf24' : isTopPolar ? '#1e293b' : '#0f172a'}
                    stroke={node.isActive ? '#ffffff' : isTopPolar ? '#f59e0b' : '#334155'}
                    strokeWidth={node.isActive ? 2.5 : 1.5}
                  />
                  <text
                    x={node.x}
                    y={node.y + (node.isActive ? 4.5 : 3.5)}
                    textAnchor="middle"
                    fontSize={node.isActive ? '13' : '10'}
                    fontWeight={node.isActive ? '900' : '700'}
                    fill={node.isActive ? '#020617' : isTopPolar ? '#fbbf24' : '#cbd5e1'}
                    className="font-mono select-none"
                  >
                    {node.num}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* One-Line Universal Rule & Calculation */}
        <div className="w-full max-w-md bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs font-mono mb-6">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-amber-400 font-bold uppercase text-[10px]">Universal Conversion Rule</span>
            <span className="text-slate-500 text-[10px]">Normal → Root → H[Digit]:MM</span>
          </div>
          <div className="text-emerald-400 font-bold text-sm sm:text-base py-0.5">
            {formatCanonicalExample(currentHour, clockState.minute)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 pt-1.5 border-t border-slate-900">
            Hours reduce to a single digit (1–9). Minutes and seconds stay exactly the same.
          </p>
        </div>

        {/* Priority 5: Big One-Tap "Copy Human Time" & Share Action Bar */}
        <div className="w-full max-w-md flex flex-col sm:flex-row items-center gap-3">
          <button
            id="minimal-copy-btn"
            onClick={handleCopy}
            className={`w-full flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-mono text-sm font-bold shadow-lg transition-all ${
              copied
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 hover:shadow-amber-500/25 active:scale-[0.99]'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Copied {humanTimeString}!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 stroke-[2.5]" />
                <span>Copy {humanTimeString}</span>
              </>
            )}
          </button>

          <button
            id="minimal-share-btn"
            onClick={() => onOpenShareTime(currentHour, clockState.minute)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-sm font-semibold transition-colors"
          >
            <Share2 className="w-4 h-4 text-amber-400" />
            <span>Share</span>
          </button>
        </div>

        {/* Switch back to Full Mode Link */}
        <button
          onClick={onSwitchToFullMode}
          className="mt-6 text-xs font-mono text-slate-500 hover:text-amber-400 flex items-center gap-1.5 transition-colors group"
        >
          <span>Need geometry controls, 24h table, or code snippets?</span>
          <span className="text-amber-400 font-bold group-hover:underline">Switch to Full Mode →</span>
        </button>
      </div>
    </section>
  );
};
