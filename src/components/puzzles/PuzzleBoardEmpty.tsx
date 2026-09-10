import { PuzzleIcon } from "lucide-react";

export function PuzzleBoardEmpty() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-bg-elevated px-6 text-center">
      <PuzzleIcon className="h-10 w-10 text-accent-gold/50" />
      <p className="font-serif text-lg text-text-secondary">No puzzle yet</p>
      <p className="max-w-xs font-mono text-xs text-text-muted">
        Generate a tactic from a FEN or leave it blank for a random position.
      </p>
    </div>
  );
}