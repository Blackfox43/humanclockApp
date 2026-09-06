import React, { useMemo } from 'react';
import { getCircleCoordinates, DOUBLING_CYCLE } from '../utils/vortexMath';

interface VortexClockDialProps {
  humanHour: number;
  minute: number;
  second: number;
  showOverlayRing?: boolean;
  showDoublingLines?: boolean;
  showControlTriad?: boolean;
  size?: number;
  interactiveNode?: number | null;
  onSelectNode?: (num: number) => void;
}

export const VortexClockDial: React.FC<VortexClockDialProps> = ({
  humanHour,
  minute,
  second,
  showOverlayRing = true,
  showDoublingLines = true,
  showControlTriad = true,
  size = 380,
  interactiveNode = null,
  onSelectNode,
}) => {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.38; // Radius of 9-point vortex ring
  const overlayRadius = size * 0.46; // Radius for optional 12h standard clock ring

  // Compute positions for 1 through 9
  const nodes = useMemo(() => {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
      const coords = getCircleCoordinates(num, cx, cy, radius);
      const isDoubling = (DOUBLING_CYCLE as readonly number[]).includes(num);
      const isTriad = num === 3 || num === 6 || num === 9;
      const isActive = num === humanHour;
      const isSelected = interactiveNode === num;
      return {
        num,
        ...coords,
        isDoubling,
        isTriad,
        isActive,
        isSelected,
      };
    });
  }, [cx, cy, radius, humanHour, interactiveNode]);

  // Doubling path chords: 1 -> 2 -> 4 -> 8 -> 7 -> 5 -> 1
  const doublingPathD = useMemo(() => {
    const sequence = [1, 2, 4, 8, 7, 5, 1];
    return sequence
      .map((num, idx) => {
        const coords = getCircleCoordinates(num, cx, cy, radius);
        return `${idx === 0 ? 'M' : 'L'} ${coords.x.toFixed(1)} ${coords.y.toFixed(1)}`;
      })
      .join(' ');
  }, [cx, cy, radius]);

  // Control Triad triangle: 9 -> 3 -> 6 -> 9
  const triadTriangleD = useMemo(() => {
    const triadSeq = [9, 3, 6, 9];
    return triadSeq
      .map((num, idx) => {
        const coords = getCircleCoordinates(num, cx, cy, radius);
        return `${idx === 0 ? 'M' : 'L'} ${coords.x.toFixed(1)} ${coords.y.toFixed(1)}`;
      })
      .join(' ');
  }, [cx, cy, radius]);

  // Hand angles:
  // Minute hand: standard 360 deg / 60 min = 6 deg/min + second fraction
  const minuteAngleDeg = (minute + second / 60) * 6;
  const minuteRad = ((minuteAngleDeg - 90) * Math.PI) / 180;
  const minuteHandLen = radius * 0.85;

  // Second hand:
  const secondAngleDeg = second * 6;
  const secondRad = ((secondAngleDeg - 90) * Math.PI) / 180;
  const secondHandLen = radius * 0.95;

  // Human Hour hand:
  // In the vortex face, humanHour is in 1..9.
  // 9 is at 0°, 1 at 40°, 2 at 80°, etc.
  // Base angle for humanHour:
  const baseHourAngle = humanHour === 9 ? 0 : humanHour * 40;
  // Progress to next hour over 60 mins (+ minute fraction):
  const hourAngleDeg = baseHourAngle + (minute / 60) * 40;
  const hourRad = ((hourAngleDeg - 90) * Math.PI) / 180;
  const hourHandLen = radius * 0.58;

  // Standard 12-hour positions for outer overlay
  const standard12Markers = useMemo(() => {
    return [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((hour) => {
      const angleDeg = hour === 12 ? 0 : hour * 30;
      const rad = ((angleDeg - 90) * Math.PI) / 180;
      return {
        hour,
        x: cx + overlayRadius * Math.cos(rad),
        y: cy + overlayRadius * Math.sin(rad),
        angleDeg,
      };
    });
  }, [cx, cy, overlayRadius]);

  return (
    <div className="relative flex items-center justify-center select-none" id="human-clock-face-container">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow-2xl overflow-visible transition-all duration-300"
      >
        <defs>
          {/* Gradients */}
          <radialGradient id="clockDialGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="70%" stopColor="#090d16" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>

          <linearGradient id="doublingPathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="triadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.4" />
          </linearGradient>

          <radialGradient id="activeSunGrad" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </radialGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <filter id="strongGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="activeSunGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor="#f59e0b" floodOpacity="0.95" />
          </filter>
        </defs>

        {/* Outer Bezel Rim */}
        <circle
          cx={cx}
          cy={cy}
          r={size * 0.485}
          fill="none"
          stroke="#1e293b"
          strokeWidth="1.5"
          strokeDasharray="2 6"
        />

        {/* Outer Clock Body */}
        <circle
          cx={cx}
          cy={cy}
          r={size * 0.47}
          fill="url(#clockDialGrad)"
          stroke="#334155"
          strokeWidth="2"
        />

        {/* Secondary Inner Ring */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#1e293b"
          strokeWidth="1.5"
        />

        {/* Optional: Standard 12-Hour Outer Ring Overlay */}
        {showOverlayRing && (
          <g opacity={0.65} className="transition-opacity duration-300">
            {/* Overlay Ring track */}
            <circle
              cx={cx}
              cy={cy}
              r={overlayRadius}
              fill="none"
              stroke="#525266"
              strokeWidth="0.75"
              strokeDasharray="2 3"
            />
            {standard12Markers.map((m) => (
              <g key={`std-${m.hour}`}>
                <text
                  x={m.x}
                  y={m.y + 3.5}
                  textAnchor="middle"
                  fontSize={size * 0.026}
                  fontWeight="500"
                  fill="#94a3b8"
                  className="font-mono tracking-tighter"
                >
                  {m.hour}
                </text>
              </g>
            ))}
          </g>
        )}

        {/* Vortex Math Geometry Lines */}
        {/* 1. Control Axis Triangle (3-6-9) */}
        {showControlTriad && (
          <g>
            <path
              d={triadTriangleD}
              fill="rgba(245, 158, 11, 0.04)"
              stroke="url(#triadGrad)"
              strokeWidth="1.75"
              strokeDasharray="4 3"
              className="transition-all duration-300"
            />
            {/* 3 <-> 6 oscillation bar */}
            <line
              x1={getCircleCoordinates(3, cx, cy, radius).x}
              y1={getCircleCoordinates(3, cx, cy, radius).y}
              x2={getCircleCoordinates(6, cx, cy, radius).x}
              y2={getCircleCoordinates(6, cx, cy, radius).y}
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeOpacity="0.4"
            />
          </g>
        )}

        {/* 2. Doubling Cycle Vector Path (1-2-4-8-7-5-1) */}
        {showDoublingLines && (
          <g>
            <path
              d={doublingPathD}
              fill="none"
              stroke="url(#doublingPathGrad)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
              className="transition-all duration-300"
            />
            {/* Subtle flow arrows along doubling path */}
            {[
              [1, 2],
              [2, 4],
              [4, 8],
              [8, 7],
              [7, 5],
              [5, 1],
            ].map(([from, to]) => {
              const c1 = getCircleCoordinates(from, cx, cy, radius);
              const c2 = getCircleCoordinates(to, cx, cy, radius);
              const midX = (c1.x + c2.x) / 2;
              const midY = (c1.y + c2.y) / 2;
              return (
                <circle
                  key={`dot-${from}-${to}`}
                  cx={midX}
                  cy={midY}
                  r="2"
                  fill="#f59e0b"
                  opacity="0.8"
                />
              );
            })}
          </g>
        )}

        {/* Hour Hand (Points to Human Hour Digital Root) */}
        <g className="transition-transform duration-300 ease-out">
          <line
            x1={cx - Math.cos(hourRad) * (size * 0.06)}
            y1={cy - Math.sin(hourRad) * (size * 0.06)}
            x2={cx + Math.cos(hourRad) * hourHandLen}
            y2={cy + Math.sin(hourRad) * hourHandLen}
            stroke="#f8fafc"
            strokeWidth="4.5"
            strokeLinecap="round"
            filter="url(#glow)"
          />
          {/* Hour pointer head accent */}
          <circle
            cx={cx + Math.cos(hourRad) * hourHandLen}
            cy={cy + Math.sin(hourRad) * hourHandLen}
            r="3.5"
            fill="#f59e0b"
          />
        </g>

        {/* Minute Hand (Points to standard minutes 0-60) */}
        <g>
          <line
            x1={cx - Math.cos(minuteRad) * (size * 0.08)}
            y1={cy - Math.sin(minuteRad) * (size * 0.08)}
            x2={cx + Math.cos(minuteRad) * minuteHandLen}
            y2={cy + Math.sin(minuteRad) * minuteHandLen}
            stroke="#94a3b8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>

        {/* Second Hand (Ticking/Smooth) */}
        <g>
          <line
            x1={cx - Math.cos(secondRad) * (size * 0.1)}
            y1={cy - Math.sin(secondRad) * (size * 0.1)}
            x2={cx + Math.cos(secondRad) * secondHandLen}
            y2={cy + Math.sin(secondRad) * secondHandLen}
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle
            cx={cx + Math.cos(secondRad) * secondHandLen}
            cy={cy + Math.sin(secondRad) * secondHandLen}
            r="2"
            fill="#f59e0b"
          />
        </g>

        {/* Center Pinion Cap */}
        <circle cx={cx} cy={cy} r="6" fill="#020617" stroke="#f59e0b" strokeWidth="2" />
        <circle cx={cx} cy={cy} r="2.5" fill="#f8fafc" />

        {/* The 9 Nodes around the dial */}
        {nodes.map((node) => {
          const isTopPolar = node.num === 9;
          // Current active human hour node is significantly larger and brighter than other nodes
          const nodeRadius = node.isActive
            ? size * 0.082
            : isTopPolar
            ? size * 0.058
            : size * 0.050;
          const activeGlow = node.isActive ? 'url(#activeSunGlow)' : undefined;

          let badgeFill = '#0f172a';
          let textColor = '#cbd5e1';
          let borderColor = '#334155';

          if (node.isActive) {
            badgeFill = 'url(#activeSunGrad)';
            textColor = '#020617';
            borderColor = '#ffffff';
          } else if (node.isSelected) {
            borderColor = '#f59e0b';
            badgeFill = '#1e293b';
          } else if (isTopPolar) {
            borderColor = '#f59e0b';
            textColor = '#fbbf24';
          } else if (node.isTriad) {
            borderColor = '#d97706';
            textColor = '#fde68a';
          } else {
            borderColor = '#334155';
            textColor = '#cbd5e1';
          }

          // Calculate placement for tiny permanent label "Current Human Hour"
          let labelX = node.x;
          if (labelX < 62) labelX = 62;
          if (labelX > size - 62) labelX = size - 62;
          const labelY = node.y < cy ? node.y + nodeRadius + 14 : node.y - nodeRadius - 14;

          return (
            <g
              key={`node-${node.num}`}
              className="cursor-pointer transition-transform hover:scale-110"
              onClick={() => onSelectNode?.(node.num)}
            >
              {/* Outer pulsing and radiant halos for active node */}
              {node.isActive && (
                <>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={nodeRadius * 1.3}
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="2"
                    opacity="0.5"
                    className="animate-ping"
                  />
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={nodeRadius + 6}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    opacity="0.8"
                  />
                </>
              )}

              {/* Node background circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r={nodeRadius}
                fill={badgeFill}
                stroke={borderColor}
                strokeWidth={node.isActive ? 3.5 : 1.5}
                filter={activeGlow}
                className="transition-all duration-300"
              />

              {/* Number Label */}
              <text
                x={node.x}
                y={node.y + (node.isActive ? 6.5 : isTopPolar ? 5.5 : 4.8)}
                textAnchor="middle"
                fontSize={node.isActive ? size * 0.075 : isTopPolar ? size * 0.054 : size * 0.048}
                fontWeight={node.isActive ? '900' : '700'}
                fill={textColor}
                className="font-mono select-none"
              >
                {node.num}
              </text>

              {/* Polar marker flag on 9 when not overlapping with active label */}
              {isTopPolar && !node.isActive && (
                <text
                  x={node.x}
                  y={node.y - nodeRadius - 5}
                  textAnchor="middle"
                  fontSize={size * 0.024}
                  fontWeight="700"
                  fill="#f59e0b"
                  letterSpacing="0.08em"
                  className="uppercase font-mono"
                >
                  POLAR APEX
                </text>
              )}

              {/* Tiny Permanent Label: “Current Human Hour” */}
              {node.isActive && (
                <g className="pointer-events-none select-none">
                  {/* Subtle connector indicator */}
                  <line
                    x1={node.x}
                    y1={node.y < cy ? node.y + nodeRadius : node.y - nodeRadius}
                    x2={labelX}
                    y2={node.y < cy ? labelY - 8 : labelY + 8}
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                    opacity="0.8"
                  />
                  {/* High-contrast pill */}
                  <rect
                    x={labelX - 54}
                    y={labelY - 8.5}
                    width={108}
                    height={17}
                    rx={8.5}
                    fill="#020617"
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                    filter="url(#glow)"
                  />
                  <text
                    x={labelX}
                    y={labelY + 3.2}
                    textAnchor="middle"
                    fontSize="7.5"
                    fontWeight="800"
                    fill="#fbbf24"
                    letterSpacing="0.06em"
                    className="font-mono uppercase tracking-wider select-none"
                  >
                    Current Human Hour
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
