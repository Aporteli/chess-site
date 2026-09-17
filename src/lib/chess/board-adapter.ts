import { Chess } from 'chess.js';
import { pickBestMove } from '@/lib/tablebase/chess/minimax';
import { endReason, uciOf } from '@/lib/tablebase/chess/moves';
import { playMoveSfx } from './audio';
import type { GameOverReason } from '@/lib/tablebase/chess/types';

export interface BoardAdapter {
  getFen: () => string;
  getHumanColor: () => 'w' | 'b';
  isBusy: () => boolean;
  isGameOver: () => boolean;

  getExistingHint: () => string | null;
  setHintUci: (uci: string | null) => void;

  getResetFen: () => string;
  commitFen: (fen: string) => boolean;
  applyPlayedFen: (fen: string, uci: string) => void;
  setGameOver?: (reason: GameOverReason) => void;

  armEngineReply?: (fen: string) => void;

  onBeforeMove?: () => void;
  onBeforeReset?: () => void;

  soundEnabled?: () => boolean;
}

export function performHint(adapter: BoardAdapter): void {
  if (adapter.isBusy() || adapter.isGameOver()) return;

  const fen = adapter.getFen();
  const turn = fen.split(' ')[1];
  if (turn !== adapter.getHumanColor()) return;

  const existing = adapter.getExistingHint();
  if (existing && existing.length >= 4) {
    adapter.setHintUci(existing);
    return;
  }

  const best = pickBestMove(fen, 3);
  adapter.setHintUci(best?.uci ?? null);
}

export function performReset(adapter: BoardAdapter): void {
  adapter.onBeforeReset?.();
  adapter.commitFen(adapter.getResetFen());
}

export function performPieceDrop(
  adapter: BoardAdapter,
  args: { sourceSquare: string; targetSquare: string | null },
): boolean {
  const { sourceSquare, targetSquare } = args;
  if (!targetSquare) return false;
  if (adapter.isBusy() || adapter.isGameOver()) return false;

  try {
    const next = new Chess(adapter.getFen());
    if (next.turn() !== adapter.getHumanColor()) return false;

    const move = next.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q',
    });
    if (!move) return false;

    playMoveSfx(next, move, adapter.soundEnabled?.());
    adapter.onBeforeMove?.();
    adapter.applyPlayedFen(next.fen(), uciOf(move));

    const reason = endReason(next);
    if (reason) adapter.setGameOver?.(reason);
    else adapter.armEngineReply?.(next.fen());
    return true;
  } catch {
    return false;
  }
}

export function performPlayUcis(adapter: BoardAdapter, ucis: string[]): boolean {
  if (adapter.isBusy() || adapter.isGameOver() || !ucis.length) return false;

  adapter.onBeforeMove?.();
  const next = new Chess(adapter.getFen());
  const played: string[] = [];

  for (const uci of ucis) {
    let move;
    try {
      move = next.move({
        from: uci.slice(0, 2),
        to: uci.slice(2, 4),
        promotion: uci[4],
      });
    } catch {
      return false;
    }
    if (!move) return false;
    playMoveSfx(next, move, adapter.soundEnabled?.());
    played.push(uciOf(move));
  }

  const last = played[played.length - 1]!;
  adapter.applyPlayedFen(next.fen(), last);

  const reason = endReason(next);
  if (reason) adapter.setGameOver?.(reason);
  else if (next.turn() !== adapter.getHumanColor())
    adapter.armEngineReply?.(next.fen());
  return true;
}