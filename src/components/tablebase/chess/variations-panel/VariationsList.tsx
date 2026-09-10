"use client";

import { Trash2 } from "lucide-react";
import { loadCard } from "@/lib/tablebase/chess/card-nav";
import { deleteVariation } from "@/lib/tablebase/chess/catalog-actions";
import { endgameIcons } from "@/lib/tablebase/chess/catalog";

interface VariationsListProps {
  typed: any[];
  cards: any[];
  activeId: string | null;
  building: boolean;
  kind: string;
}

export function VariationsList({ typed, cards, activeId, building, kind }: VariationsListProps) {
  if (typed.length === 0) {
    return (
      <p className="text-micro italic text-muted">
        No {endgameIcons(kind)} cards yet. Choose a type to generate one.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-1">
      {typed.map((card: any, i: number) => (
        <li key={card.id} className="flex items-center gap-1">
          <button
            type="button"
            disabled={building}
            onClick={() =>
              loadCard(
                card,
                cards.findIndex((c: any) => c.id === card.id) as number,
              )
            }
            className={`flex min-h-11 min-w-0 flex-1 items-center justify-between rounded-sm px-2 text-left font-mono text-2xs disabled:opacity-50 ${
              activeId === card.id
                ? "text-accent shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-accent)_55%,transparent)]"
                : "text-muted shadow-[var(--shadow-border)]"
            }`}
          >
            <span>
              {i + 1}. {endgameIcons(card.kind)}
            </span>
            <span className="tabular-nums">
              {card.evaluation == null
                ? "—"
                : card.evaluation > 0
                  ? `+${card.evaluation.toFixed(2)}`
                  : card.evaluation.toFixed(2)}
            </span>
          </button>
          <button
            type="button"
            aria-label="Delete variation"
            disabled={building}
            onClick={() => deleteVariation(card.id)}
            className="grid size-11 shrink-0 place-items-center rounded-sm text-subtle hover:text-danger disabled:opacity-40"
          >
            <Trash2 className="size-3.5" />
          </button>
        </li>
      ))}
    </ul>
  );
}