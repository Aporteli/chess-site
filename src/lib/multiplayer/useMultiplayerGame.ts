'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Chess } from 'chess.js';
import {
  colorFromTurn,
  parseServerMessage,
  type ClientMessage,
  type ConnectionStatus,
  type PlayerColor,
} from './types';

const START_FEN = new Chess().fen();
const DEFAULT_WS_URL = 'ws://localhost:8787/ws';

const JOIN_FAILED =
  'Could not join the room. It may already have two players, or the server is unreachable.';
const CONNECTION_LOST = 'Connection closed. Create or rejoin a game to continue.';
const MATCHMAKING_FAILED = 'Could not find an opponent. Please try again.';

export function buildSocketUrl(gameId: string): string {
  const url = new URL(process.env.NEXT_PUBLIC_MULTIPLAYER_WS_URL ?? DEFAULT_WS_URL);
  url.searchParams.set('gameId', gameId);
  return url.toString();
}

function buildMatchmakingUrl(playerId: string): string {
  const url = new URL(process.env.NEXT_PUBLIC_MULTIPLAYER_WS_URL ?? DEFAULT_WS_URL);
  url.pathname = '/matchmaking';
  url.search = '';
  url.searchParams.set('playerId', playerId);
  return url.toString();
}

function createGameId(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase();
}

/** Drops the handlers before closing so teardown never reports a lost connection. */
function closeSocket(socket: WebSocket | undefined): void {
  if (!socket) return;

  socket.onopen = null;
  socket.onmessage = null;
  socket.onerror = null;
  socket.onclose = null;

  if (socket.readyState === WebSocket.CONNECTING || socket.readyState === WebSocket.OPEN) {
    socket.close(1000, 'client left');
  }
}

function syncUrl(gameId: string | null): void {
  const url = new URL(window.location.href);

  if (gameId) {
    url.searchParams.set('gameId', gameId);
  } else {
    url.searchParams.delete('gameId');
  }

  window.history.replaceState(null, '', url.toString());
}

interface GameSnapshot {
  playerColor: PlayerColor | null;
  connection: ConnectionStatus;
  fen: string;
  turn: PlayerColor;
  moves: string[];
  opponentPresent: boolean;
  error: string | null;
}

const IDLE_SNAPSHOT: GameSnapshot = {
  playerColor: null,
  connection: 'offline',
  fen: START_FEN,
  turn: 'white',
  moves: [],
  opponentPresent: false,
  error: null,
};

export interface MultiplayerGame extends GameSnapshot {
  gameId: string | null;
  isSearching: boolean;
  createGame: () => void;
  findOpponent: () => void;
  cancelSearch: () => void;
  leaveGame: () => void;
  sendMove: (from: string, to: string) => boolean;
}

