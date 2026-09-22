'use client';

import { useMemo } from 'react';
import { Chess } from 'chess.js';
import type { BroadcastGame } from '../types';

export function useChessPosition(
  selectedGame: BroadcastGame | undefined,
  moveIndex: number
) {
  return useMemo(() => {
    const chess = new Chess();

    if (!selectedGame) {
      return chess.fen();
    }

    const moves = selectedGame.moves.slice(0, moveIndex + 1);

    for (const move of moves) {
      try {
        chess.move(move);
      } catch (err) {
        console.warn('Could not apply broadcast move:', move, err);
        break;
      }
    }

    return chess.fen();
  }, [selectedGame, moveIndex]);
}

export function useChessClocks(
  selectedGame: BroadcastGame | undefined,
  moveIndex: number
) {
  return useMemo(() => {
    if (!selectedGame?.clocks) {
      return { white: undefined, black: undefined };
    }

    if (moveIndex < 0) {
      return { white: undefined, black: undefined };
    }

    if (moveIndex % 2 === 0) {
      return {
        white: selectedGame.clocks[moveIndex],
        black: moveIndex > 0 ? selectedGame.clocks[moveIndex - 1] : undefined,
      };
    }

    return {
      white: moveIndex > 0 ? selectedGame.clocks[moveIndex - 1] : undefined,
      black: selectedGame.clocks[moveIndex],
    };
  }, [selectedGame, moveIndex]);
}