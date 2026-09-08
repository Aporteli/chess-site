import { FlipVertical2, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useAnalysisStore } from "@/lib/analysis/analysis-store";
import { useAnalysisBoardActions } from "@/lib/analysis/use-analysis-board-actions";

export function BoardToolbar() {
  const game = useAnalysisStore((state) => state.game);
  const sound = useAnalysisStore((state) => state.sound);
  const toggleSound = useAnalysisStore((state) => state.toggleSound);
  const toggleBoard = useAnalysisStore((state) => state.toggleBoard);
  const reset = useAnalysisStore((state) => state.reset);
  const { resetEngine } = useAnalysisBoardActions();

  return (
    <div className="mb-1.5 flex w-full shrink-0 items-center justify-between px-1 xl:w-[min(100cqw-4.5rem,calc(100dvh-10rem))]">
      <span className="text-xs font-mono text-[var(--color-text-muted,#7d735d)]">
        სვლა: {game.turn() === "w" ? "თეთრები" : "შავები"}
      </span>

      <div className="flex items-center gap-1.5">
        <button
          onClick={toggleSound}
          aria-label={sound ? "Mute sounds" : "Enable sounds"}
          className="grid h-7 w-7 place-items-center rounded-md border border-border-default bg-bg-surface text-text-secondary transition-colors hover:border-accent-gold/50 hover:text-accent-gold-bright active:scale-95"
        >
          {sound ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
        </button>

        <button
          onClick={toggleBoard}
          aria-label="Flip board"
          className="grid h-7 w-7 place-items-center rounded-md border border-border-default bg-bg-surface text-text-secondary transition-colors hover:border-accent-teal/50 hover:text-accent-teal-bright active:scale-95"
        >
          <FlipVertical2 className="h-3.5 w-3.5" />
        </button>

        <button
          onClick={() => {
            resetEngine();
            reset();
          }}
          aria-label="Restart line"
          className="grid h-7 w-7 place-items-center rounded-md border border-border-default bg-bg-surface text-text-secondary transition-colors hover:border-accent-garnet/50 hover:text-accent-garnet-bright active:scale-95"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
