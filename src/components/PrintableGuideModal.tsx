import React, { useRef } from 'react';
import { Printer, X, Download } from 'lucide-react';
import { getCircleCoordinates } from '../utils/vortexMath';

interface PrintableGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrintableGuideModal: React.FC<PrintableGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const printContentRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  // Full 24-hour reference data
  const full24Hours = [
    { h24: '00:00', h12: '12:00 AM', root: 9, type: 'Polar 9' },
    { h24: '01:00', h12: '01:00 AM', root: 1, type: 'Doubling' },
    { h24: '02:00', h12: '02:00 AM', root: 2, type: 'Doubling' },
    { h24: '03:00', h12: '03:00 AM', root: 3, type: 'Triad 3-6' },
    { h24: '04:00', h12: '04:00 AM', root: 4, type: 'Doubling' },
    { h24: '05:00', h12: '05:00 AM', root: 5, type: 'Doubling' },
    { h24: '06:00', h12: '06:00 AM', root: 6, type: 'Triad 3-6' },
    { h24: '07:00', h12: '07:00 AM', root: 7, type: 'Doubling' },
    { h24: '08:00', h12: '08:00 AM', root: 8, type: 'Doubling' },
    { h24: '09:00', h12: '09:00 AM', root: 9, type: 'Polar 9' },
    { h24: '10:00', h12: '10:00 AM', root: 1, type: 'Doubling' },
    { h24: '11:00', h12: '11:00 AM', root: 2, type: 'Doubling' },
    { h24: '12:00', h12: '12:00 PM', root: 3, type: 'Triad 3-6' },
    { h24: '13:00', h12: '01:00 PM', root: 4, type: 'Doubling' },
    { h24: '14:00', h12: '02:00 PM', root: 5, type: 'Doubling' },
    { h24: '15:00', h12: '03:00 PM', root: 6, type: 'Triad 3-6' },
    { h24: '16:00', h12: '04:00 PM', root: 7, type: 'Doubling' },
    { h24: '17:00', h12: '05:00 PM', root: 8, type: 'Doubling' },
    { h24: '18:00', h12: '06:00 PM', root: 9, type: 'Polar 9' },
    { h24: '19:00', h12: '07:00 PM', root: 1, type: 'Doubling' },
    { h24: '20:00', h12: '08:00 PM', root: 2, type: 'Doubling' },
    { h24: '21:00', h12: '09:00 PM', root: 3, type: 'Triad 3-6' },
    { h24: '22:00', h12: '10:00 PM', root: 4, type: 'Doubling' },
    { h24: '23:00', h12: '11:00 PM', root: 5, type: 'Doubling' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950 shrink-0">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              One-Page Field Guide (PDF-Ready Cheatsheet)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono font-bold transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body - Designed as a 1-page printable document */}
        <div
          ref={printContentRef}
          className="p-6 sm:p-8 overflow-y-auto bg-slate-950 text-slate-100 print:bg-white print:text-black print:p-6 print:m-0"
        >
          <div className="max-w-3xl mx-auto space-y-4 print:space-y-3 print:text-xs">
            {/* Header */}
            <div className="border-b border-slate-800 print:border-neutral-400 pb-3 text-center">
              <span className="text-[10px] font-mono tracking-widest uppercase text-amber-500 print:text-amber-800 font-bold block mb-0.5">
                PARALLEL TIMEKEEPING SYSTEM • OFFICIAL ONE-PAGE FIELD GUIDE
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white print:text-black">
                The Human Clock
              </h1>
              <p className="text-xs text-slate-400 print:text-neutral-700 mt-1 max-w-xl mx-auto">
                Base-9 digital roots & the vortex doubling cycle (1-2-4-8-7-5) running in exact parallel with standard time.
              </p>
            </div>

            {/* Short Explanation (Item 1) */}
            <div className="p-3 rounded-xl bg-slate-900/70 print:bg-neutral-100 border border-slate-800 print:border-neutral-300">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 print:text-amber-800 font-bold block mb-1">
                1. Short Explanation
              </span>
              <p className="text-xs text-slate-300 print:text-neutral-800 leading-relaxed">
                The Human Clock is an intuitive, parallel time-reading framework that simplifies standard hours into single-digit base-9 digital roots (1 through 9) while leaving minutes and seconds completely identical. Built upon modular arithmetic and the natural doubling cycle (1-2-4-8-7-5) with a 3-6 control axis and 9 at the top, it operates seamlessly alongside any existing clock without disruption.
              </p>
            </div>

            {/* Conversion Rule in ONE Sentence (Item 2) */}
            <div className="p-3 rounded-xl bg-amber-500/10 print:bg-neutral-200 border-2 border-amber-500/50 print:border-neutral-900">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 print:text-neutral-900 font-bold block mb-0.5">
                2. Conversion Rule in One Sentence
              </span>
              <p className="text-xs sm:text-sm font-semibold font-mono text-white print:text-black">
                "Keep minutes and seconds identical, and simply sum the digits of the hour until a single digit from 1 to 9 remains (treating 00:00 as 9)."
              </p>
            </div>

            {/* 3-Step Beginner Instructions (Item 4) */}
            <div className="p-3 rounded-xl bg-slate-900/70 print:bg-neutral-100 border border-slate-800 print:border-neutral-300">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 print:text-amber-800 font-bold block mb-1.5">
                3. Three-Step Beginner Instructions
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                <div className="p-2 rounded bg-slate-950 print:bg-white border border-slate-800 print:border-neutral-300">
                  <strong className="text-amber-400 print:text-black block mb-0.5">Step 1: Hour Only</strong>
                  <span className="text-slate-300 print:text-neutral-700">Look only at the hour. Ignore the minutes and seconds completely.</span>
                </div>
                <div className="p-2 rounded bg-slate-950 print:bg-white border border-slate-800 print:border-neutral-300">
                  <strong className="text-amber-400 print:text-black block mb-0.5">Step 2: Sum Digits</strong>
                  <span className="text-slate-300 print:text-neutral-700">Add the hour digits together: 14 → 1+4 = <strong>5</strong>. (If ≥10, sum again).</span>
                </div>
                <div className="p-2 rounded bg-slate-950 print:bg-white border border-slate-800 print:border-neutral-300">
                  <strong className="text-amber-400 print:text-black block mb-0.5">Step 3: Attach Minutes</strong>
                  <span className="text-slate-300 print:text-neutral-700">Reattach minutes unchanged: 14:37 becomes <strong>H5:37</strong> or <strong>Human 5:37</strong>.</span>
                </div>
              </div>
            </div>

            {/* Middle Section: Dial Graphic + Full 24-Hour Table (Item 3) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
              {/* Dial Geometry Vector Diagram */}
              <div className="sm:col-span-4 flex flex-col items-center p-3 rounded-xl bg-slate-900/70 print:bg-neutral-100 border border-slate-800 print:border-neutral-300">
                <span className="text-[10px] font-mono text-slate-400 print:text-neutral-700 font-bold uppercase mb-1">
                  Face Geometry (9 at Top)
                </span>
                <svg width="150" height="150" viewBox="0 0 160 160" className="overflow-visible my-1">
                  {/* Outer circle */}
                  <circle cx="80" cy="80" r="70" fill="none" stroke="#475569" strokeWidth="1.2" />
                  
                  {/* Doubling Loop (1-2-4-8-7-5) */}
                  {(() => {
                    const seq = [1, 2, 4, 8, 7, 5, 1];
                    const d = seq
                      .map((n, i) => {
                        const c = getCircleCoordinates(n, 80, 80, 54);
                        return `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`;
                      })
                      .join(' ');
                    return <path d={d} fill="none" stroke="#2563eb" strokeWidth="1.5" />;
                  })()}

                  {/* 3-6 Axis and Triad */}
                  {(() => {
                    const seq = [9, 3, 6, 9];
                    const d = seq
                      .map((n, i) => {
                        const c = getCircleCoordinates(n, 80, 80, 54);
                        return `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`;
                      })
                      .join(' ');
                    return <path d={d} fill="none" stroke="#d97706" strokeWidth="1.2" strokeDasharray="3 2" />;
                  })()}

                  {/* 3-6 horizontal axis line */}
                  <line
                    x1={getCircleCoordinates(3, 80, 80, 54).x}
                    y1={getCircleCoordinates(3, 80, 80, 54).y}
                    x2={getCircleCoordinates(6, 80, 80, 54).x}
                    y2={getCircleCoordinates(6, 80, 80, 54).y}
                    stroke="#d97706"
                    strokeWidth="1"
                    strokeOpacity="0.8"
                  />

                  {/* 9 Nodes */}
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
                    const c = getCircleCoordinates(n, 80, 80, 54);
                    const isTop = n === 9;
                    const isTriad = n === 3 || n === 6;
                    return (
                      <g key={`guide-node-${n}`}>
                        <circle
                          cx={c.x}
                          cy={c.y}
                          r="7.5"
                          fill="#020617"
                          stroke={isTop ? '#f59e0b' : isTriad ? '#d97706' : '#64748b'}
                          strokeWidth="1.2"
                        />
                        <text
                          x={c.x}
                          y={c.y + 3}
                          textAnchor="middle"
                          fontSize="8"
                          fontWeight="bold"
                          fill={isTop ? '#fbbf24' : '#f8fafc'}
                          fontFamily="monospace"
                        >
                          {n}
                        </text>
                      </g>
                    );
                  })}
                </svg>
                <span className="text-[8px] font-mono text-slate-400 print:text-neutral-600 text-center leading-tight mt-1">
                  • 1-2-4-8-7-5 Loop (Blue)<br />
                  • 3-6 Control Axis & Triad (Amber)
                </span>
              </div>

              {/* Full 24-Hour Table (Item 3) */}
              <div className="sm:col-span-8 p-3 rounded-xl bg-slate-900/70 print:bg-neutral-100 border border-slate-800 print:border-neutral-300">
                <span className="text-[10px] font-mono text-slate-400 print:text-neutral-800 font-bold uppercase mb-1.5 block">
                  4. Full 24-Hour Digital Root Table (All 24 Hours)
                </span>

                {/* 3-column compact full table (8 rows each = 24 total) */}
                <div className="grid grid-cols-3 gap-1.5 text-[9px] font-mono">
                  {[0, 8, 16].map((offset) => (
                    <div key={`col-${offset}`} className="space-y-1">
                      {full24Hours.slice(offset, offset + 8).map((item) => (
                        <div
                          key={item.h24}
                          className="px-1.5 py-0.5 rounded bg-slate-950 print:bg-white border border-slate-800/80 print:border-neutral-300 flex items-center justify-between"
                        >
                          <span className="text-slate-400 print:text-neutral-600 font-medium">
                            {item.h24}
                          </span>
                          <strong className="text-amber-400 print:text-black font-bold">
                            H[{item.root}]
                          </strong>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* The Three Practical Ways to Use It (Item 5) */}
            <div className="p-3 rounded-xl bg-slate-900/70 print:bg-neutral-100 border border-slate-800 print:border-neutral-300">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 print:text-amber-800 font-bold block mb-1.5">
                5. The Three Practical Ways to Use It
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-slate-950 print:bg-white border border-slate-800 print:border-neutral-300">
                  <strong className="text-amber-400 print:text-black block mb-0.5">1. Dual-Face Overlay</strong>
                  <span className="text-slate-300 print:text-neutral-700">Print onto transparency film and stick over standard 12h clock with 9 aligned to 12.</span>
                </div>
                <div className="p-2 rounded bg-slate-950 print:bg-white border border-slate-800 print:border-neutral-300">
                  <strong className="text-amber-400 print:text-black block mb-0.5">2. Simple Digital Format</strong>
                  <span className="text-slate-300 print:text-neutral-700">Display <code>14:37 → H5:37</code> or <code>Human 5:37</code> on phone lockscreens and widgets.</span>
                </div>
                <div className="p-2 rounded bg-slate-950 print:bg-white border border-slate-800 print:border-neutral-300">
                  <strong className="text-amber-400 print:text-black block mb-0.5">3. 2-Sec Mental Math</strong>
                  <span className="text-slate-300 print:text-neutral-700">Glance at standard 24h clock, sum digits in your head (1+8 = 9, 2+1 = 3), speak naturally.</span>
                </div>
              </div>
            </div>

            {/* Footer Tagline */}
            <div className="text-center text-[9px] text-slate-500 print:text-neutral-600 font-mono pt-2 border-t border-slate-800 print:border-neutral-300 flex justify-between items-center">
              <span>The Human Clock • Base-9 Modular Arithmetic & Vortex Doubling Cycle (1-2-4-8-7-5)</span>
              <span>100% Parallel Standard</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
