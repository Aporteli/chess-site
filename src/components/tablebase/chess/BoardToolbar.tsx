"use client";

import {
  Camera,
  FlipVertical2,
  Lightbulb,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Chess } from "chess.js";
import { handleHint, handleReset } from "@/lib/tablebase/chess/play";
import { fenTurn } from "@/lib/tablebase/chess/moves";
import { useTablebaseStore } from "@/stores/tablebase-store";
import { IconButton } from "./IconButton";

export function BoardToolbar() {
  const fen = useTablebaseStore((s) => s.fen);
  const sound = useTablebaseStore((s) => s.sound);
  const building = useTablebaseStore((s) => s.pipeline !== "idle");
  const gameOver = useTablebaseStore((s) => s.gameOver);
  const loading = useTablebaseStore((s) => s.loading);
  const flipped = useTablebaseStore((s) => s.flipped);
  const setUploadOpen = useTablebaseStore((s) => s.setUploadOpen);
  const toggleSound = useTablebaseStore((s) => s.toggleSound);
  const toggleFlip = useTablebaseStore((s) => s.toggleFlip);

  const turn = fenTurn(fen);
  const human = flipped ? "b" : "w";
  let inCheck = false;
  try {
    inCheck = new Chess(fen).inCheck();
  } catch {
    inCheck = false;
  }

  return (
    <div className="mb-2 flex w-full shrink-0 items-center justify-between px-1">
      <span className="font-mono text-micro text-muted tabular-nums">
        Turn: {turn === "w" ? "White" : "Black"}
        {inCheck ? " · check" : ""}
        {loading ? " · tablebase" : ""}
      </span>
      <div className="flex items-center gap-1">
        <IconButton
          label="Add position from FEN"
          disabled={building}
          onClick={() => setUploadOpen(true)}
        >
          <Camera className="size-4" />
        </IconButton>
        <IconButton
          label="Show hint"
          disabled={building || !!gameOver || turn !== human}
          onClick={() => handleHint()}
        >
          <Lightbulb className="h-4 w-4" />
        </IconButton>
        <IconButton
          label={sound ? "Mute sounds" : "Enable sounds"}
          onClick={() => toggleSound()}
        >
          {sound ? (
            <Volume2 className="size-4" />
          ) : (
            <VolumeX className="size-4" />
          )}
        </IconButton>
        <IconButton label="Flip board" onClick={() => toggleFlip()}>
          <FlipVertical2 className="size-4" />
        </IconButton>
        <IconButton label="Restart position" onClick={() => handleReset()}>
          <RotateCcw className="size-4" />
        </IconButton>
      </div>
    </div>
  );
}
