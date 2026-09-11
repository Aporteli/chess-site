//CUT: შესამცირებელი ფაილი

"use client";

import { useState } from "react";
import { ChevronDown, GitBranch, Trash2, RefreshCw, Check, Loader2 } from "lucide-react";
import { endgameIcons } from "@/lib/tablebase/chess/catalog";
import { fillDeck, handleNext, loadCard } from "@/lib/tablebase/chess/card-nav";
import { deleteAllVariations, deleteVariation } from "@/lib/tablebase/chess/catalog-actions";
import { lookupTablebase } from "@/lib/tablebase/chess/lookup";
import { selectedKindOf, useTablebaseStore } from "@/stores/tablebase-store";

const PIPELINE_COPY = {
  generate: "Generating...",
  legal: "Checking...",
  analyze: "Analyzing...",
  store: "Saving...",
} as const;

export function VariationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const pipeline = useTablebaseStore((s) => s.pipeline);
  const cards = useTablebaseStore((s) => s.deck.cards);
  const activeId = useTablebaseStore((s) => s.activeCard?.id ?? null);
  const error = useTablebaseStore((s) => s.error);
  const loading = useTablebaseStore((s) => s.loading);
  const fenValid = useTablebaseStore((s) => s.fenValid);
  const fen = useTablebaseStore((s) => s.fen);
  const kind = useTablebaseStore(selectedKindOf);

  const building = pipeline !== "idle";
  const typed = cards.filter((c: any) => c.kind === kind);

  const pipelineLabel =
    pipeline === "idle"
      ? `${typed.length} ${endgameIcons(kind)}`
      : PIPELINE_COPY[pipeline as keyof typeof PIPELINE_COPY];

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* 1. Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex h-8 items-center gap-2 rounded-md border px-2.5 font-mono text-xs transition-all duration-150 ${
          isOpen
            ? "border-accent/50 bg-accent/10 text-fg shadow-sm"
            : "border-border-subtle bg-surface text-muted hover:border-fg/20 hover:text-fg"
        }`}
      >
        <GitBranch className="size-3.5 text-accent/80" />
        <span className="font-semibold">Variations</span>
        <span className="rounded bg-elevated px-1.5 py-0.5 text-3xs font-medium text-subtle">
          {pipelineLabel}
        </span>
        <ChevronDown
          className={`size-3 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-fg" : "text-subtle"
          }`}
        />
      </button>

      {/* 2. Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-0 top-full z-50 pt-1 w-72 animate-in fade-in-0 slide-in-from-top-1 duration-100">
          <div className="flex flex-col overflow-hidden rounded-lg border border-border-subtle bg-bg-surface shadow-2xl">
            
            {/* Quick Actions Header */}
            <div className="flex flex-col gap-1.5 border-b border-border-subtle bg-surface/40 p-2">
              <div className="flex gap-1.5">
                <button
                  type="button"
                  disabled={building}
                  onClick={() => handleNext()}
                  className="flex h-7 flex-1 items-center justify-center rounded bg-accent/15 font-mono text-3xs font-medium text-accent hover:bg-accent/25 disabled:opacity-50 transition-colors"
                >
                  {building ? <Loader2 className="size-3 animate-spin" /> : "Next Card"}
                </button>
                
                <button
                  type="button"
                  disabled={building}
                  onClick={() => fillDeck()}
                  className="flex h-7 flex-1 items-center justify-center rounded bg-elevated font-mono text-3xs text-fg/80 hover:bg-elevated/80 hover:text-fg disabled:opacity-50 transition-colors"
                >
                  Fill Deck
                </button>
              </div>

              <button
                type="button"
                disabled={loading || !fenValid || building}
                onClick={() => {
                  if (!fenValid) {
                    useTablebaseStore.getState().setError("Invalid FEN");
                    return;
                  }
                  void lookupTablebase(fen);
                }}
                className="flex h-7 w-full items-center justify-center gap-1.5 rounded bg-elevated/50 font-mono text-3xs text-muted hover:bg-elevated hover:text-fg disabled:opacity-40 transition-colors"
              >
                <RefreshCw className={`size-3 ${loading ? "animate-spin" : ""}`} />
                <span>{loading ? "Looking up..." : "Refresh Tablebase"}</span>
              </button>

              {error && (
                <span className="font-mono text-3xs text-danger text-center">
                  {error}
                </span>
              )}
            </div>

            {/* Variations List */}
            <div className="max-h-56 overflow-y-auto p-1 space-y-0.5">
              {typed.length === 0 ? (
                <div className="py-6 text-center font-mono text-3xs text-subtle">
                  No {endgameIcons(kind)} cards yet
                </div>
              ) : (
                typed.map((card: any, i: number) => {
                  const isSelected = activeId === card.id;
                  const evalVal = card.evaluation;
                  const evalFormatted =
                    evalVal == null
                      ? "—"
                      : evalVal > 0
                      ? `+${evalVal.toFixed(2)}`
                      : evalVal.toFixed(2);

                  return (
                    <div
                      key={card.id}
                      className={`group flex h-8 items-center justify-between rounded px-2 font-mono text-xs transition-colors ${
                        isSelected
                          ? "bg-accent/15 text-accent font-semibold"
                          : "text-fg/70 hover:bg-elevated hover:text-fg"
                      }`}
                    >
                      <button
                        type="button"
                        disabled={building}
                        onClick={() => {
                          loadCard(
                            card,
                            cards.findIndex((c: any) => c.id === card.id)
                          );
                          setIsOpen(false);
                        }}
                        className="flex flex-1 items-center justify-between pr-2 text-left disabled:opacity-50"
                      >
                        <div className="flex items-center gap-1.5">
                          {isSelected ? (
                            <Check className="size-3 text-accent shrink-0" />
                          ) : (
                            <span className="w-3 text-3xs text-subtle">{i + 1}</span>
                          )}
                          <span>{endgameIcons(card.kind)}</span>
                        </div>

                        <span className="tabular-nums text-3xs font-medium opacity-80">
                          {evalFormatted}
                        </span>
                      </button>

                      <button
                        type="button"
                        aria-label="Delete variation"
                        disabled={building}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteVariation(card.id);
                        }}
                        className="opacity-0 transition-opacity hover:text-danger group-hover:opacity-100 disabled:opacity-30"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border-subtle bg-surface/30 px-2 py-1">
              <span className="font-mono text-3xs text-subtle">
                {typed.length} variations
              </span>
              <button
                type="button"
                disabled={building || typed.length === 0}
                onClick={() => deleteAllVariations()}
                className="flex items-center gap-1 font-mono text-3xs text-subtle hover:text-danger disabled:opacity-30 transition-colors"
              >
                <Trash2 className="size-2.5" />
                Clear All
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}