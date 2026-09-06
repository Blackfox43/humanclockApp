import React, { useState } from 'react';
import { CarouselSlide } from '../types';
import { X, ChevronLeft, ChevronRight, Copy, Check, Share2, Sparkles } from 'lucide-react';

const CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    id: 1,
    title: 'The Human Clock',
    subtitle: 'A parallel time-reading system built on base-9 digital roots & vortex math.',
    tag: 'SLIDE 1 • THE CONCEPT',
    body: [
      'What if our clock hours reflected natural mathematical harmonics?',
      'The Human Clock is a companion system that works alongside any normal clock.',
      'It simplifies standard hours into single digits (1 to 9) using digital roots.',
      'Minutes and seconds stay 100% untouched—so you never miss a meeting or alarm.',
    ],
    highlightSnippet: '100% Parallel • Zero Schedule Disruption',
    iconName: 'Compass',
  },
  {
    id: 2,
    title: 'The Golden Rule',
    subtitle: 'Minutes and seconds never change. Only the hour is translated.',
    tag: 'SLIDE 2 • THE CONVERSION',
    body: [
      'Rule 1: Look at the minutes and seconds. Keep them identical.',
      'Rule 2: Add the digits of the hour together until you have 1 through 9.',
      'If it is 14:30 in standard time: 1 + 4 = 5.',
      'Result: "Human 5 : 30" (written as H[5]:30).',
    ],
    highlightSnippet: '14:30 → 1 + 4 = Human 5:30',
    iconName: 'Calculator',
  },
  {
    id: 3,
    title: 'The Vortex Face',
    subtitle: '9 anchored at the top. The 1-2-4-8-7-5 loop and 3-6-9 control axis.',
    tag: 'SLIDE 3 • GEOMETRY',
    body: [
      'The dial has 9 equidistant positions separated by 40 degrees.',
      '9 sits permanently at 12 o\'clock (0°) as the supreme polar apex.',
      'Numbers 1-2-4-8-7-5 connect to create the infinite doubling loop.',
      '3 and 6 form a horizontal control bar that points directly to 9.',
    ],
    highlightSnippet: 'Doubling Loop: 1 → 2 → 4 → 8 → 7 → 5 → 1',
    iconName: 'Sparkles',
  },
  {
    id: 4,
    title: 'Everyday Examples',
    subtitle: 'Morning, afternoon, evening, and late night at a single glance.',
    tag: 'SLIDE 4 • REAL-WORLD EXAMPLES',
    body: [
      'Morning: 07:15 AM → Single digit 7 → Human 7:15 (H[7]:15).',
      'Afternoon: 02:30 PM (14:30) → 1 + 4 = 5 → Human 5:30 (H[5]:30).',
      'Evening: 08:45 PM (20:45) → 2 + 0 = 2 → Human 2:45 (H[2]:45).',
      'Midnight: 00:00 → 0 ≡ 9 (mod 9) → Human 9:00 (H[9]:00).',
    ],
    highlightSnippet: 'Instant mental translation in under 2 seconds.',
    iconName: 'Clock',
  },
  {
    id: 5,
    title: '3 Ways to Use it Today',
    subtitle: 'No new gadgets required. Works on wristwatches, phones, and in your mind.',
    tag: 'SLIDE 5 • IMPLEMENTATION',
    body: [
      '1. Analog Overlay: Print a clear sticker with [9] at 12 o\'clock on your wall clock.',
      '2. Phone Widget: Put "H[5]:42" on your smartwatch or mobile lock screen.',
      '3. Mental Shortcut: Just sum the hour digits in your head wherever you are.',
    ],
    highlightSnippet: 'Analog • Digital • Mental Math',
    iconName: 'Smartphone',
  },
  {
    id: 6,
    title: 'Spreadsheet & Code Ready',
    subtitle: 'One line of logic to convert any hour into its Human Clock label.',
    tag: 'SLIDE 6 • FORMULAS',
    body: [
      'Excel / Sheets: =IF(A1=0, 9, IF(MOD(A1,9)=0, 9, MOD(A1,9)))',
      'Python: def human_hour(h): return 9 if h % 9 == 0 else (h % 9)',
      'JavaScript: const toHumanHour = (h) => (h % 9) || 9;',
      'Share this parallel time system with a friend or colleague today!',
    ],
    highlightSnippet: '=IF(MOD(A1,9)=0, 9, MOD(A1,9))',
    iconName: 'Code2',
  },
];

interface SocialCarouselModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SocialCarouselModal: React.FC<SocialCarouselModalProps> = ({ isOpen, onClose }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [copiedSlide, setCopiedSlide] = useState<boolean>(false);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentSlide = CAROUSEL_SLIDES[currentSlideIndex];

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
  };

  const handleCopySlideText = () => {
    const text = `[${currentSlide.tag}]\n${currentSlide.title}\n${currentSlide.subtitle}\n\n${currentSlide.body.join('\n')}\n\nKey Takeaway: ${currentSlide.highlightSnippet || ''}`;
    navigator.clipboard.writeText(text);
    setCopiedSlide(true);
    setTimeout(() => setCopiedSlide(false), 2000);
  };

  const handleCopyAllSlides = () => {
    const fullText = CAROUSEL_SLIDES.map(
      (s) =>
        `--- ${s.tag} ---\n${s.title}\n${s.subtitle}\n\n${s.body.join('\n')}\n\nTakeaway: ${s.highlightSnippet}\n`
    ).join('\n\n');
    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Social Media Carousel & Slide Generator
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Carousel Visual Card Display */}
        <div className="p-6 sm:p-8 bg-slate-950 flex flex-col items-center">
          {/* Card Frame (1:1 / Square aspect style for Instagram/LinkedIn carousels) */}
          <div className="w-full max-w-md aspect-square bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative shadow-2xl">
            {/* Slide Header */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono tracking-widest font-bold text-amber-500 uppercase">
                  {currentSlide.tag}
                </span>
                <span className="text-xs font-mono text-slate-500 font-bold">
                  {currentSlideIndex + 1} / {CAROUSEL_SLIDES.length}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                {currentSlide.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {currentSlide.subtitle}
              </p>
            </div>

            {/* Slide Body Bullets */}
            <div className="space-y-2.5 my-4">
              {currentSlide.body.map((line, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                  <span className="leading-snug">{line}</span>
                </div>
              ))}
            </div>

            {/* Slide Highlight Callout */}
            {currentSlide.highlightSnippet && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center font-mono text-xs font-bold text-amber-300">
                {currentSlide.highlightSnippet}
              </div>
            )}
          </div>

          {/* Carousel Controls */}
          <div className="w-full max-w-md flex items-center justify-between mt-6">
            <button
              onClick={handlePrev}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Slide Dots Indicator */}
            <div className="flex items-center gap-1.5">
              {CAROUSEL_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentSlideIndex
                      ? 'w-6 bg-amber-400'
                      : 'w-2 bg-slate-700 hover:bg-slate-600'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-800 bg-slate-950">
          <button
            onClick={handleCopySlideText}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 transition-colors"
          >
            {copiedSlide ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copied Slide {currentSlideIndex + 1}!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                Copy Slide {currentSlideIndex + 1} Text
              </>
            )}
          </button>

          <button
            onClick={handleCopyAllSlides}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono font-bold transition-colors"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied All 6 Slides!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Entire Carousel (All 6 Slides)
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
