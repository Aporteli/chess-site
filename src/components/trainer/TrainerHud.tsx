"use client";

import { memo, useState } from "react";
import { Download, Keyboard, Upload } from "lucide-react";
import { useTrainer } from "@/lib/trainer/context";
import { SrsProgress } from "./SrsProgress";
import { MoveList } from "./MoveList";
import { HintBox } from "./HintBox";
import { ActionToolbar } from "./ActionToolbar";
import { ModeToggle } from "./ModeToggle";
import { RepertoireBar } from "./RepertoireBar";
import { DrillFilters } from "./DrillFilters";
import { MoveTree } from "./MoveTree";
import { AnnotationEditor } from "./AnnotationEditor";
import { MasterReference } from "./MasterReference";
import { TranspositionAlert } from "./TranspositionAlert";
import { PgnDialog } from "./PgnDialog";
import { KeyboardCheatsheet } from "./KeyboardCheatsheet";
import { BoardSettingsPanel } from "./BoardSettings";
function OpeningHeaderCard() {
  const { openingMeta } = useTrainer();
  return (
    <div className="hidden relative overflow-hidden rounded-xl border border-border-subtle bg-bg-surface p-4">
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-accent-gold/70 via-accent-gold-bright to-accent-gold/70" />
      <div className="mb-2.5 flex items-center gap-2">
        <span className="rounded-md border border-accent-gold/25 bg-accent-gold-dim px-2 py-0.5 font-mono text-[11px] font-medium text-accent-gold-bright">
          {openingMeta.eco || "ECO"}
        </span>
        <span
          className={[
            "rounded-md border px-2 py-0.5 text-[11px] font-medium",
            openingMeta.side === "white"
              ? "border-border-default bg-bg-elevated text-text-primary"
              : "border-border-strong bg-bg-deepest text-text-secondary",
          ].join(" ")}
        >
          {openingMeta.side === "white"
            ? "White repertoire"
            : "Black repertoire"}
        </span>
      </div>
      <h2 className="font-serif-display text-[20px] font-medium leading-snug text-text-primary">
        {openingMeta.name}
      </h2>
      <p className="mt-0.5 text-[13px] text-text-secondary">
        {openingMeta.variation}
      </p>
    </div>
  );
}

export const TrainerHud = memo(function TrainerHud() {
  const { mode } = useTrainer();
  const [pgn, setPgn] = useState<"import" | "export" | null>(null);
  const [keys, setKeys] = useState(false);

  return (
    <div className="flex h-full flex-col gap-3">
      <ModeToggle />
      <OpeningHeaderCard />
      <TranspositionAlert />
      <HintBox />
      {mode === "drill" && <DrillFilters />}
      <SrsProgress />
      <MoveList />
      <MoveTree />
      {mode === "study" && <AnnotationEditor />}
      <MasterReference />
      <RepertoireBar />
      {mode === "study" && <BoardSettingsPanel />}

      <div className="flex gap-2">
        <button
          onClick={() => setPgn("import")}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border-default bg-bg-elevated px-2 py-2 text-[12px] text-text-secondary hover:text-accent-gold-bright"
        >
          <Upload className="h-3.5 w-3.5" />
          Import
        </button>

        <button
          onClick={() => setPgn("export")}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border-default bg-bg-elevated px-2 py-2 text-[12px] text-text-secondary hover:text-accent-gold-bright"
        >
          <Download className="h-3.5 w-3.5" />
          Export
        </button>

        <button
          onClick={() => setKeys(true)}
          className="grid h-9 w-9 place-items-center rounded-lg border border-border-default bg-bg-elevated text-text-muted hover:text-accent-teal-bright"
          aria-label="Keyboard shortcuts"
        >
          <Keyboard className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="pt-1">
        <ActionToolbar />
      </div>

      <PgnDialog
        open={pgn !== null}
        mode={pgn ?? "import"}
        onClose={() => setPgn(null)}
      />
      <KeyboardCheatsheet open={keys} onClose={() => setKeys(false)} />
    </div>
  );
});
