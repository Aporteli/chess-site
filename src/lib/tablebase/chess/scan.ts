import { Chess } from "chess.js";
import { listEndgames } from "./catalog";
import { makeCard, upsertCard } from "./deck";
import { isLegalChessFen } from "./fen-legal";
import { registerEndgameFromFen } from "./kinds";
import { pieceCount } from "./pieces";
import { fetchTablebase, tablebaseLines, tablebaseScore } from "./tablebase";
import { haltEngine } from "@/stores/runtime";
import { useTablebaseStore } from "@/stores/tablebase-store";

export async function handlePositionLoaded(
  loadedFen: string,
  sideToMove: "w" | "b" = "w",
): Promise<boolean> {
  let game: Chess;
  try {
    // If the input FEN doesn't specify side to move or we want to override it, or if it's already complete:
    // Let's parse or modify the turn if needed, or let chess.js handle it.
    // Actually chess.js constructor takes a FEN string. If it's a raw piece placement (e.g. 8/8/4k3/8/8/4K3),
    // chess.js defaults to 'w'. Let's ensure we can set the turn explicitly if requested.
    let fenToTest = loadedFen.trim();
    const parts = fenToTest.split(/\s+/);
    if (parts.length === 1) {
      fenToTest = `${parts[0]} ${sideToMove} - - 0 1`;
    } else if (parts.length >= 2) {
      parts[1] = sideToMove;
      fenToTest = parts.join(" ");
    }
    game = new Chess(fenToTest);
  } catch {
    // Fallback try raw loadedFen
    try {
      game = new Chess(loadedFen);
    } catch {
      return false;
    }
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
  const idx = Math.max(
    0,
    nextCatalog.findIndex((e) => e.id === kind),
  );
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
