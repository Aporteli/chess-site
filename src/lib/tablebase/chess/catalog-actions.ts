import { START_FEN, endgameIcons, listEndgames } from "./catalog";
import { removeAllCards, removeCard, removeCardsByKind } from "./deck";
import {
  removeAllEndgameKinds,
  removeEndgameKind,
} from "./kinds";
import { haltEngine } from "@/stores/runtime";
import {
  selectedKindOf,
  typedCardsOf,
  useTablebaseStore,
} from "@/stores/tablebase-store";
import { loadCard } from "./card-nav";
import type { EndgameDeck, EndgameKind } from "./types";

function revealKind(kind: EndgameKind, nextDeck: EndgameDeck) {
  const store = useTablebaseStore.getState();
  const nextCatalog = listEndgames();
  store.setCatalog(nextCatalog);
  const idx = nextCatalog.findIndex((e) => e.id === kind);
  const entry = idx >= 0 ? nextCatalog[idx] : nextCatalog[0];
  store.setIndex(Math.max(0, idx));
  const existing = entry
    ? nextDeck.cards.filter((c) => c.kind === entry.id)
    : [];
  if (existing[0]) {
    loadCard(
      existing[0],
      nextDeck.cards.findIndex((c) => c.id === existing[0]!.id),
    );
    return;
  }
  store.setActiveCard(null);
  haltEngine();
  store.commitFen(entry?.fen ?? START_FEN);
}

export function askConfirm(
  title: string,
  body: string,
  run: () => void,
  confirmLabel?: string,
) {
  const store = useTablebaseStore.getState();
  if (store.pipeline !== "idle") return;
  store.setConfirm({ title, body, confirmLabel, run });
}

export function deleteKind(kind: EndgameKind) {
  const label = endgameIcons(kind);
  askConfirm(
    "Delete this type?",
    `${label} and every variation stored under it will be removed.`,
    () => {
      const store = useTablebaseStore.getState();
      removeEndgameKind(kind);
      const nextDeck = removeCardsByKind(store.deck, kind);
      store.setDeck(nextDeck);
      const nextCatalog = listEndgames();
      if (selectedKindOf(store) === kind) {
        revealKind(nextCatalog[0]?.id ?? "KP_K", nextDeck);
        return;
      }
      store.setCatalog(nextCatalog);
    },
  );
}

export function deleteAllKinds() {
  const store = useTablebaseStore.getState();
  if (store.catalog.length === 0) return;
  askConfirm(
    "Delete all types?",
    "Every endgame type and all of their variations will be removed.",
    () => {
      removeAllEndgameKinds();
      const nextDeck = removeAllCards(useTablebaseStore.getState().deck);
      const s = useTablebaseStore.getState();
      s.setDeck(nextDeck);
      s.setCatalog([]);
      s.setIndex(0);
      s.setActiveCard(null);
      haltEngine();
      s.commitFen(START_FEN);
    },
    "Delete all",
  );
}

export function deleteVariation(cardId: string) {
  askConfirm(
    "Delete this variation?",
    "This position will be removed from the list.",
    () => {
      const store = useTablebaseStore.getState();
      const nextDeck = removeCard(store.deck, cardId);
      store.setDeck(nextDeck);
      if (store.activeCard?.id !== cardId) return;
      const remaining = nextDeck.cards.filter(
        (c) => c.kind === selectedKindOf(store),
      );
      if (remaining[0]) {
        loadCard(
          remaining[0],
          nextDeck.cards.findIndex((c) => c.id === remaining[0]!.id),
        );
        return;
      }
      store.setActiveCard(null);
      haltEngine();
      store.commitFen(store.catalog[store.endgameIndex]?.fen ?? START_FEN);
    },
  );
}

export function deleteAllVariations() {
  const store = useTablebaseStore.getState();
  const typed = typedCardsOf(store);
  if (typed.length === 0) return;
  const kind = selectedKindOf(store);
  askConfirm(
    "Delete all variations?",
    `All ${typed.length} variation${typed.length === 1 ? "" : "s"} for ${endgameIcons(kind)} will be removed.`,
    () => {
      const s = useTablebaseStore.getState();
      const nextDeck = removeCardsByKind(s.deck, kind);
      s.setDeck(nextDeck);
      s.setActiveCard(null);
      haltEngine();
      s.commitFen(s.catalog[s.endgameIndex]?.fen ?? START_FEN);
    },
    "Delete all",
  );
}
