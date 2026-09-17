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
    /* bg-[#2A2A2A] - შემაღლებული პანელის ფონი, მკვეთრად გამოყოფს ბლოკს #121212 ფონისგან */
    <section
      className="flex shrink-0 flex-col gap-2 rounded-xl border border-[#383838] bg-[#2A2A2A] p-3"
      style={{
        boxShadow:
          "0 2px 8px 0 rgba(0,0,0,0.09), 0 1.5px 5px -2px rgba(0,0,0,0.10)",
      }}
    >
      <AnalysisHeader />
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