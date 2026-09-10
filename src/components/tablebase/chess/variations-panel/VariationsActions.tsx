"use client";

import { fillDeck, handleNext } from "@/lib/tablebase/chess/card-nav";
import { lookupTablebase } from "@/lib/tablebase/chess/lookup";
import { Button } from "@/components/tablebase/ui/button";
import { useTablebaseStore } from "@/stores/tablebase-store";

interface VariationsActionsProps {
  building: boolean;
  loading: boolean;
  fenValid: boolean;
  fen: string;
  error: string | null;
}

export function VariationsActions({ building, loading, fenValid, fen, error }: VariationsActionsProps) {
  return (
    <div className="flex flex-col gap-2">
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
    </div>
  );
}