export function useMultiplayerGame(): MultiplayerGame {
  // A link shared as /multiplayer?gameId=... joins that room instead of creating one.
  const sharedGameId = useSearchParams().get('gameId');

  const [gameId, setGameId] = useState<string | null>(sharedGameId);
  const [snapshot, setSnapshot] = useState<GameSnapshot>(IDLE_SNAPSHOT);
  const [isSearching, setIsSearching] = useState(false);

  const socketRef = useRef<{ gameId: string; socket: WebSocket } | null>(null);
  const matchmakingSocketRef = useRef<WebSocket | null>(null);
  const playerIdRef = useRef<string | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!gameId) return;

    // Strict Mode remounts the effect immediately; cancelling the pending close
    // lets the already-open socket survive instead of burning the second seat.
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    if (socketRef.current?.gameId !== gameId) {
      closeSocket(socketRef.current?.socket);

      const socket = new WebSocket(buildSocketUrl(gameId));
      socketRef.current = { gameId, socket };
      setSnapshot({ ...IDLE_SNAPSHOT, connection: 'connecting' });

      socket.onmessage = (event: MessageEvent<unknown>) => {
        const message = parseServerMessage(event.data);
        if (!message) return;

        if (message.type === 'error' && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: 'state' } satisfies ClientMessage));
        }

        setSnapshot((prev) => {
          switch (message.type) {
            case 'connected':
              return {
                ...prev,
                connection: 'connected',
                playerColor: message.color,
                fen: message.fen,
                turn: colorFromTurn(message.turn),
                // Black is only ever assigned once White holds the room.
                opponentPresent: message.color === 'black',
                error: null,
              };
            case 'state':
              return { ...prev, fen: message.fen, turn: colorFromTurn(message.turn) };
            case 'move':
              return {
                ...prev,
                fen: message.fen,
                turn: colorFromTurn(message.turn),
                moves: [...prev.moves, message.move.san],
                opponentPresent: prev.opponentPresent || message.color !== prev.playerColor,
                error: null,
              };
            case 'error':
              return { ...prev, error: message.message };
          }
        });
      };

      // A refused handshake (room already full) surfaces as an error, a close,
      // or both depending on the client, so treat the first one to arrive as final.
      const handleDisconnect = () => {
        if (socketRef.current?.socket !== socket) return;
        socketRef.current = null;
        setSnapshot((prev) => ({
          ...prev,
          connection: 'offline',
          error: prev.playerColor ? CONNECTION_LOST : JOIN_FAILED,
        }));
      };

      socket.onerror = handleDisconnect;
      socket.onclose = handleDisconnect;
    }

    return () => {
      closeTimerRef.current = window.setTimeout(() => {
        closeTimerRef.current = null;
        const active = socketRef.current;
        socketRef.current = null;
        closeSocket(active?.socket);
      }, 0);
    };
  }, [gameId]);

  useEffect(
    () => () => {
      closeSocket(matchmakingSocketRef.current ?? undefined);
      matchmakingSocketRef.current = null;
    },
    [],
  );

  const createGame = useCallback(() => {
    const id = createGameId();
    syncUrl(id);
    setGameId(id);
  }, []);

  const findOpponent = useCallback(() => {
    if (gameId || matchmakingSocketRef.current) return;

    const playerId = playerIdRef.current ?? crypto.randomUUID();
    playerIdRef.current = playerId;

    const socket = new WebSocket(buildMatchmakingUrl(playerId));
    matchmakingSocketRef.current = socket;
    setSnapshot(IDLE_SNAPSHOT);
    setIsSearching(true);

    socket.onmessage = (event: MessageEvent<unknown>) => {
      if (typeof event.data !== 'string') return;

      let message: unknown;
      try {
        message = JSON.parse(event.data);
      } catch {
        return;
      }

      if (typeof message !== 'object' || message === null || !('type' in message)) return;

      if (
        message.type === 'matched' &&
        'gameId' in message &&
        typeof message.gameId === 'string' &&
        message.gameId
      ) {
        matchmakingSocketRef.current = null;
        closeSocket(socket);
        setIsSearching(false);
        syncUrl(message.gameId);
        setGameId(message.gameId);
      } else if (
        message.type === 'error' &&
        'message' in message &&
        typeof message.message === 'string'
      ) {
        const errorMessage = message.message;
        setSnapshot((prev) => ({ ...prev, error: errorMessage }));
      }
    };

    const handleDisconnect = () => {
      if (matchmakingSocketRef.current !== socket) return;
      matchmakingSocketRef.current = null;
      setIsSearching(false);
      setSnapshot((prev) => ({ ...prev, error: MATCHMAKING_FAILED }));
    };

    socket.onerror = handleDisconnect;
    socket.onclose = handleDisconnect;
  }, [gameId]);

  const cancelSearch = useCallback(() => {
    const socket = matchmakingSocketRef.current;
    matchmakingSocketRef.current = null;

    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'cancel' }));
    }

    closeSocket(socket ?? undefined);
    setIsSearching(false);
  }, []);

  const leaveGame = useCallback(() => {
    closeSocket(socketRef.current?.socket);
    socketRef.current = null;
    syncUrl(null);
    setGameId(null);
    setSnapshot(IDLE_SNAPSHOT);
  }, []);

  const { fen, playerColor, turn } = snapshot;

  const sendMove = useCallback(
    (from: string, to: string) => {
      const active = socketRef.current;
      if (!active || active.socket.readyState !== WebSocket.OPEN) return false;
      if (!playerColor || turn !== playerColor) return false;

      // Apply valid moves immediately; the room response remains authoritative.
      const probe = new Chess(fen);
      let promotion: string | undefined;
      try {
        promotion = probe.move({ from, to, promotion: 'q' }).promotion;
      } catch {
        return false;
      }

      const message: ClientMessage = {
        type: 'move',
        move: { from, to, ...(promotion ? { promotion } : {}) },
      };

      active.socket.send(JSON.stringify(message));
      setSnapshot((prev) => ({
        ...prev,
        fen: probe.fen(),
        turn: colorFromTurn(probe.turn()),
        error: null,
      }));
      return true;
    },
    [fen, playerColor, turn],
  );

  return {
    ...snapshot,
    gameId,
    isSearching,
    createGame,
    findOpponent,
    cancelSearch,
    leaveGame,
    sendMove,
  };
}
