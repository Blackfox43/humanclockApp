import React, { useState, useEffect } from 'react';
import { Copy, Check, Smartphone, Watch, MessageSquare, Sparkles, ArrowRight } from 'lucide-react';
import { calculateDigitalRoot24, formatTwoDigits, formatCanonicalExample } from '../utils/vortexMath';

export const SimpleDigitalFormatSection: React.FC = () => {
  const [testTimeInput, setTestTimeInput] = useState<string>('14:37');
  const [nowTime, setNowTime] = useState<Date>(() => new Date());
  const [copiedCompact, setCopiedCompact] = useState<boolean>(false);
  const [copiedFormal, setCopiedFormal] = useState<boolean>(false);
  const [displayStyle, setDisplayStyle] = useState<'compact' | 'formal' | 'bracket'>('compact');

  // Update real-time clock every second
  useEffect(() => {
    const timer = setInterval(() => setNowTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Parse test input
  const parsedTime = React.useMemo(() => {
    const parts = testTimeInput.split(':');
    let h = parseInt(parts[0], 10);
    let m = parseInt(parts[1], 10);
    if (isNaN(h)) h = 14;
    if (isNaN(m)) m = 37;
    h = Math.max(0, Math.min(23, h));
    m = Math.max(0, Math.min(59, m));

    const root = calculateDigitalRoot24(h);
    const compact = `H${root}:${formatTwoDigits(m)}`;
    const formal = `Human ${root}:${formatTwoDigits(m)}`;
    const bracket = `H[${root}]:${formatTwoDigits(m)}`;
    const std24 = `${formatTwoDigits(h)}:${formatTwoDigits(m)}`;
    const std12H = h % 12 === 0 ? 12 : h % 12;
    const std12 = `${std12H}:${formatTwoDigits(m)} ${h >= 12 ? 'PM' : 'AM'}`;

    return { h, m, root, compact, formal, bracket, std24, std12 };
  }, [testTimeInput]);

  // Live real time computed
  const liveH = nowTime.getHours();
  const liveM = nowTime.getMinutes();
  const liveS = nowTime.getSeconds();
  const liveRoot = calculateDigitalRoot24(liveH);
  const liveCompact = `H${liveRoot}:${formatTwoDigits(liveM)}`;
  const liveFormal = `Human ${liveRoot}:${formatTwoDigits(liveM)}`;
  const liveStd24 = `${formatTwoDigits(liveH)}:${formatTwoDigits(liveM)}:${formatTwoDigits(liveS)}`;

  const handleCopy = (text: string, type: 'compact' | 'formal') => {
    navigator.clipboard.writeText(text);
    if (type === 'compact') {
      setCopiedCompact(true);
      setTimeout(() => setCopiedCompact(false), 2000);
    } else {
      setCopiedFormal(true);
      setTimeout(() => setCopiedFormal(false), 2000);
    }
  };

  const presetTimes = [
    { label: '14:37 (Canonical)', val: '14:37' },
    { label: '09:15 (Morning)', val: '09:15' },
    { label: '12:00 (Noon)', val: '12:00' },
    { label: '18:45 (Evening)', val: '18:45' },
    { label: '21:30 (Night)', val: '21:30' },
    { label: '00:00 (Midnight)', val: '00:00' },
  ];

  return (
    <section id="simple-digital-format" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">
                Concrete Deliverable • Digital Specification
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Simple Digital Format
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              The exact, friction-free text format designed for phone lock screens, smartwatch complications, calendar events, and text messages.
            </p>
          </div>

          {/* Quick Format Pill */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono self-start sm:self-auto">
            <button
              onClick={() => setDisplayStyle('compact')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                displayStyle === 'compact'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              H5:37 (Compact)
            </button>
            <button
              onClick={() => setDisplayStyle('formal')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                displayStyle === 'formal'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Human 5:37 (Formal)
            </button>
          </div>
        </div>

        {/* Primary Format Showcase Card: 14:37 -> H5:37 or Human 5:37 */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
            {/* The Canonical Example requested */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Standard Conversion Formula
              </span>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 font-mono">
                <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-lg sm:text-2xl font-bold text-slate-300">
                  {parsedTime.std24}
                </div>
                <ArrowRight className="w-5 h-5 text-amber-500 shrink-0" />
                <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/40 text-xl sm:text-3xl font-extrabold text-amber-400">
                  {parsedTime.compact}
                </div>
                <span className="text-slate-500 text-sm font-sans font-medium">or</span>
                <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xl sm:text-3xl font-extrabold text-white">
                  {parsedTime.formal}
                </div>
              </div>
              <p className="text-xs text-slate-400 font-mono pt-1">
                Standard: {parsedTime.std24} ({parsedTime.std12}) → Formula:{' '}
                <span className="text-emerald-400 font-bold">
                  {formatCanonicalExample(parsedTime.h, parsedTime.m)}
                </span>
              </p>
            </div>

            {/* Quick Copy Buttons */}
            <div className="flex flex-row md:flex-col gap-2 shrink-0 justify-end">
              <button
                id="copy-compact-btn"
                onClick={() => handleCopy(parsedTime.compact, 'compact')}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-200 border border-slate-700 transition-colors"
              >
                {copiedCompact ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-amber-400" />
                    <span>Copy "{parsedTime.compact}"</span>
                  </>
                )}
              </button>
              <button
                id="copy-formal-btn"
                onClick={() => handleCopy(parsedTime.formal, 'formal')}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-mono font-bold text-slate-950 transition-colors"
              >
                {copiedFormal ? (
                  <>
                    <Check className="w-4 h-4 text-slate-950" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-950" />
                    <span>Copy "{parsedTime.formal}"</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Time Tester Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400">Test Any Hour:</span>
              <input
                type="time"
                value={testTimeInput}
                onChange={(e) => setTestTimeInput(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Preset Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-mono text-slate-500 mr-1">Presets:</span>
              {presetTimes.map((p) => (
                <button
                  key={p.val}
                  onClick={() => setTestTimeInput(p.val)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                    testTimeInput === p.val
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Real-World Application Previews: Phone Lock Screen, Watch Complication & Text Message */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Phone Lockscreen Mockup */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-amber-400">
                  <Smartphone className="w-5 h-5" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Phone Lock Screen
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  iOS / Android
                </span>
              </div>

              {/* Mini Smartphone Screen Frame */}
              <div className="mx-auto w-full max-w-[240px] aspect-[9/16] rounded-3xl bg-slate-950 border-2 border-slate-800 p-4 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                {/* Speaker Notch */}
                <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto" />

                {/* Lock Screen Clock Display */}
                <div className="text-center my-auto space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                    Sunday, Sep 6
                  </span>
                  <div className="text-4xl sm:text-5xl font-mono font-black text-white tracking-tight">
                    {displayStyle === 'compact' ? parsedTime.compact : parsedTime.formal}
                  </div>
                  <div className="text-[11px] font-mono text-amber-400/90 font-medium">
                    {parsedTime.std24} Standard ({parsedTime.std12})
                  </div>
                  <div className="pt-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-mono bg-slate-900 text-slate-400 border border-slate-800">
                      Node {parsedTime.root} Active
                    </span>
                  </div>
                </div>

                {/* Bottom Quick Action Icons */}
                <div className="flex justify-between items-center px-4 text-slate-600 text-[10px] font-mono">
                  <span>Flashlight</span>
                  <span>Camera</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 font-mono mt-4 text-center">
              Replaces standard hour with root digit while leaving minutes untouched.
            </p>
          </div>

          {/* Card 2: Smartwatch Complication */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-amber-400">
                  <Watch className="w-5 h-5" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Smartwatch Complication
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  Apple Watch / WearOS
                </span>
              </div>

              {/* Watch Face Frame */}
              <div className="mx-auto w-48 h-48 rounded-full bg-slate-950 border-4 border-slate-800 p-3 flex flex-col items-center justify-center text-center shadow-2xl relative">
                {/* Complication Header */}
                <span className="text-[9px] font-mono uppercase tracking-widest text-amber-500 font-bold">
                  HUMAN
                </span>
                {/* Complication Main Value */}
                <div className="text-3xl font-mono font-black text-white my-1">
                  {parsedTime.compact}
                </div>
                {/* Subtitle standard equivalent */}
                <span className="text-[10px] font-mono text-slate-400">
                  {parsedTime.std24}
                </span>
                {/* Small indicator arc */}
                <div className="w-16 h-1 rounded-full bg-amber-500 mt-2" />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 font-mono mt-4 text-center">
              Modular Watchface complication text widget with 0 setup required.
            </p>
          </div>

          {/* Card 3: Casual Messaging & Spoken Use */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-amber-400">
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Everyday Chats & Invites
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  Spoken & Text
                </span>
              </div>

              {/* Chat Bubbles Simulator */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-sans text-xs">
                {/* Incoming bubble */}
                <div className="bg-slate-800/80 text-slate-200 p-3 rounded-2xl rounded-tl-none max-w-[85%] space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 block font-bold">Emma</span>
                  <p>When does our strategy call kick off this afternoon?</p>
                </div>

                {/* Outgoing bubble */}
                <div className="bg-amber-500 text-slate-950 font-medium p-3 rounded-2xl rounded-tr-none ml-auto max-w-[85%] space-y-1 shadow-md">
                  <span className="text-[10px] font-mono text-slate-900 block font-bold">You</span>
                  <p>
                    Let's meet at <strong>{parsedTime.formal}</strong> ({parsedTime.std24} / {parsedTime.std12}).
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
              <div>• <strong>Compact:</strong> "{parsedTime.compact}" (status bars, clocks)</div>
              <div>• <strong>Formal:</strong> "{parsedTime.formal}" (emails, speech)</div>
            </div>
          </div>
        </div>

        {/* Live System Time Bar */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Current Real-Time Synchronization:</span>
            <span className="text-white font-bold">{liveStd24}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400">Human Clock:</span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              {liveCompact}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 font-semibold">{liveFormal}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
