'use client';

import { useMemo } from 'react';
import { Chess, type Move } from 'chess.js';
import { ArrowDownUp, Check, Copy, LogOut, Share2, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ConnectionStatus, GameStatus, MultiplayerSession, PlayerColor } from '@/lib/multiplayer/types';

const CONNECTION_LABEL: Record<ConnectionStatus, string> = {
  offline: 'Offline',
  connecting: 'Joining',
  connected: 'Live',
};

const STATUS_LABEL: Record<GameStatus, string> = {
  idle: 'No active game',
  searching: 'Finding an opponent',
  connecting: 'Joining game',
  waiting: 'Waiting for opponent',
  'your-turn': 'Your move',
  'opponent-turn': 'Opponent to move',
  error: 'Connection problem',
};

const PIECE_ORDER = ['q', 'r', 'b', 'n', 'p'] as const;
const PIECE_VALUE = { q: 9, r: 5, b: 3, n: 3, p: 1 } as const;
type Captured = (typeof PIECE_ORDER)[number];

export interface MatchOutcome {
  headline: string;
  detail: string;
  tone: 'win' | 'loss' | 'draw';
}

interface MultiplayerPanelProps {
  session: MultiplayerSession;
  gameStatus: GameStatus;
  turn: PlayerColor;
  orientation: PlayerColor;
  fen: string;
  moves: string[];
  checked: boolean;
  outcome: MatchOutcome | null;
  inviteUrl: string;
  copied: boolean;
  canShare: boolean;
  onCopyInvite: () => void;
  onShareInvite: () => void;
  onFlip: () => void;
  onLeaveGame: () => void;
}

function formatCaptured(pieces: Captured[]): string {
  const counts = { q: 0, r: 0, b: 0, n: 0, p: 0 };
  for (const piece of pieces) counts[piece] += 1;
  return PIECE_ORDER.filter((type) => counts[type] > 0)
    .map((type) => (counts[type] > 1 ? `${counts[type]}${type.toUpperCase()}` : type.toUpperCase()))
    .join(' ');
}

function advantageFromFen(fen: string): number {
  const placement = fen.split(' ')[0] ?? '';
  const value = { w: 0, b: 0 };
  for (const char of placement) {
    if (char === '/' || (char >= '1' && char <= '8')) continue;
    const type = char.toLowerCase();
    if (!isCaptured(type)) continue;
    value[char === char.toUpperCase() ? 'w' : 'b'] += PIECE_VALUE[type];
  }
  return value.w - value.b;
}

function isCaptured(type: string): type is Captured {
  return (PIECE_ORDER as readonly string[]).includes(type);
}

function readMaterial(moves: string[], fen: string) {
  const whiteAdvantage = advantageFromFen(fen);
  try {
    const chess = new Chess();
    const taken: Record<'w' | 'b', Captured[]> = { w: [], b: [] };
    for (const san of moves) {
      const move: Move = chess.move(san);
      if (move.captured && isCaptured(move.captured)) {
        taken[move.color].push(move.captured);
      }
    }
    return {
      byWhite: formatCaptured(taken.w),
      byBlack: formatCaptured(taken.b),
      whiteAdvantage,
    };
  } catch {
    return { byWhite: '', byBlack: '', whiteAdvantage };
  }
}

