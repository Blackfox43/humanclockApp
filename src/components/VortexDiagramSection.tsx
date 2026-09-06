import React, { useState, useRef } from 'react';
import { getAsciiClockDiagram, getCircleCoordinates, DOUBLING_CYCLE } from '../utils/vortexMath';
import { Copy, Check, Printer, Sparkles, Layers, Eye, Download, Sliders, ArrowRight } from 'lucide-react';

export const VortexDiagramSection: React.FC = () => {
  const [copiedAscii, setCopiedAscii] = useState<boolean>(false);
  const [copiedSvg, setCopiedSvg] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'cleanFace' | 'specs' | 'ascii' | 'printable'>('cleanFace');
  
  // Interactive Controls for the Clean Visual Clock Face
  const [themeMode, setThemeMode] = useState<'minimal' | 'dark'>('minimal');
  const [showOuter12hRing, setShowOuter12hRing] = useState<boolean>(true);
  const [showVortexLoop, setShowVortexLoop] = useState<boolean>(true);
  const [showControlAxis, setShowControlAxis] = useState<boolean>(true);
  const [showDirectionArrows, setShowDirectionArrows] = useState<boolean>(true);

  const dialSvgRef = useRef<SVGSVGElement>(null);
  const asciiDiagram = getAsciiClockDiagram();

  const handleCopyAscii = () => {
    navigator.clipboard.writeText(asciiDiagram);
    setCopiedAscii(true);
    setTimeout(() => setCopiedAscii(false), 2000);
  };

  const handlePrintDial = () => {
    window.print();
  };

  // Download standalone SVG vector file
  const handleDownloadSvg = () => {
    if (!dialSvgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(dialSvgRef.current);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `human-clock-face-${themeMode}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  const handleCopySvgCode = () => {
    if (!dialSvgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(dialSvgRef.current);
    navigator.clipboard.writeText(svgData);
    setCopiedSvg(true);
    setTimeout(() => setCopiedSvg(false), 2000);
  };

  // Clock Face Math (Dimensions: 400 x 400)
  const size = 400;
  const cx = size / 2;
  const cy = size / 2;
  const innerRadius = 130;
  const outer12hRadius = 172;

  // Nodes 1 through 9
  const nodes = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
    const coords = getCircleCoordinates(num, cx, cy, innerRadius);
    return { num, ...coords };
  });

  // Standard 12-hour positions for outer comparison ring
  const std12Positions = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((h) => {
    const angleDeg = h === 12 ? 0 : h * 30;
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      h,
      x: cx + outer12hRadius * Math.cos(rad),
      y: cy + outer12hRadius * Math.sin(rad),
    };
  });

  // Doubling Loop Path: 1 -> 2 -> 4 -> 8 -> 7 -> 5 -> 1
  const doublingSeq = [1, 2, 4, 8, 7, 5, 1];
  const doublingPathD = doublingSeq
    .map((num, i) => {
      const c = getCircleCoordinates(num, cx, cy, innerRadius);
      return `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`;
    })
    .join(' ');

  // Control Triad: 9 -> 3 -> 6 -> 9
  const triadSeq = [9, 3, 6, 9];
  const triadPathD = triadSeq
    .map((num, i) => {
      const c = getCircleCoordinates(num, cx, cy, innerRadius);
      return `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`;
    })
    .join(' ');

  // Colors based on theme mode
  const isMinimal = themeMode === 'minimal';
  const colors = {
    bg: isMinimal ? '#ffffff' : '#020617',
    dialBg: isMinimal ? '#f8fafc' : '#090d16',
    border: isMinimal ? '#0f172a' : '#1e293b',
    outerRing: isMinimal ? '#94a3b8' : '#475569',
    outerText: isMinimal ? '#64748b' : '#94a3b8',
    vortexLine: isMinimal ? '#0f172a' : '#f59e0b',
    vortexArrow: isMinimal ? '#0f172a' : '#fbbf24',
    triadLine: isMinimal ? '#d97706' : '#ea580c',
    axisLine: isMinimal ? '#d97706' : '#ea580c',
    nodeBg: isMinimal ? '#ffffff' : '#0f172a',
    nodeBorder: isMinimal ? '#0f172a' : '#334155',
    nodeText: isMinimal ? '#0f172a' : '#f8fafc',
    topNodeBorder: isMinimal ? '#d97706' : '#f59e0b',
    topNodeText: isMinimal ? '#b45309' : '#fbbf24',
    triadNodeBorder: isMinimal ? '#d97706' : '#ea580c',
    triadNodeText: isMinimal ? '#b45309' : '#fdba74',
  };

  return (
    <section id="visual-diagram-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col gap-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">
                Concrete Deliverable • Clean Visual Clock Face
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Visual Clock Face & Geometry
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              The complete, ready-to-share clock face with 9 fixed at the top, the 1-2-4-8-7-5 vortex loop, the 3-6 control axis, and optional standard 12-hour comparison ring.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveTab('cleanFace')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'cleanFace'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Clean Visual Face
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'specs'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Architecture & Specs
            </button>
            <button
              onClick={() => setActiveTab('ascii')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'ascii'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ASCII Diagram
            </button>
            <button
              onClick={() => setActiveTab('printable')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'printable'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              100% Scale Overlay
            </button>
          </div>
        </div>

        {/* Tab 1: Clean Visual Clock Face (The Primary Deliverable) */}
        {activeTab === 'cleanFace' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Interactive Visual Dial Frame */}
            <div className="lg:col-span-7 bg-slate-900/60 rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col items-center shadow-2xl relative">
              {/* Top Controls Toolbar */}
              <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800/80">
                {/* Theme Mode Toggle: High Contrast Minimal vs Dark Slate */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
                  <button
                    onClick={() => setThemeMode('minimal')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      themeMode === 'minimal'
                        ? 'bg-white text-slate-950 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    High-Contrast Minimal
                  </button>
                  <button
                    onClick={() => setThemeMode('dark')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      themeMode === 'dark'
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Sleek Dark
                  </button>
                </div>

                {/* Direct Action Buttons: Download SVG & Print */}
                <div className="flex items-center gap-2">
                  <button
                    id="copy-svg-btn"
                    onClick={handleCopySvgCode}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 transition-colors"
                    title="Copy SVG XML to clipboard"
                  >
                    {copiedSvg ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                    <span>{copiedSvg ? 'Copied' : 'SVG Code'}</span>
                  </button>
                  <button
                    id="download-dial-svg-btn"
                    onClick={handleDownloadSvg}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 border border-slate-700 transition-colors"
                    title="Download vector SVG"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>SVG</span>
                  </button>
                  <button
                    id="print-face-btn"
                    onClick={handlePrintDial}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-xs font-mono text-slate-950 font-bold transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              {/* The Visual Clock Face SVG */}
              <div
                className={`p-4 sm:p-6 rounded-3xl transition-all duration-300 shadow-inner max-w-full flex items-center justify-center ${
                  isMinimal
                    ? 'bg-white border-2 border-slate-200'
                    : 'bg-slate-950 border border-slate-800'
                }`}
              >
                <svg
                  ref={dialSvgRef}
                  width="360"
                  height="360"
                  viewBox={`0 0 ${size} ${size}`}
                  className="overflow-visible select-none drop-shadow-xl"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <marker
                      id="arrow-minimal"
                      viewBox="0 0 10 10"
                      refX="5"
                      refY="5"
                      markerWidth="4"
                      markerHeight="4"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={colors.vortexArrow} />
                    </marker>
                  </defs>

                  {/* Outer Bezel Rim */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={size * 0.48}
                    fill="none"
                    stroke={colors.border}
                    strokeWidth="1.5"
                    strokeDasharray="3 4"
                  />

                  {/* Clock Dial Canvas */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={size * 0.46}
                    fill={colors.dialBg}
                    stroke={colors.border}
                    strokeWidth="2"
                  />

                  {/* Inner Track Ring */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={innerRadius}
                    fill="none"
                    stroke={colors.border}
                    strokeWidth="1.5"
                  />

                  {/* Center Alignment Crosshairs */}
                  <line
                    x1={cx - 10}
                    y1={cy}
                    x2={cx + 10}
                    y2={cy}
                    stroke={colors.border}
                    strokeWidth="1"
                  />
                  <line
                    x1={cx}
                    y1={cy - 10}
                    x2={cx}
                    y2={cy + 10}
                    stroke={colors.border}
                    strokeWidth="1"
                  />
                  <circle cx={cx} cy={cy} r="4" fill={colors.border} />

                  {/* Optional Light Outer Ring Showing Normal 12-Hour Positions */}
                  {showOuter12hRing && (
                    <g className="transition-opacity duration-300">
                      {/* Outer 12h guide track */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={outer12hRadius}
                        fill="none"
                        stroke={colors.outerRing}
                        strokeWidth="1"
                        strokeDasharray="3 3"
                      />
                      {std12Positions.map((item) => (
                        <g key={`outer-12-${item.h}`}>
                          <text
                            x={item.x}
                            y={item.y + 3.5}
                            textAnchor="middle"
                            fontSize="11"
                            fontWeight="600"
                            fill={colors.outerText}
                            fontFamily="monospace"
                          >
                            {item.h}
                          </text>
                        </g>
                      ))}
                    </g>
                  )}

                  {/* 3-6 Control Axis & Triad */}
                  {showControlAxis && (
                    <g className="transition-all duration-300">
                      {/* Equilateral Control Triangle (9-3-6-9) */}
                      <path
                        d={triadPathD}
                        fill={isMinimal ? 'rgba(217, 119, 6, 0.05)' : 'rgba(234, 88, 12, 0.08)'}
                        stroke={colors.triadLine}
                        strokeWidth="2"
                        strokeDasharray="4 3"
                      />
                      {/* Horizontal 3 <-> 6 Axis Line */}
                      <line
                        x1={getCircleCoordinates(3, cx, cy, innerRadius).x}
                        y1={getCircleCoordinates(3, cx, cy, innerRadius).y}
                        x2={getCircleCoordinates(6, cx, cy, innerRadius).x}
                        y2={getCircleCoordinates(6, cx, cy, innerRadius).y}
                        stroke={colors.axisLine}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </g>
                  )}

                  {/* Clear Placement of 1-2-4-8-7-5 Vortex Doubling Loop */}
                  {showVortexLoop && (
                    <g className="transition-all duration-300">
                      <path
                        d={doublingPathD}
                        fill="none"
                        stroke={colors.vortexLine}
                        strokeWidth={isMinimal ? 2.5 : 2.75}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Directional Flow Dots along doubling segments */}
                      {showDirectionArrows &&
                        [
                          [1, 2],
                          [2, 4],
                          [4, 8],
                          [8, 7],
                          [7, 5],
                          [5, 1],
                        ].map(([from, to]) => {
                          const c1 = getCircleCoordinates(from, cx, cy, innerRadius);
                          const c2 = getCircleCoordinates(to, cx, cy, innerRadius);
                          const midX = (c1.x + c2.x) / 2;
                          const midY = (c1.y + c2.y) / 2;
                          return (
                            <circle
                              key={`flow-dot-${from}-${to}`}
                              cx={midX}
                              cy={midY}
                              r={isMinimal ? 2.5 : 3}
                              fill={colors.vortexArrow}
                            />
                          );
                        })}
                    </g>
                  )}

                  {/* The 9 Fixed Nodes (9 is fixed at 0° top zenith!) */}
                  {nodes.map((node) => {
                    const isTop = node.num === 9;
                    const isTriad = node.num === 3 || node.num === 6;
                    const r = isTop ? 17 : 14.5;

                    const nodeBorder = isTop
                      ? colors.topNodeBorder
                      : isTriad
                      ? colors.triadNodeBorder
                      : colors.nodeBorder;

                    const nodeTextColor = isTop
                      ? colors.topNodeText
                      : isTriad
                      ? colors.triadNodeText
                      : colors.nodeText;

                    return (
                      <g key={`node-circ-${node.num}`}>
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={r}
                          fill={colors.nodeBg}
                          stroke={nodeBorder}
                          strokeWidth={isTop ? 3 : 2}
                        />
                        <text
                          x={node.x}
                          y={node.y + 5}
                          textAnchor="middle"
                          fontSize={isTop ? '15' : '13'}
                          fontWeight="bold"
                          fill={nodeTextColor}
                          fontFamily="monospace"
                        >
                          {node.num}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Bottom Interactive Toggles */}
              <div className="w-full mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  Visual Layer Toggles:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setShowOuter12hRing(!showOuter12hRing)}
                    className={`px-3 py-1.5 rounded-lg border transition-colors ${
                      showOuter12hRing
                        ? 'bg-slate-800 text-white border-slate-600 font-semibold'
                        : 'bg-slate-950 text-slate-500 border-slate-800'
                    }`}
                  >
                    Outer 12h Ring {showOuter12hRing ? 'ON' : 'OFF'}
                  </button>
                  <button
                    onClick={() => setShowVortexLoop(!showVortexLoop)}
                    className={`px-3 py-1.5 rounded-lg border transition-colors ${
                      showVortexLoop
                        ? 'bg-slate-800 text-white border-slate-600 font-semibold'
                        : 'bg-slate-950 text-slate-500 border-slate-800'
                    }`}
                  >
                    1-2-4-8-7-5 Loop {showVortexLoop ? 'ON' : 'OFF'}
                  </button>
                  <button
                    onClick={() => setShowControlAxis(!showControlAxis)}
                    className={`px-3 py-1.5 rounded-lg border transition-colors ${
                      showControlAxis
                        ? 'bg-slate-800 text-white border-slate-600 font-semibold'
                        : 'bg-slate-950 text-slate-500 border-slate-800'
                    }`}
                  >
                    3-6 Axis & Triad {showControlAxis ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Key Anatomical Checklist */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                  Anatomy of the Clean Visual Clock Face
                </h3>

                {/* Feature 1: 9 Fixed at Top */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      1. 9 FIXED AT THE TOP (0° / 12 O'CLOCK)
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">Apex</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Occupies the exact 12 o'clock position (0° zenith). In modular arithmetic and vortex mathematics, 9 is the polar axis and neutral attractor.
                  </p>
                </div>

                {/* Feature 2: 1-2-4-8-7-5 Vortex Loop */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      2. 1-2-4-8-7-5 VORTEX DOUBLING LOOP
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">Continuous Circuit</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Forms an unbroken infinity-like closed geometric path (1→2→4→8→7→5→1) representing the natural powers of 2 (1, 2, 4, 8, 16→7, 32→5, 64→1).
                  </p>
                </div>

                {/* Feature 3: 3-6 Control Axis */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5" />
                      3. 3-6 HORIZONTAL CONTROL AXIS
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">Equilateral Base</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Node 3 (at 120°) and Node 6 (at 240°) create a horizontal oscillation axis connecting across the dial, completed into an equilateral triangle with 9 at the top.
                  </p>
                </div>

                {/* Feature 4: Normal 12-Hour Outer Comparison Ring */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      4. LIGHT OUTER 12-HOUR COMPARISON RING
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">Parallel Bridge</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Notice how the systems effortlessly interlock:
                    <strong> Human 9 aligns with 12</strong>, <strong>Human 3 aligns with 4</strong>, and <strong>Human 6 aligns with 8</strong>!
                  </p>
                </div>
              </div>

              {/* Quick Summary Callout */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-slate-300 space-y-2">
                <div className="text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                  Ready to Share & Print
                </div>
                <p className="leading-relaxed">
                  Use the <strong>"High-Contrast Minimal"</strong> mode to print cleanly onto standard paper, cardstock, or clear transparency film to overlay onto an existing physical clock.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Architecture & Specs */}
        {activeTab === 'specs' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Architectural Specifications Panel */}
            <div className="lg:col-span-7 bg-slate-900/60 rounded-2xl p-6 border border-slate-800 space-y-5">
              <h3 className="text-base font-semibold text-white uppercase tracking-wider font-mono">
                Clock Face Specifications & Coordinate Mapping
              </h3>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold">
                    <Sparkles className="w-4 h-4" />
                    <span>1. 9 FIXED AT THE TOP (12 O'CLOCK / 0°)</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Polar Anchor</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  9 occupies the exact 12 o'clock position (0° zenith). In vortex mathematics, 9 is the
                  supreme polar attractor that unifies the system. Whenever 9 is multiplied by any
                  number, its digital root remains 9 (9×2=18→9, 9×5=45→9).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold">
                    <Layers className="w-4 h-4" />
                    <span>2. EQUIDISTANT 40° MODULAR SPACING</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">360° ÷ 9 = 40°</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The circle is divided into 9 equal intervals of 40 degrees clockwise:
                  1 is at 40°, 2 is at 80°, 3 is at 120° (4 o'clock on standard dial), 4 is at 160°, 5 is
                  at 200°, 6 is at 240° (8 o'clock on standard dial), 7 is at 280°, 8 is at 320°, and 9 is
                  at 360°/0°.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold">
                    <Eye className="w-4 h-4" />
                    <span>3. VORTEX DOUBLING PATH & 3-6-9 TRIAD</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">Dual Geometries</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>The Doubling Circuit (1-2-4-8-7-5-1):</strong> Connecting 1→2→4→8→7→5 forms an
                  infinity-like closed loop across the dial.
                  <br />
                  <strong>The Control Triad (3-6-9):</strong> 3 at 120° and 6 at 240° form a perfect
                  horizontal base axis that points upward to 9 at 0°, creating an equilateral control
                  triangle.
                </p>
              </div>
            </div>

            {/* Geometry Inspection Card */}
            <div className="lg:col-span-5 bg-slate-900/60 rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-200 mb-3 font-mono uppercase tracking-wider">
                  Coordinate Lookup Table
                </h4>
                <div className="space-y-1.5 text-xs font-mono">
                  {[
                    { n: 9, deg: '0° / 360°', std: '12:00 (Standard Zenith)', role: 'Polar Apex' },
                    { n: 1, deg: '40°', std: '≈ 1:20', role: 'Doubling Start' },
                    { n: 2, deg: '80°', std: '≈ 2:40', role: 'Doubling (1×2)' },
                    { n: 3, deg: '120°', std: '4:00 (Standard 4)', role: 'Control Axis Right' },
                    { n: 4, deg: '160°', std: '≈ 5:20', role: 'Doubling (2×2)' },
                    { n: 5, deg: '200°', std: '≈ 6:40', role: 'Doubling (7×2=14→5)' },
                    { n: 6, deg: '240°', std: '8:00 (Standard 8)', role: 'Control Axis Left' },
                    { n: 7, deg: '280°', std: '≈ 9:20', role: 'Doubling (8×2=16→7)' },
                    { n: 8, deg: '320°', std: '≈ 10:40', role: 'Doubling (4×2)' },
                  ].map((row) => (
                    <div
                      key={row.n}
                      className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded flex items-center justify-center font-bold text-xs ${
                          row.n === 9
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : row.n === 3 || row.n === 6
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {row.n}
                        </span>
                        <span className="text-slate-400">{row.deg}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-slate-200">{row.std}</div>
                        <div className="text-[10px] text-slate-500">{row.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800">
                <button
                  onClick={() => setActiveTab('cleanFace')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold font-mono transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Inspect Clean Visual Dial Face
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: ASCII / Text Diagram */}
        {activeTab === 'ascii' && (
          <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
                  Clean ASCII / Text Architecture Diagram
                </h3>
                <p className="text-xs text-slate-400">
                  Ready to copy-paste into documentation, markdown files, emails, or terminal guides.
                </p>
              </div>
              <button
                id="copy-ascii-diagram-btn"
                onClick={handleCopyAscii}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 border border-slate-700 transition-colors"
              >
                {copiedAscii ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy ASCII
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed">
              {asciiDiagram}
            </pre>
          </div>
        )}

        {/* Tab 4: Printable 100% Scale Overlay */}
        {activeTab === 'printable' && (
          <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
                  Printable Clock Face & Transparency Overlay
                </h3>
                <p className="text-xs text-slate-400">
                  High-contrast blueprint ready to print at 100% scale and place over any standard wall clock or watch face.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="print-overlay-btn"
                  onClick={handlePrintDial}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold font-mono transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Print Overlay (100% Scale)
                </button>
              </div>
            </div>

            {/* The Print Sheet Preview */}
            <div className="p-8 rounded-2xl bg-white text-neutral-900 flex flex-col items-center justify-center max-w-lg mx-auto shadow-2xl border-4 border-neutral-200">
              <span className="text-[11px] font-mono tracking-widest uppercase font-bold text-neutral-500 mb-1">
                HUMAN CLOCK • VORTEX OVERLAY
              </span>
              <span className="text-[10px] text-neutral-400 mb-4 font-mono">
                ALIGN [9] DIRECTLY OVER STANDARD 12 O'CLOCK
              </span>

              {/* High Contrast Black & White Printable SVG */}
              <svg width="300" height="300" viewBox="0 0 300 300" className="overflow-visible">
                {/* Center crosshairs for alignment */}
                <line x1="140" y1="150" x2="160" y2="150" stroke="#a3a3a3" strokeWidth="1" />
                <line x1="150" y1="140" x2="150" y2="160" stroke="#a3a3a3" strokeWidth="1" />
                <circle cx="150" cy="150" r="3" fill="#000" />

                {/* Outer guide circle */}
                <circle cx="150" cy="150" r="140" fill="none" stroke="#171717" strokeWidth="2" />
                <circle cx="150" cy="150" r="115" fill="none" stroke="#737373" strokeWidth="1" strokeDasharray="2 3" />

                {/* Optional Normal 12h Outer Ring */}
                {std12Positions.map((m) => {
                  const rad = (((m.h === 12 ? 0 : m.h * 30) - 90) * Math.PI) / 180;
                  const x = 150 + 130 * Math.cos(rad);
                  const y = 150 + 130 * Math.sin(rad);
                  return (
                    <text
                      key={`std-overlay-${m.h}`}
                      x={x}
                      y={y + 3}
                      textAnchor="middle"
                      fontSize="9"
                      fill="#a3a3a3"
                      fontFamily="monospace"
                    >
                      {m.h}
                    </text>
                  );
                })}

                {/* Doubling Path */}
                {(() => {
                  const seq = [1, 2, 4, 8, 7, 5, 1];
                  const d = seq
                    .map((num, i) => {
                      const c = getCircleCoordinates(num, 150, 150, 105);
                      return `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`;
                    })
                    .join(' ');
                  return (
                    <path
                      d={d}
                      fill="none"
                      stroke="#171717"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  );
                })()}

                {/* Control Triad & 3-6 Axis */}
                {(() => {
                  const seq = [9, 3, 6, 9];
                  const d = seq
                    .map((num, i) => {
                      const c = getCircleCoordinates(num, 150, 150, 105);
                      return `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`;
                    })
                    .join(' ');
                  return (
                    <path
                      d={d}
                      fill="none"
                      stroke="#d97706"
                      strokeWidth="1.75"
                      strokeDasharray="4 3"
                    />
                  );
                })()}

                {/* 3-6 Horizontal Axis Line */}
                <line
                  x1={getCircleCoordinates(3, 150, 150, 105).x}
                  y1={getCircleCoordinates(3, 150, 150, 105).y}
                  x2={getCircleCoordinates(6, 150, 150, 105).x}
                  y2={getCircleCoordinates(6, 150, 150, 105).y}
                  stroke="#d97706"
                  strokeWidth="2"
                />

                {/* The 9 Nodes */}
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
                  const c = getCircleCoordinates(n, 150, 150, 105);
                  const isTop = n === 9;
                  const isTriad = n === 3 || n === 6;
                  return (
                    <g key={`print-node-${n}`}>
                      <circle
                        cx={c.x}
                        cy={c.y}
                        r="13"
                        fill="#ffffff"
                        stroke={isTop ? '#d97706' : isTriad ? '#d97706' : '#171717'}
                        strokeWidth={isTop ? 2.5 : 1.5}
                      />
                      <text
                        x={c.x}
                        y={c.y + 4.5}
                        textAnchor="middle"
                        fontSize="13"
                        fontWeight="bold"
                        fill="#171717"
                        fontFamily="monospace"
                      >
                        {n}
                      </text>
                    </g>
                  );
                })}
              </svg>

              <div className="mt-6 text-[10px] text-neutral-500 font-mono text-center space-y-1">
                <div>Solid line: Doubling Circuit (1-2-4-8-7-5) • Orange: 3-6 Control Axis & Triad</div>
                <div>Cut along outer line and place directly over existing clock face.</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
