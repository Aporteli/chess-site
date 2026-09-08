import { Chess } from "chess.js";
import { listEndgames } from "./catalog";
import { makeCard, upsertCard } from "./deck";
import { isLegalChessFen } from "./fen-legal";
import { registerEndgameFromFen } from "./kinds";
import { pieceCount } from "./pieces";
import { fetchTablebase, tablebaseLines, tablebaseScore } from "./tablebase";
import { haltEngine } from "@/stores/runtime";
import { useTablebaseStore } from "@/stores/tablebase-store";

export async function handlePositionLoaded(loadedFen: string): Promise<boolean> {
  let game: Chess;
  try {
    game = new Chess(loadedFen);
  } catch {
    return false;
  }
  const kind = registerEndgameFromFen(game.fen());
  if (!kind) {
    useTablebaseStore
      .getState()
      .setError("Could not read both kings from that diagram");
    return false;
  }
  const store = useTablebaseStore.getState();
  const nextCatalog = listEndgames();
  const idx = Math.max(0, nextCatalog.findIndex((e) => e.id === kind));
  store.setCatalog(nextCatalog);
  store.setIndex(idx);
  haltEngine();
  store.commitFen(game.fen());

  const scannedFen = game.fen();
  const turn = game.turn();
  let snapEval: number | null = null;
  let snapMove: string | null = null;
  let tbLines = tablebaseLines([], turn);
  if (pieceCount(scannedFen) <= 7 && isLegalChessFen(scannedFen)) {
    try {
      const ac = new AbortController();
      const timer = window.setTimeout(() => ac.abort(), 6000);
      const data = await fetchTablebase(scannedFen, ac.signal);
      window.clearTimeout(timer);
      if (data.category) {
        store.setResult(data, scannedFen);
        snapEval = tablebaseScore(data.category, turn);
        snapMove = data.moves?.[0]?.uci ?? null;
        tbLines = tablebaseLines(data.moves, turn);
      }
    } catch {
      /* engine still fills variations */
    }
  }
  const card = makeCard({
    fen: scannedFen,
    kind,
    evaluation: snapEval,
    bestMove: snapMove,
    depth: 0,
    lines: tbLines,
  });
  const nextDeck = upsertCard(useTablebaseStore.getState().deck, card);
  const stored = nextDeck.cards.find((c) => c.fen === scannedFen) ?? card;
  useTablebaseStore.setState({ deck: nextDeck, activeCard: stored });
  return true;
}
