import { useEffect } from 'react';
import { Chess } from 'chess.js';
import { useStockfishEngine } from '@/components/stockfish/StockfishContext';
import { useAnalysisStore } from './store/analysis-store';

type SavedPlayResponse = { play?: { pgn?: string; startFen?: string } };

export function useLoadSavedPlay() {
  const engine = useStockfishEngine();

  useEffect(() => {
    const initialFen = useAnalysisStore.getState().fen;
    const playId = new URLSearchParams(window.location.search).get('play');

    if (!playId) {
      engine.evaluatePosition(initialFen);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch(`/api/plays?id=${encodeURIComponent(playId)}`);
        const data = (await response.json().catch(() => null)) as SavedPlayResponse | null;

        if (cancelled || !response.ok || !data?.play) {
          engine.evaluatePosition(initialFen);
          return;
        }

        const loaded = new Chess(data.play.startFen || undefined);
        if (data.play.pgn) loaded.loadPgn(data.play.pgn);

        useAnalysisStore.setState({
          game: loaded,
          fen: loaded.fen(),
          history: loaded.history(),
          undoneMoves: [],
          arrows: [],
          startFen: data.play.startFen || loaded.fen(),
          revision: useAnalysisStore.getState().revision + 1,
        });

        engine.evaluatePosition(loaded.fen());
      } catch {
        if (!cancelled) engine.evaluatePosition(initialFen);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [engine.evaluatePosition]);
}
