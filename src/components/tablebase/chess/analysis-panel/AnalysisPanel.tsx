'use client';

import { playUcis } from '@/lib/tablebase/chess/play';
import { fenTurn } from '@/lib/tablebase/chess/moves';
import { formatTbEval, tablebaseLines } from '@/lib/tablebase/chess/tablebase';
import { useTablebaseStore } from '@/stores/tablebase-store';
import { AnalysisHeader } from './AnalysisHeader';
import { AnalysisMeta } from './AnalysisMeta';
import { AnalysisLinesList } from './AnalysisLinesList';

export function AnalysisPanel() {
  const result = useTablebaseStore((s) => s.result);
  const fen = useTablebaseStore((s) => s.fen);
  const localLines = useTablebaseStore((s) => s.localLines);
  const building = useTablebaseStore((s) => s.pipeline !== 'idle');
  const gameOver = useTablebaseStore((s) => s.gameOver);
  const loading = useTablebaseStore((s) => s.loading);

  const turn = fenTurn(fen);
  const tbLines = result ? tablebaseLines(result.moves, turn) : [];
  const lines = tbLines.length ? tbLines : localLines;

  const evalText = result
    ? formatTbEval(result.category, result.dtm, turn)
    : lines[0]
      ? `${lines[0].evaluation > 0 ? '+' : ''}${lines[0].evaluation.toFixed(2)}`
      : '—';

  return (
    <section className="flex shrink-0 flex-col gap-2 rounded-xl bg-surface p-3 shadow-[var(--shadow-border)]">
      <AnalysisHeader/>
      <AnalysisMeta
        loading={loading}
        category={result?.category}
        hasLocalLine={Boolean(lines[0])}
        evalText={evalText}
        dtz={result?.dtz}
      />

      <AnalysisLinesList
        lines={lines}
        building={building}
        gameOver={gameOver}
        onSelectMove={(uci) => playUcis([uci])}
      />
    </section>
  );
}
