import { useState, useEffect, useMemo, useCallback } from "react";
import { loadDeck, saveDeck } from "@/lib/tablebase/deck-store";
import type { EndgameCard, EndgameDeck } from "@/lib/tablebase/types";

export function useEndgameDeck(
  selectedKind: string,
  commitFen: (fen: string) => boolean,
) {
  const [deck, setDeck] = useState<EndgameDeck>(() => ({
    id: "deck",
    name: "Endgame deck",
    cards: [],
    cursor: 0,
    updatedAt: 0,
  }));
  const [activeCard, setActiveCard] = useState<EndgameCard | null>(null);

  useEffect(() => {
    const stored = loadDeck();
    setDeck(stored);
    const card = stored.cards[stored.cursor];
    if (card) {
      setActiveCard(card);
      commitFen(card.fen);
    }
  }, [commitFen]);

  const typedCards = useMemo(
    () => deck.cards.filter((card) => card.kind === selectedKind),
    [deck.cards, selectedKind],
  );

  const loadCard = useCallback(
    (card: EndgameCard, index: number) => {
      setActiveCard(card);
      commitFen(card.fen);
      setDeck((prev) => {
        const next = { ...prev, cursor: index, updatedAt: Date.now() };
        saveDeck(next);
        return next;
      });
    },
    [commitFen],
  );

  return {
    deck,
    setDeck,
    activeCard,
    setActiveCard,
    typedCards,
    loadCard,
  };
}