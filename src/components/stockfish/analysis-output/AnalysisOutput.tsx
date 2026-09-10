'use client';

import type { EngineLine } from '@/lib/chess/use-stockfish';
import { VariationLine } from '@/components/stockfish/analysis-output/VariationLine';

interface AnalysisOutputProps {
  lines: EngineLine[];
  onPlayMove: (ucis: string[]) => void;
  turn: 'w' | 'b';
  moveNumber: number;
  fen: string;
}

export default function AnalysisOutput({ lines, onPlayMove, turn, moveNumber, fen }: AnalysisOutputProps) {
  return (
    <div className="flex min-h-0 flex-col gap-1.5">
      <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">Top variations</span>
      <div className="flex max-h-36 min-h-0 flex-col gap-1 overflow-y-auto overflow-x-hidden rounded-lg border border-border-subtle bg-bg-deepest p-2 font-mono text-[11px]">
        {lines && lines.length > 0 ? (
          lines.map((line) => (
            <VariationLine
              key={line.multipv}
              line={line}
              fen={fen}
              turn={turn}
              moveNumber={moveNumber}
              onPlayMoves={onPlayMove}
            />
          ))
        ) : (
          <span className="italic text-text-muted">No analysis yet</span>
        )}
      </div>
    </div>
  );
}
