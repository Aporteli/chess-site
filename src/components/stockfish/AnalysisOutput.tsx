"use client";

import { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import type { EngineLine } from "@/lib/chess/use-stockfish";

function isUci(s: string) {
  return /^[a-h][1-8][a-h][1-8][qrbn]?$/i.test(s);
}

function parseUci(uci: string) {
  return {
    from: uci.slice(0, 2),
    to: uci.slice(2, 4),
    ...(uci[4] ? { promotion: uci[4] } : {}),
  };
}

function MiniBoard({ fen }: { fen: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border-default,#3a3122)] p-1.5 shadow-board wood-grain">
      <div className="h-64 w-64 overflow-hidden rounded-md ring-1 ring-black/40">
        <Chessboard
          key={fen}
          options={{
            id: "pv-preview-board",
            position: fen,
            allowDragging: false,
            allowDrawingArrows: false,
            showNotation: false,
            animationDurationInMs: 140,
            lightSquareStyle: {
              backgroundColor: "var(--color-board-light, #e8d9b5)",
              backgroundImage:
                "linear-gradient(155deg, rgba(255,255,255,0.12), transparent 55%)",
            },
            darkSquareStyle: {
              backgroundColor: "var(--color-board-dark, #7a4c2c)",
              backgroundImage:
                "linear-gradient(155deg, rgba(255,255,255,0.06), transparent 55%)",
            },
            boardStyle: { width: "100%", height: "100%" },
          }}
        />
      </div>
    </div>
  );
}

function pvItems(pv: string, turn: "w" | "b", moveNumber: number) {
  const moves = pv.split(/\s+/).filter(isUci);
  const items: { key: string; kind: "num" | "move"; text: string; ply?: number }[] = [];
  let n = moveNumber;
  let side = turn;
  moves.forEach((uci, ply) => {
    if (side === "w") items.push({ key: `n-${ply}`, kind: "num", text: `${n}.` });
    else if (ply === 0) items.push({ key: `n-${ply}`, kind: "num", text: `${n}...` });
    items.push({ key: `m-${ply}`, kind: "move", text: uci, ply });
    if (side === "b") n += 1;
    side = side === "w" ? "b" : "w";
  });
  return { moves, items };
}

function MoveStrip({
  items,
  ply,
  onPly,
  onPlay,
  moves,
}: {
  items: { key: string; kind: "num" | "move"; text: string; ply?: number }[];
  ply: number;
  onPly: (n: number) => void;
  onPlay: (ucis: string[]) => void;
  moves: string[];
}) {
  return (
    <div className="flex min-w-0 flex-nowrap gap-x-1 overflow-hidden text-text-secondary group-open:flex-wrap group-open:overflow-visible">
      {items.map((it) =>
        it.kind === "num" ? (
          <span key={it.key} className="text-text-muted">
            {it.text}
          </span>
        ) : (
          <button
            key={it.key}
            type="button"
            className={`rounded px-0.5 hover:bg-accent-gold-dim hover:text-accent-gold-bright ${
              it.ply === ply ? "bg-accent-gold-dim text-accent-gold-bright" : ""
            }`}
            onMouseEnter={() => onPly(it.ply ?? 0)}
            onClick={() => onPlay(moves.slice(0, (it.ply ?? 0) + 1))}
          >
            {it.text}
          </button>
        ),
      )}
    </div>
  );
}

function VariationLine({
  line,
  fen,
  turn,
  moveNumber,
  onPlayMoves,
}: {
  line: EngineLine;
  fen: string;
  turn: "w" | "b";
  moveNumber: number;
  onPlayMoves: (ucis: string[]) => void;
}) {
  const wrapRef = useRef<HTMLDetailsElement>(null);
  const [hovering, setHovering] = useState(false);
  const [ply, setPly] = useState(0);
  const [anchor, setAnchor] = useState({ top: 0, left: 0 });

  const { moves, items } = useMemo(
    () => pvItems(line.pv || line.uci, turn, moveNumber),
    [line.pv, line.uci, turn, moveNumber],
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
  const score = line.evaluation > 0 ? `+${line.evaluation.toFixed(2)}` : line.evaluation.toFixed(2);

  const openPreview = () => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (r) setAnchor({ top: r.top, left: r.left - 292 });
    setHovering(true);
  };

  return (
    <details
      ref={wrapRef}
      className="group relative rounded border border-transparent open:border-border-subtle open:bg-bg-elevated"
      onMouseEnter={openPreview}
      onMouseLeave={() => setHovering(false)}
    >
      <summary className="flex h-6 cursor-pointer list-none items-center gap-2 overflow-hidden rounded px-0.5 text-left marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="shrink-0 text-[9px] text-text-muted group-open:rotate-90">▸</span>
        <span className="w-10 shrink-0 font-semibold text-accent-teal-bright">{score}</span>
        <span className="w-5 shrink-0 text-text-muted">#{line.multipv}</span>
        <div className="min-w-0 flex-1 overflow-hidden [&]:[&>div]:flex-nowrap [&]:[&>div]:overflow-hidden">
          <MoveStrip items={items} ply={ply} onPly={setPly} onPlay={onPlayMoves} moves={moves} />
        </div>
      </summary>
      <div className="px-1 pb-1.5 pl-6">
        <MoveStrip items={items} ply={ply} onPly={setPly} onPlay={onPlayMoves} moves={moves} />
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
          document.body,
        )}
    </details>
  );
}

export default function AnalysisOutput({
  lines,
  onPlayMove,
  turn,
  moveNumber,
  fen,
}: {
  lines: EngineLine[];
  onPlayMove: (ucis: string[]) => void;
  turn: "w" | "b";
  moveNumber: number;
  fen: string;
}) {
  return (
    <div className="flex min-h-0 flex-col gap-1.5">
      <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
        Top variations
      </span>
      <div className="flex h-52 shrink-0 flex-col gap-1 overflow-y-auto overflow-x-hidden rounded-lg border border-border-subtle bg-bg-deepest p-2 font-mono text-[11px]">
        {lines && lines.length > 0 ? (
          lines.map((line) => (
            <VariationLine
              key={line.multipv}
              line={line}
              fen={fen}
              turn={turn}
              moveNumber={moveNumber}
              onPlayMoves={onPlayMove}
            />
          ))
        ) : (
          <span className="italic text-text-muted">No analysis yet</span>
        )}
      </div>
    </div>
  );
}
