import React from 'react';
import { Watch, Smartphone, Brain, Check, ArrowRight } from 'lucide-react';

export const PracticalApplications: React.FC = () => {
  return (
    <section id="practical-applications-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">
              Deliverable 5 • Implementation Blueprint
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Three Practical Ways Anyone Can Start Using It Today
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            You don't need new hardware or specialized software. Here are the three most effortless methods to integrate the Human Clock into your daily routine.
          </p>
        </div>

        {/* The 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Method 1: Dual-Face Analog Idea */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-slate-800 text-amber-400 border border-slate-700">
                  <Watch className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 font-semibold uppercase tracking-wider border border-slate-700">
                  METHOD 1: ANALOG
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">
                Dual-Face Transparent Overlay
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Print the 9-node circular template onto a transparent static-cling film or adhesive sticker,
                and position it directly on the crystal glass of your existing wall clock or watch.
              </p>

              {/* Visual Mockup Box */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-2">
                <div className="text-slate-300 font-semibold">Setup instructions:</div>
                <ul className="space-y-1.5 text-slate-400 text-[11px]">
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Align <strong className="text-amber-300">[9]</strong> exactly over standard <strong className="text-slate-200">12 o'clock</strong>.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Confirm <strong className="text-amber-300">[3]</strong> aligns with <strong className="text-slate-200">4 o'clock</strong> and <strong className="text-amber-300">[6]</strong> with <strong className="text-slate-200">8 o'clock</strong>.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Your normal hands now read both systems simultaneously!</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
              Ideal for: Kitchen wall clocks, classroom timers, and wristwatches.
            </div>
          </div>

          {/* Method 2: Digital / Phone Display Format */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-slate-800 text-amber-400 border border-slate-700">
                  <Smartphone className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 font-semibold uppercase tracking-wider border border-slate-700">
                  METHOD 2: DIGITAL
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">
                Digital & Phone Widget Format
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Display the Human hour in square brackets alongside standard minutes on lockscreens,
                smartwatch complications, or status bar widgets.
              </p>

              {/* Smartphone Lockscreen Mini-Mockup */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                  Lockscreen / Widget Preview
                </span>
                <div className="text-2xl font-mono font-extrabold text-white tracking-tight">
                  H[<span className="text-amber-400">5</span>]:42
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Standard: 14:42 (2:42 PM)
                </div>
                <div className="mt-2 inline-block px-2 py-0.5 rounded text-[10px] bg-slate-800 text-amber-400 border border-slate-700 font-mono">
                  Doubling Node 5
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
              Ideal for: iOS Lock Screen widgets, Android KWGT, smartwatch faces.
            </div>
          </div>

          {/* Method 3: Mental / Quick Conversion Method */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-slate-800 text-amber-400 border border-slate-700">
                  <Brain className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 font-semibold uppercase tracking-wider border border-slate-700">
                  METHOD 3: MENTAL
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">
                2-Second Mental Sum Shortcut
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Zero tools required. Simply glance at any clock anywhere in the world and sum the hour digits in your mind in less than two seconds.
              </p>

              {/* Mental Formula Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-2">
                <div className="text-slate-300 font-semibold">The 2-second rule:</div>
                <div className="p-2 rounded bg-slate-900 text-slate-300 border border-slate-850">
                  See <strong className="text-white">16</strong>:25 → Think <strong className="text-amber-400">1 + 6 = 7</strong> → It's <strong className="text-white">Human 7:25</strong>.
                </div>
                <div className="p-2 rounded bg-slate-900 text-slate-300 border border-slate-850">
                  See <strong className="text-white">21</strong>:10 → Think <strong className="text-amber-400">2 + 1 = 3</strong> → It's <strong className="text-white">Human 3:10</strong>.
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
              Ideal for: Instant everyday usage anywhere without needing apps.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
