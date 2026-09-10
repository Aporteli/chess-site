import { ENDGAMES } from "@/lib/tablebase/chess/catalog";
import type { TablebaseState } from "./types";

export function selectedKindOf(s: TablebaseState): string {
  return s.catalog[s.endgameIndex]?.id ?? s.catalog[0]?.id ?? ENDGAMES[0]!.id;
}

export function typedCardsOf(s: TablebaseState) {
  const kind = selectedKindOf(s);
  return s.deck.cards.filter((c) => c.kind === kind);
}

export function humanColorOf(s: TablebaseState): "w" | "b" {
  return s.flipped ? "b" : "w";
}
