'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useSettingsStore } from '@/stores/settings-store';
import { legalMovesFrom } from '@/lib/chess/fen';
import { PromotionDialog } from '@/components/board/PromotionDialog';
import type { PlayerColor } from '@/lib/multiplayer/types';

export interface BoardNotice {
  placement: 'center' | 'top' | 'bottom';
  title: string;
  detail?: string;
  primary?: { label: string; onClick: () => void };
  secondary?: { label: string; onClick: () => void };
}

interface MultiplayerBoardProps {
  fen: string;
  orientation: PlayerColor;
  playerColor: PlayerColor | null;
  interactive: boolean;
  lastMove: { from: string; to: string } | null;
  onMove: (from: string, to: string, promotion?: 'q' | 'r' | 'b' | 'n') => boolean;
  notice: BoardNotice | null;
}

function pieceSide(pieceType: string): PlayerColor {
  return pieceType.startsWith('w') ? 'white' : 'black';
}

function checkedKing(fen: string): string | null {
  let chess: Chess;
  try {
    chess = new Chess(fen);
  } catch {
    return null;
  }
  if (!chess.isCheck()) return null;

  const turn = chess.turn();
  const files = 'abcdefgh';
  const board = chess.board();
  for (let rank = 0; rank < 8; rank += 1) {
    for (let file = 0; file < 8; file += 1) {
      const piece = board[rank]?.[file];
      if (piece?.type === 'k' && piece.color === turn) {
        return `${files[file]}${8 - rank}`;
      }
    }
  }
  return null;
}

