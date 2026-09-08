import {
  addSanMove,
  getNode,
  isOurTurn,
  needsPromotion,
  pathToNode,
  playMove,
  playSfx,
  sfxForMove,
} from '@/lib/chess';
import { deriveActive } from './deriveActive';
import type { MoveActions, TrainerSlice } from './types';

export const createMoveSlice: TrainerSlice<MoveActions> = (set, get) => ({
  playUserMove: (from, to, promotion) => {
    const { chapter, node, repertoire } = deriveActive(get());
    const { mode, drill, path, settings } = get();
    if (!chapter || !node || !repertoire) return false;

    if (needsPromotion(node.fen, from, to) && !promotion) {
      set({ promotion: { from, to } });
      return false;
    }

    if (mode === 'drill' && drill?.opponentThinking) {
      set({ premove: { from, to, promotion }, selectedSquare: null });
      return false;
    }

    let played;
    try {
      played = playMove(node.fen, from, to, promotion);
    } catch {
      return false;
    }

    const existing = node.children.map((id) => getNode(chapter, id)).find((c) => c.move?.san === played.san);

    if (mode === 'study') {
      playSfx(
        sfxForMove({
          capture: played.isCapture(),
          castle: played.isKingsideCastle() ? 'k' : played.isQueensideCastle() ? 'q' : null,
          check: played.san.includes('+') || played.san.includes('#'),
          mate: played.san.includes('#'),
          promotion: played.isPromotion(),
        }),
        settings.sound,
      );
      if (existing) {
        set({ path: [...path, existing.id] });
      } else {
        const added = addSanMove(chapter, node.id, played.san);
        get().updateChapter(added.chapter, [...path, added.node.id]);
      }
      set({ selectedSquare: null, promotion: null });
      return true;
    }

    if (!drill || drill.lineComplete) return false;
    if (!isOurTurn(node.fen, repertoire.side)) return false;

    if (!existing) {
      playSfx('error', settings.sound);
      get().flashStatus('mistake');
      set({ drill: { ...drill, mistakes: drill.mistakes + 1, awaitingRetry: true }, selectedSquare: null });
      return false;
    }

    playSfx('success', settings.sound);
    get().flashStatus('correct');
    set({ path: pathToNode(chapter, existing.id), selectedSquare: null, promotion: null });

    const nextSession = { ...drill, awaitingRetry: false };
    set({ drill: nextSession });

    if (existing.children.length === 0) {
      get().finishPractice(nextSession, pathToNode(chapter, existing.id));
    } else {
      get().scheduleOpponent(existing.id, nextSession);
    }
    return true;
  },

  completePromotion: (piece) => {
    const { promotion } = get();
    if (!promotion) return;
    get().playUserMove(promotion.from, promotion.to, piece);
  },

  cancelPromotion: () => set({ promotion: null }),
});
