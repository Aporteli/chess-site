import { useEffect } from "react";
import { listEndgames } from "@/lib/tablebase/chess/catalog";
import { loadDeck } from "@/lib/tablebase/chess/deck";
import { hydrateCustomKinds } from "@/lib/tablebase/chess/kinds";
import { useTablebaseStore } from "@/stores/tablebase-store";

export function useHydrate() {
  const commitFen = useTablebaseStore((s) => s.commitFen);

  useEffect(() => {
    hydrateCustomKinds();
    const stored = loadDeck();
    const catalog = listEndgames();
    const idx = Math.min(stored.cursor, Math.max(0, stored.cards.length - 1));
    const card = stored.cards[idx];
    useTablebaseStore.setState({
      catalog,
      deck: stored,
      activeCard: card ?? null,
      endgameIndex: card
        ? Math.max(0, catalog.findIndex((e) => e.id === card.kind))
        : 0,
    });
    if (card) commitFen(card.fen);
  }, [commitFen]);
}
