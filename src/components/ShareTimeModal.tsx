import React, { useState, useEffect, useMemo } from 'react';
import { TimeFormat } from '../types';
import {
  calculateDigitalRoot24,
  getDigitalRoot,
  formatTwoDigits,
  formatCanonicalExample,
} from '../utils/vortexMath';
import {
  X,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Clock,
  Sparkles,
  RefreshCw,
  Send,
  MessageSquare,
  Globe,
  Sliders,
} from 'lucide-react';

interface ShareTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialHour?: number;
  initialMinute?: number;
  timeFormat?: TimeFormat;
}

type TemplateId = 'standard' | 'short' | 'curiosity' | 'minimal';

export const ShareTimeModal: React.FC<ShareTimeModalProps> = ({
  isOpen,
  onClose,
  initialHour,
  initialMinute,
  timeFormat: defaultFormat = '24h',
}) => {
  const [hour, setHour] = useState<number>(() => initialHour ?? new Date().getHours());
  const [minute, setMinute] = useState<number>(() => initialMinute ?? new Date().getMinutes());
  const [format, setFormat] = useState<TimeFormat>(defaultFormat);
  const [activeTemplate, setActiveTemplate] = useState<TemplateId>('standard');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedMessage, setCopiedMessage] = useState<boolean>(false);

  // Synchronize when initial props change upon opening
  useEffect(() => {
    if (isOpen) {
      if (initialHour !== undefined) setHour(initialHour);
      if (initialMinute !== undefined) setMinute(initialMinute);
      setFormat(defaultFormat);
      setCopiedLink(false);
      setCopiedMessage(false);
    }
  }, [isOpen, initialHour, initialMinute, defaultFormat]);

  // Compute Human Clock numbers
  const effectiveHour = Math.min(23, Math.max(0, hour));
  const effectiveMinute = Math.min(59, Math.max(0, minute));
  const hour12 = effectiveHour % 12 === 0 ? 12 : effectiveHour % 12;
  const period = effectiveHour >= 12 ? 'PM' : 'AM';

  const humanHour = format === '24h'
    ? calculateDigitalRoot24(effectiveHour)
    : getDigitalRoot(hour12);

  const stdTimeFormatted = format === '24h'
    ? `${formatTwoDigits(effectiveHour)}:${formatTwoDigits(effectiveMinute)}`
    : `${hour12}:${formatTwoDigits(effectiveMinute)} ${period}`;

  const humanTimeFormatted = `H[${humanHour}]:${formatTwoDigits(effectiveMinute)}`;
  const canonicalFormula = formatCanonicalExample(
    format === '24h' ? effectiveHour : hour12,
    effectiveMinute
  );

  // Generate Deep Link URL
  const deepLinkUrl = useMemo(() => {
    if (typeof window === 'undefined') {
      return `https://humanclock.app/?time=${formatTwoDigits(effectiveHour)}:${formatTwoDigits(effectiveMinute)}`;
    }
    const origin = window.location.origin || 'https://humanclock.app';
    const pathname = window.location.pathname || '/';
    const params = new URLSearchParams();
    params.set('time', `${formatTwoDigits(effectiveHour)}:${formatTwoDigits(effectiveMinute)}`);
    if (format === '12h') {
      params.set('f', '12h');
    }
    return `${origin}${pathname}?${params.toString()}`;
  }, [effectiveHour, effectiveMinute, format]);

  // Dynamic template messages
  const templates: Record<TemplateId, { label: string; text: string }> = useMemo(() => {
    const timeRef = format === '24h'
      ? `${formatTwoDigits(effectiveHour)}:${formatTwoDigits(effectiveMinute)}`
      : `${hour12}:${formatTwoDigits(effectiveMinute)} ${period}`;

    return {
      standard: {
        label: 'Standard & Engaging',
        text: `It's currently ${humanTimeFormatted} in Human Time (${timeRef}). The hour is simplified to its digital root (${canonicalFormula}), while minutes stay 100% untouched. 🌀⏳`,
      },
      short: {
        label: 'Short & Punchy',
        text: `Human Clock time: ${humanTimeFormatted} (${timeRef}) 🌀\nHours reduce to 1–9, minutes never change.`,
      },
      curiosity: {
        label: 'Question / Hook',
        text: `Did you know ${timeRef} translates to ${humanTimeFormatted} in Human Time? The hour is reduced (${canonicalFormula}) while minutes stay identical. Check yours:`,
      },
      minimal: {
        label: 'Minimalist',
        text: `Human Time: ${humanTimeFormatted} | Standard: ${timeRef}`,
      },
    };
  }, [effectiveHour, effectiveMinute, hour12, period, format, humanTimeFormatted, canonicalFormula]);

  const currentMessageText = templates[activeTemplate].text;
  const fullShareTextWithUrl = `${currentMessageText}\n\n${deepLinkUrl}`;

  // Actions
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(deepLinkUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    } catch {
      // Fallback
    }
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(fullShareTextWithUrl);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2200);
    } catch {
      // Fallback
    }
  };

  const handleShareToX = () => {
    // Official X Web Intent
    const xIntent = `https://x.com/intent/tweet?text=${encodeURIComponent(currentMessageText)}&url=${encodeURIComponent(deepLinkUrl)}`;
    window.open(xIntent, '_blank', 'noopener,noreferrer');
  };

  const handleShareToBluesky = () => {
    // Official Bluesky Web Intent
    const bskyIntent = `https://bsky.app/intent/compose?text=${encodeURIComponent(fullShareTextWithUrl)}`;
    window.open(bskyIntent, '_blank', 'noopener,noreferrer');
  };

  const setTimeToNow = () => {
    const now = new Date();
    setHour(now.getHours());
    setMinute(now.getMinutes());
  };

  if (!isOpen) return null;

  return (
    <div
      id="share-time-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-7 my-8">
        {/* Close Button */}
        <button
          id="close-share-modal-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Share Your Human Time
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Generate a deep link or instant post for X, Bluesky, or direct copy
            </p>
          </div>
        </div>

        {/* Live Parallel Time Hero Card */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 mb-6 shadow-inner">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Time Being Shared
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={setTimeToNow}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-mono text-amber-400 border border-slate-800 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Current Time</span>
              </button>
              <button
                type="button"
                onClick={() => setFormat((f) => (f === '24h' ? '12h' : '24h'))}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-mono text-slate-300 border border-slate-800 transition-colors"
              >
                {format}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Standard Time */}
            <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">
                Standard Clock
              </span>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-200">
                {stdTimeFormatted}
              </div>
            </div>

            {/* Human Time */}
            <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block mb-1 font-bold">
                Human Clock Time
              </span>
              <div className="text-2xl sm:text-3xl font-mono font-black text-amber-400">
                {humanTimeFormatted}
              </div>
            </div>
          </div>

          {/* Canonical Arithmetic Breakdown */}
          <div className="mt-3 pt-3 border-t border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono">
            <span className="text-slate-500">Arithmetic:</span>
            <span className="text-emerald-400 font-bold">{canonicalFormula}</span>
          </div>
        </div>

        {/* Quick Time Scrubber / Input */}
        <div className="mb-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2.5">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-300">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              Adjust Time to Share
            </span>
            <span className="text-[11px] text-slate-500">
              Hour: {effectiveHour}h | Minute: {effectiveMinute}m
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span>Hour (00–23)</span>
                <span className="text-amber-400 font-bold">{formatTwoDigits(effectiveHour)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={23}
                value={effectiveHour}
                onChange={(e) => setHour(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span>Minute (00–59)</span>
                <span className="text-amber-400 font-bold">{formatTwoDigits(effectiveMinute)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={59}
                value={effectiveMinute}
                onChange={(e) => setMinute(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Template Style Selector */}
        <div className="mb-5">
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
            Select Message Template
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(templates) as TemplateId[]).map((key) => {
              const isActive = activeTemplate === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTemplate(key)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium text-left transition-all border ${
                    isActive
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span className="block font-bold text-[11px] truncate">
                    {templates[key].label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Post Preview Box */}
        <div className="mb-6 p-4 rounded-xl bg-slate-950 border border-slate-800 relative">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2">
            <span className="flex items-center gap-1.5 text-amber-500 font-bold">
              <MessageSquare className="w-3.5 h-3.5" />
              Social Post Preview
            </span>
            <span>{currentMessageText.length} characters</span>
          </div>

          <p className="text-sm text-slate-200 whitespace-pre-line leading-relaxed mb-3">
            {currentMessageText}
          </p>

          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2 truncate text-slate-400">
              <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate text-slate-300">{deepLinkUrl}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyLink}
              title="Copy link"
              className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0 transition-colors"
            >
              {copiedLink ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Direct Posting & Copy Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Post to X */}
          <button
            type="button"
            id="share-to-x-btn"
            onClick={handleShareToX}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-950 hover:bg-black text-white border border-slate-700 hover:border-slate-500 font-semibold text-sm transition-all shadow-sm group"
          >
            <span className="font-bold text-base leading-none">𝕏</span>
            <span>Post to X</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
          </button>

          {/* Post to Bluesky */}
          <button
            type="button"
            id="share-to-bluesky-btn"
            onClick={handleShareToBluesky}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-sky-950/40 hover:bg-sky-900/60 text-sky-300 border border-sky-800/60 hover:border-sky-600 font-semibold text-sm transition-all shadow-sm group"
          >
            <Send className="w-4 h-4 text-sky-400" />
            <span>Post to Bluesky</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
          </button>

          {/* Copy Full Message */}
          <button
            type="button"
            id="copy-share-message-btn"
            onClick={handleCopyMessage}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors shadow-sm"
          >
            {copiedMessage ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied Full Message!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Message & Link</span>
              </>
            )}
          </button>

          {/* Copy Deep Link Only */}
          <button
            type="button"
            id="copy-deep-link-btn"
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-sm transition-colors"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Deep Link Only</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
