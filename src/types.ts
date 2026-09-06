export type TimeFormat = '12h' | '24h';

export interface ClockState {
  date: Date;
  hour12: number;
  hour24: number;
  minute: number;
  second: number;
  period: 'AM' | 'PM';
  humanHour12: number;
  humanHour24: number;
  isDoublingNode12: boolean;
  isControlTriad12: boolean;
  isDoublingNode24: boolean;
  isControlTriad24: boolean;
  rootCalculation12: string;
  rootCalculation24: string;
}

export interface ConversionTableRow {
  hour24: number;
  formatted24: string;
  hour12: number;
  formatted12: string;
  period: 'AM' | 'PM';
  digitalRoot24: number;
  formula24: string;
  digitalRoot12: number;
  formula12: string;
  vortexGroup24: 'doubling' | 'triad';
  timeOfDay: 'Night' | 'Morning' | 'Afternoon' | 'Evening';
  contextualNote: string;
}

export interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  tag: string;
  body: string[];
  highlightSnippet?: string;
  iconName: string;
}
