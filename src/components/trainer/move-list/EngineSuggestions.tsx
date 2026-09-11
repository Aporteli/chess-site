'use client';

import { Chess } from 'chess.js';
import { useTrainer } from '@/lib/trainer/context';
import { useStockfishEngine } from '@/components/stockfish/StockfishContext';
import { formatEval } from './helpers';

function uciToSan(fen: string, uci: string): string {
  try {
    const game = new Chess(fen);

    const move = game.move({
      from: uci.slice(0, 2),
      to: uci.slice(2, 4),
      promotion: uci[4] || 'q',
    });

    return move?.san ?? uci;
  } catch {
    return uci;
  }
}

export function EngineSuggestions() {
  const trainer = useTrainer();
  const { lines, isThinking } = useStockfishEngine();

  return (
    <div className="mb-3 flex min-h-[30px] flex-wrap gap-1.5">
      {lines.length === 0 && isThinking && <span className="font-mono text-[11px] text-text-muted">…</span>}

      {lines.map((line, index) => {
        const san = uciToSan(trainer.fen, line.uci);

        return (
          <button
            key={`${line.multipv}-${line.uci}`}
            type="button"
            onClick={() =>
              trainer.playUserMove(
                line.uci.slice(0, 2),
                line.uci.slice(2, 4),
                line.uci[4] as 'q' | 'r' | 'b' | 'n' | undefined,
              )
            }
            className={[
              'flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[12px] transition-colors',
              index === 0
                ? 'border-accent-teal/40 bg-accent-teal-dim text-accent-teal-bright'
                : 'border-border-subtle bg-bg-elevated text-text-secondary hover:text-text-primary',
            ].join(' ')}>
            <span className="font-semibold">{san}</span>

            <span className="text-[10px] text-text-muted">{formatEval(line.evaluation)}</span>
          </button>
        );
      })}
    </div>
  );
}
