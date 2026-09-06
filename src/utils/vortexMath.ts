import { ConversionTableRow, ClockState } from '../types';

export const DOUBLING_CYCLE = [1, 2, 4, 8, 7, 5] as const;
export const TRIAD_AXIS = [3, 6, 9] as const;

/**
 * Calculates digital root of any non-negative integer.
 * Multiples of 9 become 9 (not 0).
 */
export function getDigitalRoot(n: number): number {
  if (n === 0) return 9; // Modular zero in base-9 vortex math
  const mod = n % 9;
  return mod === 0 ? 9 : mod;
}

export const calculateDigitalRoot24 = getDigitalRoot;

export function formatTwoDigits(n: number): string {
  return String(n).padStart(2, '0');
}

/**
 * Returns canonical example format:
 * e.g. 14:30 → 1+4=5 → H[5]:30
 */
export function formatCanonicalExample(hour: number, minute: number): string {
  const hStr = formatTwoDigits(hour);
  const mStr = formatTwoDigits(minute);
  const timeStr = `${hStr}:${mStr}`;

  if (hour === 0) {
    return `${timeStr} → 0=9 → H[9]:${mStr}`;
  }
  if (hour <= 9) {
    return `${timeStr} → ${hour} → H[${hour}]:${mStr}`;
  }
  const digits = hour.toString().split('').map(Number);
  const sum = digits.reduce((a, b) => a + b, 0);
  if (sum <= 9) {
    return `${timeStr} → ${digits.join('+')}=${sum} → H[${sum}]:${mStr}`;
  }
  const secondDigits = sum.toString().split('').map(Number);
  const secondSum = secondDigits.reduce((a, b) => a + b, 0);
  return `${timeStr} → ${digits.join('+')}=${sum} → ${secondDigits.join('+')}=${secondSum} → H[${secondSum}]:${mStr}`;
}

/**
 * Calculates digital root with step-by-step breakdown string
 */
export function getDigitalRootExplanation(n: number): { root: number; explanation: string } {
  if (n === 0) {
    return {
      root: 9,
      explanation: '00:00 → 0 ≡ 9 (mod 9 in base-9 vortex arithmetic) [or 24:00 → 2+4 = 6]',
    };
  }
  if (n <= 9) {
    return {
      root: n,
      explanation: `${n} is already a single digit (1–9)`,
    };
  }
  const digits = n.toString().split('').map(Number);
  const sum = digits.reduce((a, b) => a + b, 0);
  if (sum <= 9) {
    return {
      root: sum,
      explanation: `${digits.join(' + ')} = ${sum}`,
    };
  }
  const secondDigits = sum.toString().split('').map(Number);
  const secondSum = secondDigits.reduce((a, b) => a + b, 0);
  return {
    root: secondSum,
    explanation: `${digits.join(' + ')} = ${sum} → ${secondDigits.join(' + ')} = ${secondSum}`,
  };
}

/**
 * Computes the angle in radians/degrees for each number 1-9 on the vortex face.
 * 9 is anchored at 0° (top / 12 o'clock).
 * Clockwise spacing: 360° / 9 = 40° per step.
 */
export function getNumberAngle(num: number): number {
  // num is 1..9
  // 9 is at top (0 deg)
  // 1 is at 40 deg, 2 at 80 deg, etc.
  if (num === 9) return 0;
  return num * 40;
}

/**
 * Coordinates on a normalized unit circle (center at cx, cy with radius r).
 * Angle 0° is top (0, -r).
 */
export function getCircleCoordinates(
  num: number,
  cx: number,
  cy: number,
  radius: number
): { x: number; y: number; angleDeg: number } {
  const angleDeg = getNumberAngle(num);
  // In standard math, 0 deg is right (+x). Top is -90 deg.
  // We want angleDeg 0 to be top, increasing clockwise.
  const radians = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
    angleDeg,
  };
}

/**
 * Derives the complete clock state from a JavaScript Date object
 */
export function deriveClockState(date: Date): ClockState {
  const hour24 = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const period = hour24 >= 12 ? 'PM' : 'AM';

  const dr12 = getDigitalRoot(hour12);
  const dr24 = getDigitalRoot(hour24);

  const exp12 = getDigitalRootExplanation(hour12);
  const exp24 = getDigitalRootExplanation(hour24);

  const isDoublingNode12 = (DOUBLING_CYCLE as readonly number[]).includes(dr12);
  const isControlTriad12 = (TRIAD_AXIS as readonly number[]).includes(dr12);

  const isDoublingNode24 = (DOUBLING_CYCLE as readonly number[]).includes(dr24);
  const isControlTriad24 = (TRIAD_AXIS as readonly number[]).includes(dr24);

  return {
    date,
    hour12,
    hour24,
    minute,
    second,
    period,
    humanHour12: dr12,
    humanHour24: dr24,
    isDoublingNode12,
    isControlTriad12,
    isDoublingNode24,
    isControlTriad24,
    rootCalculation12: exp12.explanation,
    rootCalculation24: exp24.explanation,
  };
}

