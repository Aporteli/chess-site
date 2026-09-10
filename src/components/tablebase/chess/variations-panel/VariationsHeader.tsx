"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/tablebase/ui/button";
import { deleteAllVariations } from "@/lib/tablebase/chess/catalog-actions";
import { endgameIcons } from "@/lib/tablebase/chess/catalog";

interface VariationsHeaderProps {
  pipelineLabel: string;
  building: boolean;
  hasTyped: boolean;
}

export function VariationsHeader({ pipelineLabel, building, hasTyped }: VariationsHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h2 className="font-display text-base text-fg">Variations</h2>
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-2xs text-muted">{pipelineLabel}</span>
        <Button
          size="tiny"
          variant="danger"
          disabled={building || !hasTyped}
          aria-label="Delete all variations"
          onClick={() => deleteAllVariations()}
        >
          <Trash2 className="size-3" />
          All
        </Button>
      </div>
    </div>
  );
}