import React, { useState } from 'react';
import { CONVERSION_FORMULAS } from '../utils/vortexMath';
import { Code2, Copy, Check, FileSpreadsheet, Terminal, Database, Smartphone } from 'lucide-react';

export const FormulasAndCode: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'excel' | 'python' | 'javascript' | 'sql'>('excel');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: 'excel' | 'python' | 'javascript' | 'sql') => {
    navigator.clipboard.writeText(CONVERSION_FORMULAS[key]);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <section id="formulas-code-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">
                Deliverable 7 • Developer & Spreadsheet Snippets
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Copy-Paste Formulas & Code Snippets
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Drop these one-line formulas into Excel, Google Sheets, Python scripts, or web apps.
            </p>
          </div>

          {/* Language Selector */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveTab('excel')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'excel'
                  ? 'bg-slate-800 text-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
              Excel / Sheets
            </button>
            <button
              onClick={() => setActiveTab('python')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'python'
                  ? 'bg-slate-800 text-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              Python
            </button>
            <button
              onClick={() => setActiveTab('javascript')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'javascript'
                  ? 'bg-slate-800 text-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-amber-400" />
              JavaScript
            </button>
            <button
              onClick={() => setActiveTab('sql')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'sql'
                  ? 'bg-slate-800 text-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-amber-400" />
              SQL
            </button>
          </div>
        </div>

        {/* Code Display Card */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <span className="ml-2 text-xs font-mono text-slate-400">
                {activeTab === 'excel'
                  ? 'formula.xlsx / Google Sheets'
                  : activeTab === 'python'
                  ? 'human_clock.py'
                  : activeTab === 'javascript'
                  ? 'humanClock.ts'
                  : 'query.sql'}
              </span>
            </div>

            <button
              id={`copy-code-${activeTab}-btn`}
              onClick={() => handleCopy(activeTab)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 border border-slate-700 transition-colors"
            >
              {copiedKey === activeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                  Copy Snippet
                </>
              )}
            </button>
          </div>

          <pre className="p-5 text-xs sm:text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed bg-slate-950/60">
            {CONVERSION_FORMULAS[activeTab]}
          </pre>

          {/* Quick Explanation Footer */}
          <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between font-mono">
            <span>
              {activeTab === 'excel' && 'Formula automatically maps 0 and multiples of 9 to digital root 9.'}
              {activeTab === 'python' && 'Functions reliably for positive integers 1–23 (or 00:00).'}
              {activeTab === 'javascript' && 'Lightweight ES module compatible with both Node.js and browser runtimes.'}
              {activeTab === 'sql' && 'Works with PostgreSQL, Google BigQuery, MySQL, and SQLite.'}
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Base-9 Modulo</span>
          </div>
        </div>
      </div>
    </section>
  );
};
