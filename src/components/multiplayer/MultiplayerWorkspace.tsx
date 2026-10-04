'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MultiplayerBoard, type BoardNotice } from './MultiplayerBoard';
import { MultiplayerLobby } from './MultiplayerLobby';
import { MultiplayerPanel, type MatchOutcome } from './MultiplayerPanel';
import { MoveHistory } from './MoveHistory';
import { gameOverReason, inCheck } from '@/lib/chess/fen';
import { useMultiplayerGame } from '@/lib/multiplayer/useMultiplayerGame';
import type { GameStatus, MultiplayerSession, PlayerColor } from '@/lib/multiplayer/types';

function opposite(color: PlayerColor): PlayerColor {
  return color === 'white' ? 'black' : 'white';
}

function describeOutcome(fen: string, playerColor: PlayerColor | null): MatchOutcome | null {
  let reason: string | null;
  try {
    reason = gameOverReason(fen);
  } catch {
    return null;
  }
  if (!reason) return null;

  if (reason === 'checkmate') {
    const loser: PlayerColor = fen.split(' ')[1] === 'b' ? 'black' : 'white';
    if (!playerColor) {
      return { headline: 'Checkmate', detail: `${loser === 'white' ? 'White' : 'Black'} is mated.`, tone: 'draw' };
    }
    const won = playerColor !== loser;
    return {
      headline: won ? 'You won' : 'You lost',
      detail: 'Checkmate',
      tone: won ? 'win' : 'loss',
    };
  }

  const detail: Record<string, string> = {
    stalemate: 'Stalemate',
    insufficient: 'Insufficient material',
    threefold: 'Threefold repetition',
    fifty: 'Fifty-move rule',
    draw: 'Draw',
  };
  return { headline: 'Draw', detail: detail[reason] ?? 'Draw', tone: 'draw' };
}

function useInviteLink(gameId: string | null) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState('');
  const [canShare, setCanShare] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
    setCanShare(typeof navigator.share === 'function');
  }, []);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  const inviteUrl = gameId && origin ? `${origin}/multiplayer?gameId=${encodeURIComponent(gameId)}` : '';

  const copy = useCallback(async () => {
    if (!gameId) return;
    const url = `${window.location.origin}/multiplayer?gameId=${encodeURIComponent(gameId)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — the link field can still be selected */
    }
  }, [gameId]);

  const share = useCallback(async () => {
    if (!gameId || typeof navigator.share !== 'function') return;
    const url = `${window.location.origin}/multiplayer?gameId=${encodeURIComponent(gameId)}`;
    try {
      await navigator.share({ title: 'Chess game invite', url });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
    }
  }, [gameId]);

  return { inviteUrl, copied, canShare, copy, share };
}

export function MultiplayerWorkspace() {
  const game = useMultiplayerGame();
  const [flipped, setFlipped] = useState(false);
  const invite = useInviteLink(game.gameId);

  useEffect(() => {
    setFlipped(false);
  }, [game.gameId]);

  if (!game.gameId) {
    return (
      <MultiplayerLobby
        isSearching={game.isSearching}
        error={game.error}
        onFindOpponent={game.findOpponent}
        onCancelSearch={game.cancelSearch}
        onCreateGame={game.createGame}
      />
    );
  }

  const session: MultiplayerSession = {
    gameId: game.gameId,
    playerColor: game.playerColor,
    opponentPresent: game.opponentPresent,
    connection: game.connection,
    error: game.error,
  };

  const seat = game.playerColor ?? 'white';
  const orientation = flipped ? opposite(seat) : seat;
  const isMyTurn = game.playerColor !== null && game.turn === game.playerColor;
  const outcome = describeOutcome(game.fen, game.playerColor);
  const checked = !outcome && safeInCheck(game.fen);
  const atStart = game.fen.startsWith('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
  const waiting = game.connection === 'connected' && !game.opponentPresent && atStart;
  const interactive = game.connection === 'connected' && isMyTurn && !outcome;

  const gameStatus: GameStatus =
    game.error && game.connection !== 'connected'
      ? 'error'
      : game.connection === 'connecting'
        ? 'connecting'
        : isMyTurn
          ? 'your-turn'
          : !game.opponentPresent
            ? 'waiting'
            : 'opponent-turn';

  const notice: BoardNotice | null = outcome
    ? {
        placement: 'center',
        title: outcome.headline,
        detail: outcome.detail,
        primary: { label: 'New private game', onClick: game.createGame },
        secondary: { label: 'Back to lobby', onClick: game.leaveGame },
      }
    : game.connection === 'offline' && game.error
      ? {
          placement: 'center',
          title: game.playerColor ? 'Connection lost' : 'Could not join',
          detail: game.error,
          primary: { label: 'Back to lobby', onClick: game.leaveGame },
        }
      : game.connection === 'connecting'
        ? {
            placement: 'center',
            title: 'Joining game',
            detail: 'Taking your seat…',
            secondary: { label: 'Cancel', onClick: game.leaveGame },
          }
        : waiting
          ? {
              placement: orientation === (game.playerColor ?? 'white') ? 'top' : 'bottom',
              title: 'Waiting for opponent',
              detail: 'You have White. Send the link to seat Black.',
              primary: { label: invite.copied ? 'Copied' : 'Copy link', onClick: () => void invite.copy() },
            }
          : null;

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col p-2">
      <div className="board-workspace w-full">
        <section className="board-column">
          <div className="board-stage">
            <div className="wood-frame relative min-h-0 min-w-0 rounded-xl p-2 sm:rounded-2xl sm:p-2.5">
              <MultiplayerBoard
                key={game.gameId}
                fen={game.fen}
                orientation={orientation}
                playerColor={game.playerColor}
                interactive={interactive}
                lastMove={game.lastMove}
                onMove={game.sendMove}
                notice={notice}
              />
            </div>
          </div>
        </section>

        <aside className="board-panel thin-scrollbar gap-2">
          <MultiplayerPanel
            session={session}
            gameStatus={gameStatus}
            turn={game.turn}
            orientation={orientation}
            fen={game.fen}
            moves={game.moves}
            checked={checked}
            outcome={outcome}
            inviteUrl={invite.inviteUrl}
            copied={invite.copied}
            canShare={invite.canShare}
            onCopyInvite={() => void invite.copy()}
            onShareInvite={() => void invite.share()}
            onFlip={() => setFlipped((value) => !value)}
            onLeaveGame={game.leaveGame}
          />
          <MoveHistory moves={game.moves} />
        </aside>
      </div>
    </div>
  );
}

function safeInCheck(fen: string): boolean {
  try {
    return inCheck(fen);
  } catch {
    return false;
  }
}
