"use client";

import { useMemo } from "react";
import { Trash2 } from "lucide-react";
import { fillDeck, handleNext, loadCard } from "@/lib/tablebase/chess/card-nav";
import {
  deleteAllVariations,
  deleteVariation,
} from "@/lib/tablebase/chess/catalog-actions";
import { endgameIcons } from "@/lib/tablebase/chess/catalog";
import { lookupTablebase } from "@/lib/tablebase/chess/lookup";
import { Button } from "@/components/tablebase/ui/button";
import { selectedKindOf, useTablebaseStore } from "@/stores/tablebase-store";

const PIPELINE_COPY = {
  generate: "Generating position…",
  legal: "Checking legality…",
  analyze: "Looking up tablebase…",
  store: "Saving to deck…",
} as const;

export function VariationsPanel() {
  const pipeline = useTablebaseStore((s) => s.pipeline);
  const cards = useTablebaseStore((s) => s.deck.cards);
  const activeId = useTablebaseStore((s) => s.activeCard?.id ?? null);
  const error = useTablebaseStore((s) => s.error);
  const loading = useTablebaseStore((s) => s.loading);
  const fenValid = useTablebaseStore((s) => s.fenValid);
  const fen = useTablebaseStore((s) => s.fen);
  const kind = useTablebaseStore(selectedKindOf);
  const building = pipeline !== "idle";
  const typed = useMemo(
    () => cards.filter((c: any) => c.kind === kind),
    [cards, kind],
  );

  const pipelineLabel =
    pipeline === "idle"
      ? `${typed.length} ${endgameIcons(kind)} in deck`
      : PIPELINE_COPY[pipeline as keyof typeof PIPELINE_COPY];

  return (
    <div className="flex min-h-0 max-h-56 flex-col gap-2 overflow-hidden rounded-xl bg-surface p-3 shadow-[var(--shadow-border)] xl:max-h-[32%]">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-base text-fg">Variations</h2>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-2xs text-muted">{pipelineLabel}</span>
          <Button
            size="tiny"
            variant="danger"
            disabled={building || typed.length === 0}
            aria-label="Delete all variations"
            onClick={() => deleteAllVariations()}
          >
            <Trash2 className="size-3" />
            All
          </Button>
        </div>
      </div>
      <div className="flex gap-1.5">
        <Button
          variant="gold"
          size="sm"
          className="flex-1"
          disabled={building}
          onClick={() => handleNext()}
        >
          {building ? "Working…" : "Next"}
        </Button>
        <Button
          size="sm"
          className="flex-1"
          disabled={building}
          onClick={() => fillDeck()}
        >
          Fill deck
        </Button>
      </div>
      <Button
        size="sm"
        disabled={loading || !fenValid || building}
        onClick={() => {
          if (!fenValid) {
            useTablebaseStore.getState().setError("Invalid FEN");
            return;
          }
          void lookupTablebase(fen);
        }}
      >
        {loading ? "Looking up…" : "Refresh tablebase"}
      </Button>
      {error && <p className="text-micro text-danger">{error}</p>}
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {typed.length === 0 ? (
          <p className="text-micro italic text-muted">
            No {endgameIcons(kind)} cards yet. Choose a type to generate one.
          </p>
        ) : (
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
        )}
      </div>
    </div>
  );
}
