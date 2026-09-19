'use client';

import { useEffect, useState } from 'react';
import type { EngineLine } from '@/lib/tablebase/chess/types';
import { VariationLine } from '@/components/stockfish/analysis-output/VariationLine';

interface AnalysisOutputProps {
  lines: EngineLine[];
  onPlayMove: (ucis: string[]) => void;
  turn: 'w' | 'b';
  moveNumber: number;
  fen: string;
}

export default function AnalysisOutput({
  lines,
  onPlayMove,
  turn,
  moveNumber,
  fen,
}: AnalysisOutputProps) {
  // საწყისი მნიშვნელობა = პირველი ხაზები (როგორც წესი ცარიელი)
  const [displayLines, setDisplayLines] = useState<EngineLine[]>(lines);

  // ვაახლებთ მხოლოდ მაშინ, როცა მართლა მოვიდა ახალი ხაზები.
  // ცარიელი მასივი = „engine ახლა ითვლის“ → ვინახავთ წინას.
  useEffect(() => {
    if (lines.length > 0) setDisplayLines(lines);
  }, [lines]);

  // ვიცით, რომ ვაჩვენებთ ძველ (stale) შედეგებს — ჩავაქროთ, რომ მომხმარებელმა იცოდეს
  const isStale = lines.length === 0 && displayLines.length > 0;
  const isEmpty = displayLines.length === 0;

  return (
    <div className="flex min-h-0 flex-col gap-1.5">
      <div
        className={[
          'flex max-h-36 min-h-0 flex-col gap-1 overflow-y-auto overflow-x-hidden',
          'rounded-lg border border-border-subtle bg-bg-deepest',
          'font-mono text-[11px]',
          // რბილი გადასვლა — არ არის მკვეთრი flash
          'transition-opacity duration-200 ease-out',
          isStale ? 'opacity-40' : 'opacity-100',
        ].join(' ')}
      >
        {!isEmpty ? (
          displayLines.map((line) => (
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
          <span className="p-2 italic text-text-muted">No analysis yet</span>
        )}
      </div>
    </div>
  );
}