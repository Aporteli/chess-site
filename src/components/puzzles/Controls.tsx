"use client";

import { Volume2, VolumeX, FlipVertical2, RotateCcw } from "lucide-react";
import { usePuzzleStore } from "@/stores/puzzle-store";

export function Controls() {
  const { sound, setSound, flipped, toggleFlipped, puzzle, resetPuzzle } =
    usePuzzleStore();

  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <button
        type="button"
        aria-label={sound ? "Mute sounds" : "Enable sounds"}
        onClick={() => setSound(!sound)}
        className="grid h-8 w-8 place-items-center rounded-md border border-border-default bg-bg-surface text-text-secondary transition hover:border-accent-gold/50 hover:text-accent-gold-bright"
      >
        {sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      </button>
      <button
        type="button"
        aria-label="Flip board"
        onClick={toggleFlipped}
        className="grid h-8 w-8 place-items-center rounded-md border border-border-default bg-bg-surface text-text-secondary transition hover:border-accent-teal/50 hover:text-accent-teal-bright"
      >
        <FlipVertical2 className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label="Reset puzzle"
        disabled={!puzzle}
        onClick={resetPuzzle}
        className="grid h-8 w-8 place-items-center rounded-md border border-border-default bg-bg-surface text-text-secondary transition hover:border-accent-garnet/50 hover:text-accent-garnet-bright disabled:pointer-events-none disabled:opacity-40"
      >
        <RotateCcw className="h-4 w-4" />
      </button>
    </div>
  );
}