"use client";

import { memo } from "react";
import { Chess } from "chess.js";
import { formatNags, pathToNode } from "@/lib/chess";
import type { NotationMove } from "@/lib/types";
import { useTrainer } from "@/lib/trainer/context";
import { useStockfishEngine } from "@/lib/chess/use-stockfish";

function toRows(t: ReturnType<typeof useTrainer>): { rows: NotationMove[]; activePly: number } {
  const ids = pathToNode(t.chapter, t.node.id);
  const rows: NotationMove[] = [];
  let activePly = -1;
  ids.forEach((id) => {
    const n = t.chapter.nodes[id];
    if (!n?.move) return;
    const ply = n.ply - 1;
    const moveNumber = Math.ceil(n.ply / 2);
    if (n.ply % 2 === 1) {
      rows.push({
        moveNumber,
        white: `${n.move.san}${formatNags(n.nags)}`,
        whitePly: ply,
      });
    } else {
      const last = rows[rows.length - 1];
      if (last && last.moveNumber === moveNumber) {
        last.black = `${n.move.san}${formatNags(n.nags)}`;
        last.blackPly = ply;
      } else {
        rows.push({
          moveNumber,
          black: `${n.move.san}${formatNags(n.nags)}`,
          whitePly: -1,
          blackPly: ply,
        });
      }
    }
    if (id === t.node.id) activePly = ply;
  });
  return { rows, activePly };
}

function MoveCell({
  san,
  ply,
  activePly,
  onJump,
}: {
  san?: string;
  ply?: number;
  activePly: number;
  onJump: (ply: number) => void;
}) {
  if (!san || ply === undefined || ply < 0) return <span className="min-w-0 flex-1" />;
  const isActive = ply === activePly;
  return (
    <button
      onClick={() => onJump(ply)}
      className={[
        "min-w-0 flex-1 truncate rounded-md px-2 py-1 text-left font-mono text-[13px] transition-colors",
        isActive
          ? "bg-accent-teal-dim text-accent-teal-bright ring-1 ring-inset ring-accent-teal/30"
          : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary",
      ].join(" ")}
    >
      {san}
    </button>
  );
}

function formatEval(n: number) {
  if (Math.abs(n) >= 99) return n > 0 ? "M" : "−M";
  return n > 0 ? `+${n.toFixed(1)}` : n.toFixed(1);
}

function uciToSan(fen: string, uci: string) {
  try {
    const g = new Chess(fen);
    const move = g.move({
      from: uci.slice(0, 2),
      to: uci.slice(2, 4),
      promotion: uci[4] || "q",
    });
    return move?.san ?? uci;
  } catch {
    return uci;
  }
}

const CurrentLine = memo(function CurrentLine() {
  const t = useTrainer();
  const { rows, activePly } = toRows(t);

  const jumpPly = (ply: number) => {
    const target = Object.values(t.chapter.nodes).find((n) => n.ply === ply + 1 && t.path.includes(n.id));
    if (target) t.goToNode(target.id);
  };

  return (
    <>
      <div className="mb-2.5 flex items-baseline justify-between border-b border-border-subtle pb-2.5">
        <h3 className="font-serif-display text-[15px] text-text-primary">Current line</h3>
        <span className="font-mono text-[10.5px] tracking-wide text-text-muted">PGN</span>
      </div>
      <div className="max-h-36 space-y-0.5 overflow-y-auto thin-scrollbar">
        {rows.length === 0 && (
          <p className="py-3 text-[12.5px] text-text-muted">Starting position.</p>
        )}
        {rows.map((row, i) => (
          <div
            key={`${row.moveNumber}-${i}`}
            className={["flex items-center gap-1.5 rounded-md", i % 2 === 0 ? "bg-white/[0.015]" : ""].join(" ")}
          >
            <span className="w-7 shrink-0 text-right font-mono text-[12px] text-accent-gold/70">
              {row.moveNumber}.
            </span>
            <MoveCell san={row.white} ply={row.whitePly} activePly={activePly} onJump={jumpPly} />
            <MoveCell san={row.black} ply={row.blackPly} activePly={activePly} onJump={jumpPly} />
          </div>
        ))}
      </div>
    </>
  );
});

function EngineSuggestions() {
  const t = useTrainer();
  const { lines, isThinking } = useStockfishEngine();

  return (
    <div className="mb-3 flex min-h-[30px] flex-wrap gap-1.5">
      {lines.length === 0 && isThinking && (
        <span className="font-mono text-[11px] text-text-muted">…</span>
      )}
      {lines.map((line, i) => {
        const san = uciToSan(t.fen, line.uci);
        return (
          <button
            key={`${line.multipv}-${line.uci}`}
            onClick={() =>
              t.playUserMove(line.uci.slice(0, 2), line.uci.slice(2, 4), line.uci[4] as "q" | "r" | "b" | "n" | undefined)
            }
            className={[
              "flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[12px] transition-colors",
              i === 0
                ? "border-accent-teal/40 bg-accent-teal-dim text-accent-teal-bright"
                : "border-border-subtle bg-bg-elevated text-text-secondary hover:text-text-primary",
            ].join(" ")}
          >
            <span className="font-semibold">{san}</span>
            <span className="text-[10px] text-text-muted">{formatEval(line.evaluation)}</span>
          </button>
        );
      })}
    </div>
  );
}

export function MoveList() {
  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface p-4">
      <EngineSuggestions />
      <CurrentLine />
    </div>
  );
}
