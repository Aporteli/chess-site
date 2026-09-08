import { DECK_BATCH } from "./constants";
import { saveDeck } from "./deck";
import { haltEngine } from "@/stores/runtime";
import {
  selectedKindOf,
  typedCardsOf,
  useTablebaseStore,
} from "@/stores/tablebase-store";
import type { EndgameCard } from "./types";
import { startPipeline } from "./pipeline";

export function loadCard(card: EndgameCard, index: number) {
  const store = useTablebaseStore.getState();
  const idx = Math.max(
    0,
    store.catalog.findIndex((e) => e.id === card.kind),
  );
  haltEngine();
  useTablebaseStore.setState({
    activeCard: card,
    endgameIndex: idx,
  });
  store.commitFen(card.fen);
  const next = { ...store.deck, cursor: index, updatedAt: Date.now() };
  saveDeck(next);
  store.setDeck(next);
}

export function loadEndgame(index: number) {
  const store = useTablebaseStore.getState();
  if (store.pipeline !== "idle" || store.catalog.length === 0) return;
  const next =
    ((index % store.catalog.length) + store.catalog.length) %
    store.catalog.length;
  const kind = store.catalog[next]!.id;
  haltEngine();
  store.setIndex(next);
  const existing = store.deck.cards.filter((c) => c.kind === kind);
  if (existing[0]) {
    loadCard(
      existing[0],
      store.deck.cards.findIndex((c) => c.id === existing[0]!.id),
    );
    return;
  }
  store.setActiveCard(null);
  store.commitFen(store.catalog[next]!.fen);
  void startPipeline(1, true, kind);
}

export function handleNext() {
  const store = useTablebaseStore.getState();
  if (store.pipeline !== "idle") return;
  const typed = typedCardsOf(store);
  const idx = typed.findIndex((c) => c.id === store.activeCard?.id);
  const queued = typed[idx + 1] ?? typed[0];
  if (queued) {
    loadCard(
      queued,
      store.deck.cards.findIndex((c) => c.id === queued.id),
    );
    return;
  }
  void startPipeline(1, true, selectedKindOf(store));
}

export function fillDeck() {
  const store = useTablebaseStore.getState();
  if (store.pipeline !== "idle") return;
  void startPipeline(DECK_BATCH, false, selectedKindOf(store));
}
