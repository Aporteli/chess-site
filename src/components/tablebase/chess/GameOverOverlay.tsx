"use client";

import { gameOverCopy } from "@/lib/tablebase/chess/moves";
import { handleNext } from "@/lib/tablebase/chess/card-nav";
import { handleReset } from "@/lib/tablebase/chess/play";
import { useTablebaseStore } from "@/stores/tablebase-store";
import { Button } from "@/components/tablebase/ui/button";

export function GameOverOverlay() {
  const gameOver = useTablebaseStore((s) => s.gameOver);
  const building = useTablebaseStore((s) => s.pipeline !== "idle");
  if (!gameOver) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/70 p-4">
      <div className="w-full max-w-sm rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <p className="mb-4 font-display text-lg text-fg text-balance">
          {gameOverCopy(gameOver)}
        </p>
        <div className="flex gap-2">
          <Button className="flex-1" onClick={() => handleReset()}>
            Replay
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            disabled={building}
            onClick={() => handleNext()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