function PlayerCard({
  color,
  name,
  waiting,
  isToMove,
  checked,
  captured,
  advantage,
}: {
  color: PlayerColor;
  name: string;
  waiting: boolean;
  isToMove: boolean;
  checked: boolean;
  captured: string;
  advantage: number;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2.5 rounded-lg border px-2.5 py-2',
        isToMove
          ? 'border-accent-teal-bright/40 bg-accent-teal-bright/10'
          : 'border-border-default bg-bg-elevated',
      )}>
      <span
        className={cn(
          'h-3.5 w-3.5 shrink-0 rounded-full border',
          color === 'white' ? 'border-border-strong bg-bg-contrast' : 'border-border-strong bg-black',
          isToMove && 'ring-2 ring-accent-teal-bright/40',
        )}
      />
      <div className="min-w-0 flex-1">
        <p className={cn('truncate font-mono text-xs', waiting ? 'text-text-muted' : 'text-text-primary')}>{name}</p>
        <p className="mt-0.5 truncate font-mono text-micro text-text-muted">
          <span className="uppercase tracking-wider">{color === 'white' ? 'White' : 'Black'}</span>
          {captured && <span className="tracking-wide text-text-secondary"> · {captured}</span>}
          {advantage > 0 && <span className="tabular-nums text-accent-gold-bright"> +{advantage}</span>}
        </p>
      </div>
      {isToMove && (
        <span className="shrink-0 rounded-md bg-accent-teal-bright/15 px-1.5 py-0.5 font-mono text-micro uppercase tracking-wider text-accent-gold-bright">
          {checked ? 'Check' : 'To move'}
        </span>
      )}
    </div>
  );
}

