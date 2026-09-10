"use client";

import { useMemo } from "react";
import { endgameIcons } from "@/lib/tablebase/chess/catalog";
import { selectedKindOf, useTablebaseStore } from "@/stores/tablebase-store";
import { VariationsHeader } from "./VariationsHeader";
import { VariationsActions } from "./VariationsActions";
import { VariationsList } from "./VariationsList";

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
  const typed = useMemo(() => cards.filter((c: any) => c.kind === kind), [cards, kind]);

  const pipelineLabel =
    pipeline === "idle"
      ? `${typed.length} ${endgameIcons(kind)} in deck`
      : PIPELINE_COPY[pipeline as keyof typeof PIPELINE_COPY];

  return (
    <div className="flex min-h-0 max-h-56 flex-col gap-2 overflow-hidden rounded-xl bg-surface p-3 shadow-[var(--shadow-border)] xl:max-h-[32%]">
      <VariationsHeader
        pipelineLabel={pipelineLabel}
        building={building}
        hasTyped={typed.length > 0}
      />

      <VariationsActions
        building={building}
        loading={loading}
        fenValid={fenValid}
        fen={fen}
        error={error}
      />

      <div
        className="min-h-0 flex-1 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-[7px] [&::-webkit-scrollbar]:bg-surface [&::-webkit-scrollbar-thumb]:bg-hint [&::-webkit-scrollbar-thumb]:rounded-[6px] [&::-webkit-scrollbar-thumb]:min-h-[36px] hover:[&::-webkit-scrollbar-thumb]:bg-accent"
        style={{ scrollbarWidth: "thin", scrollbarColor: "var(--color-hint) var(--color-surface)" }}
      >
        <VariationsList
          typed={typed}
          cards={cards}
          activeId={activeId}
          building={building}
          kind={kind}
        />
      </div>
    </div>
  );
}