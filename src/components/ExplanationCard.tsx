import React from 'react';
import { Compass, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const ExplanationCard: React.FC = () => {
  return (
    <section id="system-explanation-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-slate-800">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
            <Compass className="w-6 h-6" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">
                Deliverable 1 • Core Concept
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 font-mono">Neutral & Practical Overview</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              What is the Human Clock?
            </h2>

            {/* The exact one-paragraph neutral, practical explanation */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal bg-slate-950 p-5 rounded-xl border border-slate-800">
              The Human Clock is an intuitive, parallel time-reading framework that simplifies
              standard clock hours into single-digit base-9 digital roots (1 through 9) while keeping
              minutes and seconds completely unchanged. Built on modular arithmetic and the natural
              vortex doubling cycle (1-2-4-8-7-5), it translates complex 12- and 24-hour markers into
              an orderly, repeating sequence governed by a 3-6-9 control axis with 9 anchored at the
              top. Rather than replacing modern timekeeping, the Human Clock works 100% reliably
              alongside any standard clock or watch—providing a clean mental shorthand, harmonic
              pattern recognition, and an approachable way for anyone in the world to experience the
              rhythms of time through simple arithmetic.
            </p>

            {/* Three key foundational principles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 mb-1 uppercase tracking-wider font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Zero Disruption</span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  Minutes and seconds remain untouched. A 3:45 meeting is still at :45, maintaining
                  flawless synchronization with schedules and alarms.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 mb-1 uppercase tracking-wider font-mono">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Base-9 Arithmetic</span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  Compresses all hours into numbers 1 through 9 using simple digital roots: sum the
                  digits until a single number remains.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 mb-1 uppercase tracking-wider font-mono">
                  <ArrowRight className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Parallel Companion</span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  Designed as an educational companion and secondary dial overlay, not an ungrounded
                  replacement for civic civil time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
