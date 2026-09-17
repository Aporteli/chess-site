/*
GameOverOverlay.tsx
ეს კომპონენტი აჩვენებს თამაშის დასრულების ოვერლეის შესაბამისი შეტყობინებითა და ხელახლა დაწყების ("Replay") ან შემდეგ ეტაპზე გადასვლის ("Next") ღილაკებით.
*/

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-xl border border-[#383838] bg-[#1E1E1E] p-5 shadow-2xl">
        <p className="mb-5 font-mono text-base font-medium text-white text-balance text-center">
          {gameOverCopy(gameOver)}
        </p>
        <div className="flex gap-2">
          <Button 
            className="flex-1 bg-[#2A2A2A] text-white border border-[#383838] hover:bg-[#383838] transition-colors" 
            onClick={() => handleReset()}
          >
            Replay
          </Button>
          <Button
            variant="primary"
            className="flex-1 bg-[#769656] text-white hover:bg-[#81B64C] disabled:opacity-50 transition-colors"
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