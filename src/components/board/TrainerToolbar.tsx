import { FlipVertical2, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useTrainer } from "@/lib/trainer/context";

export function TrainerToolbar() {
  const t = useTrainer();

  return (
    <div className="mb-3 flex items-center justify-between">
      <span className="hidden items-center gap-1.5 rounded-full border border-border-default bg-bg-surface px-3 py-1 text-[11px] font-medium tracking-wide text-text-muted sm:inline-flex">
        Board · Walnut &amp; Maple
        {t.mode === "drill" && t.drill?.opponentThinking && (
          <span className="ml-1 text-accent-teal-bright">· opponent</span>
        )}
        {t.premove && <span className="ml-1 text-accent-gold-bright">· premove</span>}
      </span>
      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => t.setSettings({ sound: !t.settings.sound })}
          aria-label={t.settings.sound ? "Mute sounds" : "Enable sounds"}
          className="grid h-9 w-9 place-items-center rounded-md border border-border-default bg-bg-surface text-text-secondary transition-colors hover:border-accent-gold/50 hover:text-accent-gold-bright active:scale-95"
        >
          {t.settings.sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>
        <button
          onClick={t.flipBoard}
          aria-label="Flip board"
          className="grid h-9 w-9 place-items-center rounded-md border border-border-default bg-bg-surface text-text-secondary transition-colors hover:border-accent-teal/50 hover:text-accent-teal-bright active:scale-95"
        >
          <FlipVertical2 className="h-4 w-4" />
        </button>
        <button
          onClick={t.restartLine}
          aria-label="Restart line"
          className="grid h-9 w-9 place-items-center rounded-md border border-border-default bg-bg-surface text-text-secondary transition-colors hover:border-accent-garnet/50 hover:text-accent-garnet-bright active:scale-95"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}