/**
 * Generates the full 24-hour table rows
 */
export function generate24HourTable(): ConversionTableRow[] {
  const rows: ConversionTableRow[] = [];

  for (let h24 = 0; h24 < 24; h24++) {
    const formatted24 = `${h24.toString().padStart(2, '0')}:00`;
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    const period: 'AM' | 'PM' = h24 >= 12 ? 'PM' : 'AM';
    const formatted12 = `${h12}:00 ${period}`;

    const dr24 = getDigitalRoot(h24);
    const exp24 = getDigitalRootExplanation(h24);

    const dr12 = getDigitalRoot(h12);
    const exp12 = getDigitalRootExplanation(h12);

    let timeOfDay: 'Night' | 'Morning' | 'Afternoon' | 'Evening' = 'Night';
    if (h24 >= 5 && h24 < 12) timeOfDay = 'Morning';
    else if (h24 >= 12 && h24 < 17) timeOfDay = 'Afternoon';
    else if (h24 >= 17 && h24 < 21) timeOfDay = 'Evening';
    else timeOfDay = 'Night';

    const isDoubling = (DOUBLING_CYCLE as readonly number[]).includes(dr24);

    let note = '';
    if (h24 === 0) {
      note = 'Midnight boundary (base-9 root 9; or 24:00 root 6)';
    } else if (h24 === 12) {
      note = 'Solar noon (1+2=3, beginning of afternoon triad)';
    } else if (dr24 === 9) {
      note = 'Polar harmonic alignment (Root 9)';
    } else if (isDoubling) {
      note = `Vortex doubling cycle node (${dr24})`;
    } else {
      note = `Control axis node (${dr24})`;
    }

    rows.push({
      hour24: h24,
      formatted24,
      hour12: h12,
      formatted12,
      period,
      digitalRoot24: dr24,
      formula24: exp24.explanation,
      digitalRoot12: dr12,
      formula12: exp12.explanation,
      vortexGroup24: isDoubling ? 'doubling' : 'triad',
      timeOfDay,
      contextualNote: note,
    });
  }

  return rows;
}

/**
 * Generates an exact ASCII / text representation of the Human Clock face
 */
export function getAsciiClockDiagram(): string {
  return `
                     [ 9 ]  (TOP / POLAR APEX)
                      /|\\
                     / | \\
           (320°)  8   |   1  (40°)
                 /     |     \\
                /      |      \\
      (280°)  7        |        2  (80°)
              | \\      |      / |
              |  \\     |     /  |
      (240°)  6---.----+----.---3  (120° CONTROL AXIS)
              |    \\   |   /    |
              |     \\  |  /     |
      (200°)  5       \\|/       4  (160°)
                       V

   -------------------------------------------------
   VORTEX DOUBLING PATH: 1 → 2 → 4 → 8 → 7 → 5 → 1
   CONTROL AXIS TRIAD:  3 ↔ 6 (Oscillating) & 9 (Polar Apex)
   -------------------------------------------------
   • 9 is anchored at 12 o'clock (0°).
   • Numbers 1 through 8 are arranged clockwise at 40° intervals.
   • Minutes & Seconds remain standard (00 to 59).
  `;
}

/**
 * Copy-paste formulas for various platforms
 */
export const CONVERSION_FORMULAS = {
  python: `def human_hour(hour: int) -> int:
    """
    Converts normal hour (1-12 or 0-23) to Human Clock digital root.
    Multiples of 9 become 9 (not 0).
    """
    if hour == 0:
        return 9  # Base-9 modular zero (or return 6 if treating 00:00 as 24:00)
    remainder = hour % 9
    return 9 if remainder == 0 else remainder

# Example usage:
# human_hour(14) -> 5  (14:00 -> Human Hour 5)
# human_hour(20) -> 2  (20:00 -> Human Hour 2)
# human_hour(12) -> 3  (12:00 -> Human Hour 3)
`,

  excel: `=IF(A1=0, 9, IF(MOD(A1, 9)=0, 9, MOD(A1, 9)))
  
# Or the compact mathematical closed form:
=MOD(A1 - 1, 9) + 1
# (Works for any positive hour A1 >= 1. For 00:00, use IF(A1=0, 9, MOD(A1-1,9)+1))`,

  javascript: `// Universal Human Clock hour converter
export function toHumanHour(hour) {
  if (hour === 0) return 9;
  return (hour % 9) || 9;
}

// Full time formatter: e.g. "H[5]:42:15"
export function formatHumanTime(date = new Date(), use24h = true) {
  const rawHour = use24h ? date.getHours() : (date.getHours() % 12 || 12);
  const hHour = toHumanHour(rawHour);
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return \`H[\${hHour}]:\${mm}:\${ss}\`;
}`,

  sql: `-- PostgreSQL / SQLite / BigQuery
SELECT 
  hour_val,
  CASE 
    WHEN hour_val = 0 THEN 9
    WHEN (hour_val % 9) = 0 THEN 9 
    ELSE (hour_val % 9) 
  END AS human_hour
FROM generate_series(0, 23) AS hour_val;`,
};
