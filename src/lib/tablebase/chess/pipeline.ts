import { fenMatchesKind, isLegalPlayableFen } from "./fen-legal";
import { generateEndgameFen } from "./generate";
import { isWinningEval, makeCard, saveDeck, upsertCard } from "./deck";
import { fetchTablebase, tablebaseScore } from "./tablebase";
import type { EndgameCard, EndgameDeck, EndgameKind } from "./types";
import { haltEngine, runtime } from "@/stores/runtime";
import { selectedKindOf, useTablebaseStore } from "@/stores/tablebase-store";

export async function startPipeline(
  count: number,
  playWhenDone: boolean,
  kind?: EndgameKind,
) {
  const seq = ++runtime.fillSeq;
  haltEngine();
  const store = useTablebaseStore.getState();
  const selected = kind ?? selectedKindOf(store);
  store.setError(null);
  store.setPipeline("generate");

  const seen = new Set(
    store.deck.cards.filter((c) => c.kind === selected).map((c) => c.fen),
  );
  let remaining = Math.max(1, count);
  let last: { card: EndgameCard; deck: EndgameDeck } | null = null;

  while (remaining > 0) {
    if (seq !== runtime.fillSeq) return;
    let stored = false;
    for (let tries = 0; tries < 12; tries++) {
      if (seq !== runtime.fillSeq) return;
      store.setPipeline("generate");
      const nextFen = generateEndgameFen(selected, seen);
      if (!nextFen) break;
      seen.add(nextFen);
      store.setPipeline("legal");
      if (!isLegalPlayableFen(nextFen) || !fenMatchesKind(nextFen, selected)) {
        continue;
      }
      store.commitFen(nextFen);
      store.setPipeline("analyze");
      let snapEval: number | null = null;
      let snapMove: string | null = null;
      try {
        const ac = new AbortController();
        const timer = window.setTimeout(() => ac.abort(), 6000);
        const data = await fetchTablebase(nextFen, ac.signal);
        window.clearTimeout(timer);
        if (data.category) {
          snapEval = tablebaseScore(data.category, "w");
          snapMove = data.moves?.[0]?.uci ?? null;
        }
      } catch {
        /* keep generating even if tablebase is down */
      }
      if (!isWinningEval(snapEval) && tries < 11) continue;
      store.setPipeline("store");
      const card = makeCard({
        fen: nextFen,
        kind: selected,
        evaluation: snapEval,
        bestMove: snapMove,
        depth: 0,
        lines: [],
      });
      const nextDeck = upsertCard(useTablebaseStore.getState().deck, card);
      store.setDeck(nextDeck);
      last = { card, deck: nextDeck };
      remaining -= 1;
      stored = true;
      break;
    }
    if (!stored) {
      store.setError(`Could not find a legal ${selected} position`);
      break;
    }
  }

  if (seq !== runtime.fillSeq) return;
  store.setPipeline("idle");
  if (playWhenDone && last) {
    const cardIndex = last.deck.cards.findIndex((c) => c.fen === last.card.fen);
    const card = last.deck.cards[cardIndex] ?? last.card;
    const s = useTablebaseStore.getState();
    haltEngine();
    const idx = Math.max(0, s.catalog.findIndex((e) => e.id === card.kind));
    const cursor = Math.max(0, cardIndex);
    const deck = { ...last.deck, cursor, updatedAt: Date.now() };
    saveDeck(deck);
    useTablebaseStore.setState({ activeCard: card, endgameIndex: idx, deck });
    s.commitFen(card.fen);
  }
}
