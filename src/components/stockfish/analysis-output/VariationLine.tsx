"use client";

import { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Chess } from "chess.js";
import type { EngineLine } from "@/lib/tablebase/chess/types";
import { pvItems, parseUci } from "@/lib/stockfish/utils";
import { MoveStrip } from "./MoveStrip";
import { MiniBoard } from "./MiniBoard";

interface VariationLineProps {
  line: EngineLine;
  fen: string;
  turn: "w" | "b";
  moveNumber: number;
  onPlayMoves: (ucis: string[]) => void;
}

export function VariationLine({
  line,
  fen,
  turn,
  moveNumber,
  onPlayMoves,
}: VariationLineProps) {
  const wrapRef = useRef<HTMLDetailsElement>(null);
  const [hovering, setHovering] = useState(false);
  const [ply, setPly] = useState(0);
  const [anchor, setAnchor] = useState({ top: 0, left: 0 });

  const { moves, items } = useMemo(
    () => pvItems(line.pv || line.uci, fen, turn, moveNumber),
    [line.pv, line.uci, fen, turn, moveNumber]
  );

  const fens = useMemo(() => {
    const game = new Chess(fen);
    const next = [game.fen()];
    for (const uci of moves) {
      try {
        const mv = game.move(parseUci(uci));
        if (!mv) break;
        next.push(game.fen());
      } catch {
        break;
      }
    }
    return next;
  }, [fen, moves]);

  const previewFen = fens[Math.min(ply + 1, fens.length - 1)] ?? fen;
  const score =
    line.evaluation > 0
      ? `+${line.evaluation.toFixed(2)}`
      : line.evaluation.toFixed(2);

  const openPreview = () => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (r) setAnchor({ top: r.top, left: r.left - 292 });
    setHovering(true);
  };

  return (
    <details
      ref={wrapRef}
      className="group rounded border border-transparent open:border-border-subtle open:bg-bg-elevated"
      onMouseEnter={openPreview}
      onMouseLeave={() => setHovering(false)}
    >
      <summary className="flex min-h-[28px] cursor-pointer list-none items-center gap-2 rounded px-1 py-1 text-left marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="shrink-0 text-[9px] text-text-muted transition-transform group-open:rotate-90">
          ▸
        </span>
        <span className="w-10 shrink-0 font-semibold text-accent-teal-bright">
          {score}
        </span>

        <div className="min-w-0 flex-1 group-open:hidden">
          <MoveStrip
            items={items}
            ply={ply}
            onPly={setPly}
            onPlay={onPlayMoves}
            moves={moves}
            isExpanded={false}
          />
        </div>
      </summary>

      <div className="px-2 pb-2 pt-1 pl-7">
        <MoveStrip
          items={items}
          ply={ply}
          onPly={setPly}
          onPlay={onPlayMoves}
          moves={moves}
          isExpanded={true}
        />
      </div>

      {hovering &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="pointer-events-none fixed z-[80]"
            style={{ top: anchor.top, left: Math.max(8, anchor.left) }}
          >
            <MiniBoard fen={previewFen} />
          </div>,
          document.body
        )}
    </details>
  );
}