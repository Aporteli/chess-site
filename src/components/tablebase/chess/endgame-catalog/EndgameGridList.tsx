"use client";

import { Trash2 } from "lucide-react";

interface EndgameItem {
  id: string;
  icons: string;
}

interface FilteredItem {
  eg: EndgameItem;
  i: number;
}

interface EndgameGridListProps {
  filtered: FilteredItem[];
  currentIndex: number;
  building: boolean;
  onLoad: (index: number) => void;
  onDelete: (id: string) => void;
}

export function EndgameGridList({
  filtered,
  currentIndex,
  building,
  onLoad,
  onDelete,
}: EndgameGridListProps) {
  return (
    <div className="grid max-h-28 grid-cols-1 gap-1 overflow-y-auto sm:grid-cols-2">
      {filtered.length === 0 ? (
        <p className="col-span-full text-micro italic text-muted">
          No endgame types. Paste a FEN to add one.
        </p>
      ) : (
        filtered.map(({ eg, i }) => {
          const isSelected = i === currentIndex;
          return (
            <div
              key={eg.id}
              className={`flex min-w-0 items-center rounded-sm ${
                isSelected
                  ? "bg-accent/10 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-accent)_55%,transparent)]"
                  : "shadow-[var(--shadow-border)]"
              }`}
            >
              <button
                type="button"
                onClick={() => onLoad(i)}
                disabled={building}
                className={`min-h-11 min-w-0 flex-1 truncate px-2 text-left text-lg leading-none disabled:opacity-50 ${
                  isSelected ? "text-accent" : "text-muted hover:text-fg"
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
                  onDelete(eg.id);
                }}
                className="grid size-11 shrink-0 place-items-center text-subtle hover:text-danger disabled:opacity-40"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}