"use client";

import { useState } from "react";
import { Settings, X } from "lucide-react";
import type { EngineLine, EngineLimits, EngineSettingsState } from "@/lib/chess/use-stockfish";
import EvaluationBar from "../stockfish/EvaluationBar";
import Controls from "../stockfish/Controls";
import EngineSettings from "../stockfish/EngineSettings";
import AnalysisOutput from "../stockfish/AnalysisOutput";

type StockfishDashboardProps = {
  evalScore: number | null;
  isAnalyzing: boolean;
  onStart: () => void;
  onStop: () => void;
  settings: EngineSettingsState;
  limits: EngineLimits;
  depth: number;
  nps: number;
  onSettingsChange: (patch: Partial<EngineSettingsState>, restart: boolean) => void;
  analysisLines: EngineLine[];
  onPlayMove: (ucis: string[]) => void;
  turn: "w" | "b";
  moveNumber: number;
  fen: string;
};

export default function StockfishDashboard({
  evalScore,
  isAnalyzing,
  onStart,
  onStop,
  settings,
  limits,
  depth,
  nps,
  onSettingsChange,
  analysisLines,
  onPlayMove,
  turn,
  moveNumber,
  fen,
}: StockfishDashboardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex min-h-0 flex-col gap-3 rounded-xl border border-border-subtle bg-bg-surface p-3">
      <h3 className="border-b border-border-subtle pb-2 font-serif-display text-[15px] text-text-primary">
        Stockfish
      </h3>
      <EvaluationBar score={evalScore} variant="panel" />
      <div className="flex gap-2">
        <div className="min-w-0 flex-1">
          <Controls isAnalyzing={isAnalyzing} onStart={onStart} onStop={onStop} />
        </div>
        <button
          type="button"
          aria-label="Engine settings"
          onClick={() => setOpen(true)}
          className="grid h-[34px] w-9 shrink-0 place-items-center rounded-lg border border-border-default bg-bg-elevated text-text-secondary transition-colors hover:border-accent-gold/50 hover:text-accent-gold-bright"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
      <p className="font-mono text-[10px] text-text-muted">
        {settings.searchTimeMs / 1000}s · {settings.multiPv} line{settings.multiPv === 1 ? "" : "s"} · {settings.threads} thr · {settings.hashMb}MB
      </p>
      <AnalysisOutput lines={analysisLines} onPlayMove={onPlayMove} turn={turn} moveNumber={moveNumber} fen={fen} />

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-md rounded-xl border border-border-default bg-bg-surface p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h4 className="font-serif-display text-[15px] text-text-primary">Engine settings</h4>
              <button
                type="button"
                aria-label="Close settings"
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-md text-text-secondary hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <EngineSettings
              settings={settings}
              limits={limits}
              isAnalyzing={isAnalyzing}
              depth={depth}
              nps={nps}
              onChange={onSettingsChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
