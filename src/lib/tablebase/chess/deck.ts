import { DECK_KEY, WIN_EVAL } from "./constants";
import { uid } from "./ids";
import { hydrateCustomKinds, isEndgameKind } from "./kinds";
import type { EndgameCard, EndgameDeck, EndgameKind, EngineLine } from "./types";

export function emptyDeck(name = "Endgame deck"): EndgameDeck {
  return {
    id: uid("deck"),
    name,
    cards: [],
    cursor: 0,
    updatedAt: Date.now(),
  };
}

export function loadDeck(): EndgameDeck {
  if (typeof window === "undefined") return emptyDeck();
  hydrateCustomKinds();
  try {
    const raw = window.localStorage.getItem(DECK_KEY);
    if (!raw) return emptyDeck();
    const parsed = JSON.parse(raw) as EndgameDeck;
    if (!parsed?.id || !Array.isArray(parsed.cards)) return emptyDeck();
    return {
      ...emptyDeck(parsed.name),
      ...parsed,
      cards: parsed.cards.filter(
        (c) => typeof c?.fen === "string" && isEndgameKind(c.kind),
      ),
      cursor: Math.max(0, parsed.cursor ?? 0),
    };
  } catch {
    return emptyDeck();
  }
}

export function saveDeck(deck: EndgameDeck) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      DECK_KEY,
      JSON.stringify({ ...deck, updatedAt: Date.now() }),
    );
  } catch {
    /* quota / private mode */
  }
}

export function makeCard(input: {
  fen: string;
  kind: EndgameKind;
  evaluation: number | null;
  bestMove: string | null;
  depth: number;
  lines: EngineLine[];
}): EndgameCard {
  return {
    id: uid("card"),
    fen: input.fen,
    kind: input.kind,
    evaluation: input.evaluation,
    bestMove: input.bestMove,
    depth: input.depth,
    lines: input.lines.map((line) => ({ ...line })),
    createdAt: Date.now(),
  };
}

export function upsertCard(deck: EndgameDeck, card: EndgameCard): EndgameDeck {
  const existing = deck.cards.findIndex((c) => c.fen === card.fen);
  const cards =
    existing >= 0
      ? deck.cards.map((c, i) =>
          i === existing ? { ...c, ...card, id: c.id } : c,
        )
      : [...deck.cards, card];
  const cursor = existing >= 0 ? existing : cards.length - 1;
  const next = { ...deck, cards, cursor, updatedAt: Date.now() };
  saveDeck(next);
  return next;
}

export function removeCard(deck: EndgameDeck, cardId: string): EndgameDeck {
  const cards = deck.cards.filter((c) => c.id !== cardId);
  const cursor = Math.min(deck.cursor, Math.max(0, cards.length - 1));
  const next = { ...deck, cards, cursor, updatedAt: Date.now() };
  saveDeck(next);
  return next;
}

export function removeCardsByKind(
  deck: EndgameDeck,
  kind: EndgameKind,
): EndgameDeck {
  const cards = deck.cards.filter((c) => c.kind !== kind);
  const cursor = Math.min(deck.cursor, Math.max(0, cards.length - 1));
  const next = { ...deck, cards, cursor, updatedAt: Date.now() };
  saveDeck(next);
  return next;
}

export function removeAllCards(deck: EndgameDeck): EndgameDeck {
  const next = { ...deck, cards: [], cursor: 0, updatedAt: Date.now() };
  saveDeck(next);
  return next;
}

export function isWinningEval(evaluation: number | null): boolean {
  return evaluation != null && Math.abs(evaluation) >= WIN_EVAL;
}