export function MultiplayerPanel({
  session,
  gameStatus,
  turn,
  orientation,
  fen,
  moves,
  checked,
  outcome,
  inviteUrl,
  copied,
  canShare,
  onCopyInvite,
  onShareInvite,
  onFlip,
  onLeaveGame,
}: MultiplayerPanelProps) {
  const { gameId, playerColor, opponentPresent, connection, error } = session;
  const material = useMemo(() => readMaterial(moves, fen), [fen, moves]);
  const showTurn = connection === 'connected' && !outcome;

  const nameFor = (color: PlayerColor) => {
    if (!playerColor) return color === 'white' ? 'White' : 'Black';
    if (playerColor === color) return 'You';
    return opponentPresent ? 'Opponent' : 'Empty seat';
  };

  const capturedFor = (color: PlayerColor) => (color === 'white' ? material.byWhite : material.byBlack);
  const advantageFor = (color: PlayerColor) => {
    if (color === 'white') return material.whiteAdvantage;
    return -material.whiteAdvantage;
  };

  const top: PlayerColor = orientation === 'white' ? 'black' : 'white';
  const bottom: PlayerColor = orientation;

  const statusLabel = outcome
    ? outcome.headline
    : checked && gameStatus === 'your-turn'
      ? 'Check — your move'
      : checked && gameStatus === 'opponent-turn'
        ? 'Check'
        : STATUS_LABEL[gameStatus];

  const statusTone = outcome
    ? outcome.tone === 'win'
      ? 'border-accent-teal-bright/40 bg-accent-teal-bright/15 text-accent-gold-bright'
      : outcome.tone === 'loss'
        ? 'border-accent-garnet/40 bg-accent-garnet-dim text-accent-garnet-bright'
        : 'border-border-default bg-bg-elevated text-text-secondary'
    : gameStatus === 'your-turn'
      ? 'border-accent-teal-bright/40 bg-accent-teal-bright/15 text-accent-gold-bright'
      : gameStatus === 'error'
        ? 'border-accent-garnet/40 bg-accent-garnet-dim text-accent-garnet-bright'
        : gameStatus === 'waiting' || gameStatus === 'connecting'
          ? 'border-accent-gold-bright/30 bg-accent-teal-bright/10 text-accent-gold-bright'
          : 'border-border-default bg-bg-elevated text-text-secondary';

  return (
    <div className="shrink-0 rounded-xl border border-border-default bg-bg-surface p-3 shadow-panel">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-mono text-[10px] uppercase tracking-wider text-text-muted">Match</h2>
          <p className={cn('mt-1 inline-flex rounded-md border px-2 py-0.5 font-mono text-xs', statusTone)} aria-live="polite">
            {statusLabel}
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border-default bg-bg-elevated px-2 py-0.5 font-mono text-[11px] text-text-secondary">
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              connection === 'connected'
                ? 'bg-accent-teal-bright'
                : connection === 'connecting'
                  ? 'animate-pulse bg-accent-gold-bright'
                  : 'bg-text-muted',
            )}
          />
          {CONNECTION_LABEL[connection]}
        </span>
      </div>

      {outcome && <p className="mt-2 font-mono text-[11px] text-text-secondary">{outcome.detail}</p>}

      {error && connection !== 'connected' && (
        <p className="mt-2 flex items-start gap-1.5 rounded-md border border-accent-garnet/40 bg-accent-garnet-dim px-2 py-1.5 font-mono text-[11px] text-accent-garnet-bright">
          <TriangleAlert className="mt-px h-3.5 w-3.5 shrink-0" />
          <span className="min-w-0">{error}</span>
        </p>
      )}

      <div className="mt-3 space-y-1.5">
        {[top, bottom].map((color) => (
          <PlayerCard
            key={color}
            color={color}
            name={nameFor(color)}
            waiting={!opponentPresent && playerColor !== color}
            isToMove={showTurn && turn === color}
            checked={checked}
            captured={capturedFor(color)}
            advantage={advantageFor(color)}
          />
        ))}
      </div>

      {gameId && !opponentPresent && (
        <div className="mt-3 rounded-lg border border-border-default bg-bg-elevated px-2.5 py-2">
          <div className="flex items-center justify-between gap-2">
            <p className="font-mono text-micro uppercase tracking-wider text-text-muted">Invite</p>
            <code className="font-mono text-xs tracking-[0.18em] text-accent-gold-bright">{gameId}</code>
          </div>
          <p className="mt-1 font-mono text-micro text-text-muted">You have White. Your friend joins this link as Black.</p>
          {inviteUrl && (
            <input
              readOnly
              value={inviteUrl}
              aria-label="Invite link"
              onFocus={(event) => event.currentTarget.select()}
              className="mt-2 w-full rounded-md border border-border-default bg-bg-deepest px-2 py-1.5 font-mono text-[11px] text-text-secondary outline-none focus:border-accent-teal/60"
            />
          )}
          <div className="mt-2 flex gap-1.5">
            <button
              type="button"
              onClick={onCopyInvite}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border-default bg-bg-surface px-2 py-1.5 font-mono text-[11px] text-text-secondary transition hover:border-accent-teal/50 hover:text-accent-gold-bright">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy link'}
            </button>
            {canShare && (
              <button
                type="button"
                onClick={onShareInvite}
                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border-default bg-bg-surface px-2 py-1.5 font-mono text-[11px] text-text-secondary transition hover:border-accent-teal/50 hover:text-accent-gold-bright">
                <Share2 className="h-3.5 w-3.5" />
                Share
              </button>
            )}
          </div>
        </div>
      )}

      {gameId && opponentPresent && (
        <div className="mt-3 flex items-center gap-2">
          <code className="min-w-0 flex-1 truncate font-mono text-[11px] tracking-[0.14em] text-text-muted">{gameId}</code>
          <button
            type="button"
            onClick={onCopyInvite}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border-default bg-bg-elevated px-2 py-1 font-mono text-[11px] text-text-secondary transition hover:border-accent-teal/50 hover:text-accent-gold-bright">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy link'}
          </button>
        </div>
      )}

      <div className="mt-3 grid grid-cols-2 gap-1.5">
        <button
          type="button"
          onClick={onFlip}
          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border-default bg-bg-elevated px-2 py-1.5 font-mono text-xs text-text-secondary transition hover:border-accent-teal/50 hover:text-text-primary">
          <ArrowDownUp className="h-3.5 w-3.5" />
          Flip
        </button>
        <button
          type="button"
          onClick={onLeaveGame}
          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border-default bg-bg-elevated px-2 py-1.5 font-mono text-xs text-text-secondary transition hover:border-accent-garnet/50 hover:text-accent-garnet-bright">
          <LogOut className="h-3.5 w-3.5" />
          Leave
        </button>
      </div>
    </div>
  );
}