export function MultiplayerBoard({
  fen,
  orientation,
  playerColor,
  interactive,
  lastMove,
  onMove,
  notice,
}: MultiplayerBoardProps) {
  const animations = useSettingsStore((s) => s.animations);
  const coordinates = useSettingsStore((s) => s.coordinates);
  const legalHints = useSettingsStore((s) => s.legalHints);
  const [selected, setSelected] = useState<string | null>(null);
  const [pending, setPending] = useState<{ from: string; to: string } | null>(null);

  useEffect(() => {
    setSelected(null);
    setPending(null);
  }, [fen]);

  useEffect(() => {
    if (!interactive) setSelected(null);
  }, [interactive]);

  const targets = useMemo(() => {
    if (!selected || !interactive) return [];
    return [...new Set(legalMovesFrom(fen, selected).map((move) => String(move.to)))];
  }, [fen, interactive, selected]);

  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};
    const wash = { backgroundColor: 'rgba(232, 197, 121, 0.42)' };

    if (lastMove) {
      styles[lastMove.from] = { ...wash };
      styles[lastMove.to] = { ...wash };
    }
    if (selected) {
      styles[selected] = { backgroundColor: 'rgba(129, 182, 76, 0.5)' };
    }
    if (legalHints) {
      for (const square of targets) {
        styles[square] = {
          ...styles[square],
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(20, 16, 12, 0.55) 16%, transparent 18%)',
        };
      }
    }

    const king = checkedKing(fen);
    if (king) {
      styles[king] = { backgroundColor: 'rgba(230, 57, 70, 0.55)' };
    }
    return styles;
  }, [fen, lastMove, legalHints, selected, targets]);

  const attempt = useCallback(
    (from: string, to: string) => {
      const matches = legalMovesFrom(fen, from).filter((move) => move.to === to);
      if (matches.length === 0) return false;
      if (matches.some((move) => move.promotion)) {
        setPending({ from, to });
        setSelected(null);
        return false;
      }

      const played = onMove(from, to);
      if (played) setSelected(null);
      return played;
    },
    [fen, onMove],
  );

  const options = useMemo(
    () => ({
      id: 'multiplayer-board',
      position: fen,
      boardOrientation: orientation,
      allowDragging: interactive,
      allowDrawingArrows: true,
      allowDragOffBoard: false,
      animationDurationInMs: animations ? 180 : 0,
      showAnimations: animations,
      showNotation: coordinates,
      lightSquareStyle: {
        backgroundColor: 'var(--color-board-light)',
        backgroundImage: 'linear-gradient(155deg, rgba(255,255,255,0.12), transparent 55%)',
      },
      darkSquareStyle: {
        backgroundColor: 'var(--color-board-dark)',
        backgroundImage: 'linear-gradient(155deg, rgba(255,255,255,0.06), transparent 55%)',
      },
      dropSquareStyle: { boxShadow: 'inset 0 0 0 3px var(--color-hint)' },
      darkSquareNotationStyle: { color: 'rgba(243, 230, 200, 0.82)', fontSize: '10px', fontWeight: 600 },
      lightSquareNotationStyle: { color: 'rgba(90, 61, 32, 0.72)', fontSize: '10px', fontWeight: 600 },
      squareStyles,
      boardStyle: { width: '100%', aspectRatio: '1 / 1', borderRadius: 0 },
      canDragPiece: ({ piece }: { piece: { pieceType: string } }) => {
        if (!interactive || !playerColor) return false;
        return pieceSide(piece.pieceType) === playerColor;
      },
      onPieceDrop: ({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string | null }) => {
        if (!targetSquare || !interactive) return false;
        return attempt(sourceSquare, targetSquare);
      },
      onSquareClick: ({ square, piece }: { square: string; piece: { pieceType: string } | null }) => {
        if (!interactive || pending) return;
        if (selected && targets.includes(square)) {
          attempt(selected, square);
          return;
        }
        if (piece && playerColor && pieceSide(piece.pieceType) === playerColor) {
          setSelected(selected === square ? null : square);
          return;
        }
        setSelected(null);
      },
    }),
    [animations, attempt, coordinates, fen, interactive, orientation, pending, playerColor, selected, squareStyles, targets],
  );

  return (
    <div className="relative h-full w-full overflow-hidden rounded-md ring-1 ring-fg/15">
      <Chessboard options={options} />

      {pending && playerColor && (
        <PromotionDialog
          color={playerColor === 'white' ? 'w' : 'b'}
          onPick={(piece) => {
            onMove(pending.from, pending.to, piece);
            setPending(null);
          }}
          onCancel={() => setPending(null)}
        />
      )}

      {notice?.placement === 'center' && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-black/55 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-xs rounded-xl border border-border-default bg-bg-surface p-4 text-center shadow-panel" role="status">
            <p className="font-serif-display text-2xl text-text-primary">{notice.title}</p>
            {notice.detail && <p className="mt-1 font-mono text-xs leading-relaxed text-text-secondary">{notice.detail}</p>}
            {(notice.primary || notice.secondary) && (
              <div className="mt-4 flex flex-col gap-2">
                {notice.primary && (
                  <button
                    type="button"
                    onClick={notice.primary.onClick}
                    className="rounded-lg bg-accent-teal-bright px-3 py-2 font-mono text-xs text-bg-deepest transition hover:brightness-110">
                    {notice.primary.label}
                  </button>
                )}
                {notice.secondary && (
                  <button
                    type="button"
                    onClick={notice.secondary.onClick}
                    className="rounded-lg border border-border-default bg-bg-elevated px-3 py-2 font-mono text-xs text-text-secondary transition hover:text-text-primary">
                    {notice.secondary.label}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {(notice?.placement === 'top' || notice?.placement === 'bottom') && (
        <div
          className={cn(
            'absolute inset-x-2 z-20 rounded-lg border border-border-default bg-bg-deepest/90 px-2.5 py-2 shadow-panel backdrop-blur-sm',
            notice.placement === 'top' ? 'top-2' : 'bottom-2',
          )}>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-accent-gold-bright" />
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs text-text-primary">{notice.title}</p>
              {notice.detail && <p className="truncate font-mono text-micro text-text-muted">{notice.detail}</p>}
            </div>
            {notice.primary && (
              <button
                type="button"
                onClick={notice.primary.onClick}
                className="shrink-0 rounded-md border border-accent-teal/40 bg-accent-teal-dim px-2 py-1 font-mono text-[11px] text-accent-teal-bright transition hover:border-accent-teal">
                {notice.primary.label}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
