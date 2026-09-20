'use client';

import { useState } from 'react';
import { Check, LogOut, Plus, Share2, TriangleAlert, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ConnectionStatus, GameStatus, MultiplayerSession, PlayerColor } from '@/lib/multiplayer/types';

const CONNECTION_LABEL: Record<ConnectionStatus, string> = {
  offline: 'Disconnected',
  connecting: 'Connecting',
  connected: 'Connected',
};

const CONNECTION_TONE: Record<ConnectionStatus, string> = {
  offline: 'border-border-subtle bg-bg-elevated text-text-muted',
  connecting: 'border-accent-gold/40 bg-accent-gold-dim text-accent-gold-bright',
  connected: 'border-accent-teal/40 bg-accent-teal-dim text-accent-teal-bright',
};

const STATUS_LABEL: Record<GameStatus, string> = {
  idle: 'No active game',
  connecting: 'Connecting to room',
  waiting: 'Waiting for opponent',
  'your-turn': 'Your turn',
  'opponent-turn': "Opponent's turn",
  error: 'Connection problem',
};

const STATUS_TONE: Record<GameStatus, string> = {
  idle: 'border-border-subtle bg-bg-elevated text-text-muted',
  connecting: 'border-accent-gold/40 bg-accent-gold-dim text-accent-gold-bright',
  waiting: 'border-accent-gold/40 bg-accent-gold-dim text-accent-gold-bright',
  'your-turn': 'border-accent-teal/40 bg-accent-teal-dim text-accent-teal-bright',
  'opponent-turn': 'border-border-default bg-bg-elevated text-text-secondary',
  error: 'border-accent-garnet/40 bg-accent-garnet-dim text-accent-garnet-bright',
};

interface PlayerRowProps {
  color: PlayerColor;
  name: string;
  isYou: boolean;
  isToMove: boolean;
}

function PlayerRow({ color, name, isYou, isToMove }: PlayerRowProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2.5 rounded-lg border px-2.5 py-2',
        isToMove ? 'border-accent-teal/40 bg-accent-teal-dim' : 'border-border-subtle bg-bg-elevated',
      )}>
      <span
        className={cn(
          'h-4 w-4 shrink-0 rounded-full border',
          color === 'white' ? 'border-border-strong bg-bg-contrast' : 'border-border-strong bg-color_3',
        )}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-mono text-xs text-text-primary">{name}</p>
        <p className="font-mono text-micro uppercase tracking-wider text-text-muted">{color}</p>
      </div>
      {isYou && (
        <span className="shrink-0 rounded-md border border-accent-gold/30 bg-accent-gold-dim px-1.5 py-0.5 font-mono text-micro uppercase tracking-wider text-accent-gold-bright">
          You
        </span>
      )}
    </div>
  );
}

interface MultiplayerPanelProps {
  session: MultiplayerSession;
  gameStatus: GameStatus;
  turn: PlayerColor;
  onCreateGame: () => void;
  onLeaveGame: () => void;
}

export function MultiplayerPanel({ session, gameStatus, turn, onCreateGame, onLeaveGame }: MultiplayerPanelProps) {
  const [copied, setCopied] = useState(false);
  const { gameId, playerColor, opponentPresent, connection, error } = session;

  const opponentName = opponentPresent ? 'Opponent' : gameId ? 'Waiting…' : 'No opponent';
  const nameFor = (color: PlayerColor) => {
    if (!playerColor) return color === 'white' ? 'White' : 'Black';
    return playerColor === color ? 'You' : opponentName;
  };

  const shareLink = async () => {
    if (!gameId || typeof window === 'undefined') return;
    const url = `${window.location.origin}/multiplayer?gameId=${encodeURIComponent(gameId)}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Chess game invite', url });
        return;
      } catch {
        /* fall through to clipboard */
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface p-4 shadow-panel">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-mono text-[10px] uppercase tracking-wider text-text-muted">Multiplayer</h2>
          <p className={cn('mt-1 inline-flex rounded-md border px-2 py-0.5 font-mono text-xs', STATUS_TONE[gameStatus])}>
            {STATUS_LABEL[gameStatus]}
          </p>
        </div>

        <span
          className={cn(
            'inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[11px]',
            CONNECTION_TONE[connection],
          )}>
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              connection === 'connected'
                ? 'bg-accent-teal-bright'
                : connection === 'connecting'
                  ? 'bg-accent-gold-bright'
                  : 'bg-text-muted',
            )}
          />
          {CONNECTION_LABEL[connection]}
        </span>
      </div>

      {playerColor && (
        <p className="mt-2 font-mono text-[11px] text-text-secondary">
          You play{' '}
          <span className="text-accent-gold-bright">{playerColor === 'white' ? 'White' : 'Black'}</span>
        </p>
      )}

      {error && (
        <p className="mt-2 flex items-start gap-1.5 rounded-md border border-accent-garnet/40 bg-accent-garnet-dim px-2 py-1.5 font-mono text-[11px] text-accent-garnet-bright">
          <TriangleAlert className="mt-px h-3.5 w-3.5 shrink-0" />
          <span className="min-w-0">{error}</span>
        </p>
      )}

      <div className="mt-3 space-y-1.5">
        <PlayerRow
          color="white"
          name={nameFor('white')}
          isYou={playerColor === 'white'}
          isToMove={connection === 'connected' && turn === 'white'}
        />
        <PlayerRow
          color="black"
          name={nameFor('black')}
          isYou={playerColor === 'black'}
          isToMove={connection === 'connected' && turn === 'black'}
        />
      </div>

      <div className="mt-3 rounded-lg border border-border-subtle bg-bg-elevated px-2.5 py-2">
        <p className="font-mono text-micro uppercase tracking-wider text-text-muted">Game ID</p>
        <div className="mt-1 flex items-center gap-2">
          <code className="min-w-0 flex-1 truncate font-mono text-sm text-accent-gold-bright">{gameId ?? '—'}</code>
          <button
            type="button"
            disabled={!gameId}
            onClick={shareLink}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border-default bg-bg-surface px-2 py-1 font-mono text-[11px] text-text-secondary transition hover:border-accent-gold/50 hover:text-accent-gold-bright disabled:opacity-40">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Share link'}
          </button>
        </div>
        <p className="mt-1.5 flex items-center gap-1.5 font-mono text-micro text-text-muted">
          <Users className="h-3 w-3" />
          {opponentPresent ? 'Opponent connected' : 'Send the link to invite an opponent'}
        </p>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={onCreateGame}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-accent-teal/40 bg-accent-teal-dim px-2.5 py-1.5 font-mono text-xs text-accent-teal-bright transition hover:border-accent-teal">
          <Plus className="h-3.5 w-3.5" />
          New game
        </button>
        <button
          type="button"
          disabled={!gameId}
          onClick={onLeaveGame}
          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border-default bg-bg-elevated px-2.5 py-1.5 font-mono text-xs text-text-secondary transition hover:border-accent-garnet/50 hover:text-accent-garnet-bright disabled:opacity-40">
          <LogOut className="h-3.5 w-3.5" />
          Leave
        </button>
      </div>
    </div>
  );
}
