import { armEngineReply } from './engine-reply';
import { haltEngine, runtime } from '@/stores/runtime';
import { useSettingsStore } from '@/stores/settings-store';
import { useTablebaseStore } from '@/stores/tablebase-store';
import {
  performHint,
  performPieceDrop,
  performPlayUcis,
  performReset,
  type BoardAdapter,
} from '@/lib/chess/board-adapter';

function tablebaseAdapter(): BoardAdapter {
  const store = useTablebaseStore.getState();
  const settings = useSettingsStore.getState();

  return {
    getFen: () => store.fen,
    getHumanColor: () => (settings.flipped ? 'b' : 'w'),
    isBusy: () => store.pipeline !== 'idle',
    isGameOver: () => Boolean(store.gameOver),

    getExistingHint: () =>
      store.result?.moves?.[0]?.uci ?? store.localLines[0]?.uci ?? null,
    setHintUci: (uci) => store.setHintUci(uci),

    getResetFen: () =>
      store.activeCard?.fen ??
      store.catalog[store.endgameIndex]?.fen ??
      store.fen,
    commitFen: (fen) => store.commitFen(fen),
    applyPlayedFen: (fen, uci) => store.applyPlayedFen(fen, uci),
    setGameOver: (reason) => useTablebaseStore.setState({ gameOver: reason }),

    armEngineReply: (fen) => armEngineReply(fen),

    onBeforeMove: () => {
      runtime.hintPending = false;
      runtime.hintFen = null;
    },
    onBeforeReset: () => haltEngine(),

    soundEnabled: () => settings.sound,
  };
}

export function handleHint(): void {
  performHint(tablebaseAdapter());
}

export function handleReset(): void {
  performReset(tablebaseAdapter());
}

export function handlePieceDrop(args: {
  sourceSquare: string;
  targetSquare: string | null;
}): boolean {
  return performPieceDrop(tablebaseAdapter(), args);
}

export function playUcis(ucis: string[]): boolean {
  return performPlayUcis(tablebaseAdapter(), ucis);
}