import React, { useState } from 'react';
import { Calculator, Sun, Sunset, Moon, Sunrise, Check, HelpCircle } from 'lucide-react';
import { getDigitalRootExplanation, formatCanonicalExample } from '../utils/vortexMath';

export const ConversionRules: React.FC = () => {
  const [inputHour, setInputHour] = useState<string>('14');
  const [inputMinute, setInputMinute] = useState<string>('30');
  const [selectedFormat, setSelectedFormat] = useState<'24h' | '12h'>('24h');

  const parsedH = parseInt(inputHour, 10);
  const validH = isNaN(parsedH) ? 0 : Math.max(0, Math.min(selectedFormat === '24h' ? 23 : 12, parsedH));
  const parsedM = parseInt(inputMinute, 10);
  const validM = isNaN(parsedM) ? 0 : Math.max(0, Math.min(59, parsedM));

  const calculation = getDigitalRootExplanation(validH);

  return (
    <section id="conversion-rules-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-8">
        {/* Section Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">
              Deliverables 2 & 6 • Mathematical Rules & Beginner Guide
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Exact Conversion Rules & How to Read
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Converting normal time to Human Clock time requires only one simple mental addition. Minutes and seconds never change.
          </p>
        </div>

        {/* 3-Step Beginner Guide (Deliverable 6 - Short & Visual) */}
        <div className="bg-slate-900/70 rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  How to Read Human Time: 3-Step Method
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Simple arithmetic that works alongside any clock
                </p>
              </div>
            </div>

            {/* Canonical Example Callout Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950 border border-amber-500/40 text-xs font-mono self-start sm:self-auto shadow-inner">
              <span className="text-slate-400 text-[11px]">Format:</span>
              <strong className="text-amber-400 font-bold text-xs sm:text-sm">
                14:30 → 1+4=5 → H[5]:30
              </strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Step 1 */}
            <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800/90 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs flex items-center justify-center font-bold font-mono">
                    1
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                    Zero Change
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mb-2">
                  Keep the minutes
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Minutes and seconds remain 100% untouched. If your clock says :30, your Human Time ends in :30.
                </p>
              </div>
              <div className="mt-5 p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <span className="text-[11px] font-mono text-slate-400 block mb-1">Visual:</span>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  :30 &nbsp;→&nbsp; stays :30
                </span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800/90 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs flex items-center justify-center font-bold font-mono">
                    2
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
                    Single Digit
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mb-2">
                  Reduce the hour to one digit
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Add the hour digits together until a single number (1–9) remains. Single digits stay themselves.
                </p>
              </div>
              <div className="mt-5 p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <span className="text-[11px] font-mono text-slate-400 block mb-1">Visual:</span>
                <span className="text-sm font-mono font-bold text-amber-400">
                  14 &nbsp;→&nbsp; 1+4 = 5
                </span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800/90 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 text-xs flex items-center justify-center font-bold font-mono shadow-sm">
                    3
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
                    Final Time
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mb-2">
                  Read as H[Digit]:Minutes
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Combine the Human digit with the original minutes. Spoken aloud as “Human 5:30”.
                </p>
              </div>
              <div className="mt-5 p-3 rounded-lg bg-slate-900 border border-amber-500/30 text-center">
                <span className="text-[11px] font-mono text-slate-400 block mb-1">Visual:</span>
                <span className="text-sm font-mono font-bold text-white">
                  Result: &nbsp;<strong className="text-amber-400">H[5]:30</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Deliverable 2: Exact Conversion Rules for 12h and 24h */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 12-Hour AM/PM Rules */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider font-mono">
                12-Hour AM/PM Conversion (1–12)
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700 uppercase font-bold">
                Standard Watch Dial
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Since 1 through 9 are already single digits, they require zero mental math. Only 10, 11, and 12 sum their two digits.
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Hours 1 through 9:</span>
                <span className="text-emerald-400 font-semibold">Unchanged (1 → 1 ... 9 → 9)</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Hour 10:</span>
                <span className="text-slate-200">1 + 0 = <strong className="text-amber-400">Human 1</strong></span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Hour 11:</span>
                <span className="text-slate-200">1 + 1 = <strong className="text-amber-400">Human 2</strong></span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Hour 12:</span>
                <span className="text-slate-200">1 + 2 = <strong className="text-amber-400">Human 3</strong></span>
              </div>
            </div>
          </div>

          {/* 24-Hour Military Rules */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider font-mono">
                24-Hour System Conversion (00–23)
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700 uppercase font-bold">
                Digital & 24H
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Direct digital root across the full day. The 24 hours cycle harmonically through the base-9 sequence.
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400">00:00 (Midnight):</span>
                <span className="text-amber-400 font-semibold">0 ≡ 9 (mod 9) [or 24:00 → 2+4 = 6]</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400">01:00 to 09:00:</span>
                <span className="text-emerald-400 font-semibold">Direct 1 through 9</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400">10:00 to 18:00:</span>
                <span className="text-slate-200">10→1, 11→2, 12→3 ... 18→9</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400">19:00 to 23:00:</span>
                <span className="text-slate-200">19→10→1, 20→2, 21→3, 22→4, 23→5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-World Concrete Examples (Morning, Afternoon, Evening, Night) */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2 uppercase tracking-wider font-mono">
            <span>Everyday Concrete Examples</span>
            <span className="text-xs font-normal text-slate-500 normal-case">(Deliverable 2 Requirements)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Morning Example */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-semibold mb-2">
                  <Sunrise className="w-4 h-4" />
                  <span>MORNING EXAMPLE</span>
                </div>
                <div className="text-lg font-mono font-bold text-white mb-1">07:15 AM</div>
                <div className="text-xs font-mono text-slate-400">
                  Hour 7 is single digit: 7
                </div>
              </div>
              <div className="mt-3 p-2.5 rounded-lg bg-slate-950 border border-amber-500/30">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-0.5">Format:</span>
                <strong className="text-xs sm:text-sm font-mono font-bold text-amber-400 block break-all">
                  07:15 → 7 → H[7]:15
                </strong>
              </div>
            </div>

            {/* Afternoon Example */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-semibold mb-2">
                  <Sun className="w-4 h-4" />
                  <span>AFTERNOON EXAMPLE</span>
                </div>
                <div className="text-lg font-mono font-bold text-white mb-1">02:30 PM (14:30)</div>
                <div className="text-xs font-mono text-slate-400">
                  Hour 14: sum digits 1 + 4 = 5
                </div>
              </div>
              <div className="mt-3 p-2.5 rounded-lg bg-slate-950 border border-amber-500/30">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-0.5">Format:</span>
                <strong className="text-xs sm:text-sm font-mono font-bold text-amber-400 block break-all">
                  14:30 → 1+4=5 → H[5]:30
                </strong>
              </div>
            </div>

            {/* Evening Example */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-semibold mb-2">
                  <Sunset className="w-4 h-4" />
                  <span>EVENING EXAMPLE</span>
                </div>
                <div className="text-lg font-mono font-bold text-white mb-1">08:45 PM (20:45)</div>
                <div className="text-xs font-mono text-slate-400">
                  Hour 20: sum digits 2 + 0 = 2
                </div>
              </div>
              <div className="mt-3 p-2.5 rounded-lg bg-slate-950 border border-amber-500/30">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-0.5">Format:</span>
                <strong className="text-xs sm:text-sm font-mono font-bold text-amber-400 block break-all">
                  20:45 → 2+0=2 → H[2]:45
                </strong>
              </div>
            </div>

            {/* Night Example */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-semibold mb-2">
                  <Moon className="w-4 h-4" />
                  <span>LATE NIGHT EXAMPLE</span>
                </div>
                <div className="text-lg font-mono font-bold text-white mb-1">11:20 PM (23:20)</div>
                <div className="text-xs font-mono text-slate-400">
                  Hour 23: sum digits 2 + 3 = 5
                </div>
              </div>
              <div className="mt-3 p-2.5 rounded-lg bg-slate-950 border border-amber-500/30">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-0.5">Format:</span>
                <strong className="text-xs sm:text-sm font-mono font-bold text-amber-400 block break-all">
                  23:20 → 2+3=5 → H[5]:20
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Try-It-Now Converter Widget */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                Live Quick-Test Converter
              </h3>
            </div>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setSelectedFormat('24h')}
                className={`px-3 py-1 rounded transition-colors ${
                  selectedFormat === '24h'
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                24-Hour Input
              </button>
              <button
                onClick={() => setSelectedFormat('12h')}
                className={`px-3 py-1 rounded transition-colors ${
                  selectedFormat === '12h'
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                12-Hour Input
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-5 flex items-center gap-3">
              <div className="flex-1">
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Hour ({selectedFormat === '24h' ? '0–23' : '1–12'}):
                </label>
                <input
                  type="number"
                  min="0"
                  max={selectedFormat === '24h' ? 23 : 12}
                  value={inputHour}
                  onChange={(e) => setInputHour(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-base focus:outline-none focus:border-amber-500"
                />
              </div>
              <span className="text-2xl text-slate-600 font-mono mt-5">:</span>
              <div className="flex-1">
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Minute (0–59):
                </label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={inputMinute}
                  onChange={(e) => setInputMinute(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-base focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="md:col-span-7 p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono text-amber-500 font-bold block uppercase tracking-wider">
                  CONVERSION FORMAT:
                </span>
                <span className="text-sm font-mono text-emerald-400 font-bold">
                  {formatCanonicalExample(validH, validM)}
                </span>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider font-bold">HUMAN TIME:</span>
                <span className="text-2xl font-mono font-extrabold text-amber-400">
                  H[{calculation.root}]:{String(validM).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
