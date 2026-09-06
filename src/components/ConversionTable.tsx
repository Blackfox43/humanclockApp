import React, { useState, useMemo } from 'react';
import { generate24HourTable } from '../utils/vortexMath';
import { Search, Filter, Sparkles, Layers, Download, Check, Copy } from 'lucide-react';

export const ConversionTable: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterPeriod, setFilterPeriod] = useState<string>('all');
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  const allRows = useMemo(() => generate24HourTable(), []);

  const filteredRows = useMemo(() => {
    return allRows.filter((row) => {
      // Period filter
      if (filterPeriod !== 'all' && row.timeOfDay.toLowerCase() !== filterPeriod.toLowerCase()) {
        return false;
      }
      // Group filter
      if (filterGroup !== 'all' && row.vortexGroup24 !== filterGroup) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matches =
          row.formatted24.toLowerCase().includes(q) ||
          row.formatted12.toLowerCase().includes(q) ||
          `h[${row.digitalRoot24}]`.includes(q) ||
          String(row.digitalRoot24) === q ||
          row.formula24.toLowerCase().includes(q) ||
          row.contextualNote.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [allRows, filterPeriod, filterGroup, searchQuery]);

  const handleCopyTsv = () => {
    const headers = [
      'Normal 24H',
      'Normal 12H',
      'Human Hour (24h Root)',
      'Digital Root Formula',
      'Human Hour (12h Root)',
      'Vortex Group',
      'Period',
      'Notes',
    ];
    const lines = [
      headers.join('\t'),
      ...allRows.map((r) =>
        [
          r.formatted24,
          r.formatted12,
          `H[${r.digitalRoot24}]`,
          r.formula24,
          `H[${r.digitalRoot12}]`,
          r.vortexGroup24,
          r.timeOfDay,
          r.contextualNote,
        ].join('\t')
      ),
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <section id="conversion-table-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">
                Deliverable 4 • Reference Standard
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Full 24-Hour Conversion Table
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Every normal hour across the full day paired with its exact digital root and vortex classification.
            </p>
          </div>

          <button
            id="copy-full-table-tsv-btn"
            onClick={handleCopyTsv}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 transition-colors self-start sm:self-auto"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copied Spreadsheet TSV!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                Copy Table (Excel/TSV)
              </>
            )}
          </button>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by hour (e.g. 14:00, 2 PM, root 5)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Period Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400 font-mono mr-1">Period:</span>
            {['all', 'Morning', 'Afternoon', 'Evening', 'Night'].map((period) => (
              <button
                key={period}
                onClick={() => setFilterPeriod(period)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                  filterPeriod.toLowerCase() === period.toLowerCase()
                    ? 'bg-slate-800 text-white font-semibold border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          {/* Group Filter Buttons */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-mono mr-1">Vortex:</span>
            <button
              onClick={() => setFilterGroup('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                filterGroup === 'all'
                  ? 'bg-slate-800 text-white font-semibold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterGroup('doubling')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                filterGroup === 'doubling'
                  ? 'bg-slate-800 text-amber-400 font-semibold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800'
              }`}
            >
              Doubling (1-2-4-8-7-5)
            </button>
            <button
              onClick={() => setFilterGroup('triad')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                filterGroup === 'triad'
                  ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800'
              }`}
            >
              Triad (3-6-9)
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
          <table className="w-full text-left text-xs sm:text-sm font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Standard 24h</th>
                <th className="py-3 px-4">Standard 12h</th>
                <th className="py-3 px-4">Human Hour (24h)</th>
                <th className="py-3 px-4">Digital Root Formula</th>
                <th className="py-3 px-4">Human Hour (12h)</th>
                <th className="py-3 px-4">Vortex Geometry</th>
                <th className="py-3 px-4">Context / Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRows.map((row) => {
                const isDoubling = row.vortexGroup24 === 'doubling';
                return (
                  <tr
                    key={row.hour24}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    {/* 24h */}
                    <td className="py-3 px-4 font-semibold text-white">
                      {row.formatted24}
                    </td>

                    {/* 12h */}
                    <td className="py-3 px-4 text-slate-300">
                      {row.formatted12}
                    </td>

                    {/* Human Hour 24h */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold ${
                        row.digitalRoot24 === 9
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : isDoubling
                          ? 'bg-slate-800 text-amber-400 border border-slate-700'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        H[{row.digitalRoot24}]
                      </span>
                    </td>

                    {/* Formula */}
                    <td className="py-3 px-4 text-slate-400">
                      {row.formula24}
                    </td>

                    {/* Human Hour 12h */}
                    <td className="py-3 px-4 text-slate-300">
                      <span className="text-slate-400 font-medium">
                        H[{row.digitalRoot12}] {row.period}
                      </span>
                    </td>

                    {/* Vortex Geometry Tag */}
                    <td className="py-3 px-4">
                      {isDoubling ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          Doubling Cycle
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          {row.digitalRoot24 === 9 ? 'Polar Apex (9)' : 'Control Triad'}
                        </span>
                      )}
                    </td>

                    {/* Note */}
                    <td className="py-3 px-4 text-slate-400 text-xs font-sans">
                      {row.contextualNote}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredRows.length === 0 && (
            <div className="py-12 text-center text-slate-500 text-sm font-sans">
              No matching hours found for "{searchQuery}".
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
