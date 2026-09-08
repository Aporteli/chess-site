"use client";

import { Camera, Trash2 } from "lucide-react";
import { loadEndgame } from "@/lib/tablebase/chess/card-nav";
import { deleteAllKinds, deleteKind } from "@/lib/tablebase/chess/catalog-actions";
import { Button } from "@/components/tablebase/ui/button";
import { useTablebaseStore } from "@/stores/tablebase-store";

export function EndgameCatalog() {
  const catalog = useTablebaseStore((s) => s.catalog);
  const query = useTablebaseStore((s) => s.endgameQuery);
  const index = useTablebaseStore((s) => s.endgameIndex);
  const building = useTablebaseStore((s) => s.pipeline !== "idle");
  const setQuery = useTablebaseStore((s) => s.setQuery);
  const setUploadOpen = useTablebaseStore((s) => s.setUploadOpen);

  const q = query.trim().toLowerCase();
  const filtered = catalog.flatMap((eg, i) =>
    !q || eg.id.toLowerCase().includes(q) || eg.icons.includes(q)
      ? [{ eg, i }]
      : [],
  );

  return (
    <section
      aria-label="Endgame catalog"
      className="flex shrink-0 flex-col gap-2 rounded-xl bg-surface p-3 shadow-[var(--shadow-border)]"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-base text-fg">Endgame type</h2>
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="truncate text-sm text-accent">
            {catalog[index]?.icons ?? "—"}{" "}
            <span className="text-muted">
              {filtered.length}/{catalog.length}
            </span>
          </span>
          <Button
            size="tiny"
            variant="gold"
            disabled={building}
            onClick={() => setUploadOpen(true)}
          >
            <Camera className="size-3" />
            Add
          </Button>
          <Button
            size="tiny"
            variant="danger"
            disabled={building || catalog.length === 0}
            aria-label="Delete all endgame types"
            onClick={() => deleteAllKinds()}
          >
            <Trash2 className="size-3" />
            All
          </Button>
        </div>
      </div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter types…"
        className="h-11 w-full rounded-sm bg-elevated px-3 font-mono text-xs text-fg outline-none shadow-[var(--shadow-border)] placeholder:text-subtle focus:shadow-[var(--shadow-border-hover)]"
      />
      <div className="grid max-h-28 grid-cols-1 gap-1 overflow-y-auto sm:grid-cols-2">
        {filtered.length === 0 ? (
          <p className="col-span-full text-micro italic text-muted">
            No endgame types. Paste a FEN to add one.
          </p>
        ) : (
          filtered.map(({ eg, i }) => (
            <div
              key={eg.id}
              className={`flex min-w-0 items-center rounded-sm ${
                i === index ? "bg-accent/10 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-accent)_55%,transparent)]" : "shadow-[var(--shadow-border)]"
              }`}
            >
              <button
                type="button"
                onClick={() => loadEndgame(i)}
                disabled={building}
                className={`min-h-11 min-w-0 flex-1 truncate px-2 text-left text-lg leading-none disabled:opacity-50 ${
                  i === index ? "text-accent" : "text-muted hover:text-fg"
                }`}
              >
                {eg.icons}
              </button>
              <button
                type="button"
                aria-label={`Delete ${eg.id}`}
                disabled={building}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteKind(eg.id);
                }}
                className="grid size-11 shrink-0 place-items-center text-subtle hover:text-danger disabled:opacity-40"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
