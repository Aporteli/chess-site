"use client";

import { Camera, Trash2 } from "lucide-react";
import { Button } from "@/components/tablebase/ui/button";

interface EndgameCatalogHeaderProps {
  currentIcons?: string;
  filteredCount: number;
  totalCount: number;
  building: boolean;
  hasCatalog: boolean;
  onAdd: () => void;
  onDeleteAll: () => void;
}

export function EndgameCatalogHeader({
  currentIcons,
  filteredCount,
  totalCount,
  building,
  hasCatalog,
  onAdd,
  onDeleteAll,
}: EndgameCatalogHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h2 className="font-display text-base text-fg">Endgame type</h2>
      <div className="flex min-w-0 items-center gap-1.5">
        <span className="truncate text-sm text-accent">
          {currentIcons ?? "—"}{" "}
          <span className="text-muted">
            {filteredCount}/{totalCount}
          </span>
        </span>
        <Button size="tiny" variant="gold" disabled={building} onClick={onAdd}>
          <Camera className="size-3" />
          Add
        </Button>
        <Button
          size="tiny"
          variant="danger"
          disabled={building || !hasCatalog}
          aria-label="Delete all endgame types"
          onClick={onDeleteAll}
        >
          <Trash2 className="size-3" />
          All
        </Button>
      </div>
    </div>
  );
}