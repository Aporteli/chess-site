"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Puzzle as PuzzleIcon,
  Loader2,
  Lightbulb,
  Volume2,
  VolumeX,
  FlipVertical2,
  RotateCcw,
} from "lucide-react";
import { Chess } from "chess.js";
import { Chessboard, type Arrow } from "react-chessboard";
import { AppShell } from "@/components/layout/AppShell";
import { playSfx, sfxForMove } from "@/lib/chess/sounds";
import { cn } from "@/lib/utils";

type PuzzleData = {
  fen: string;
  solution: string[];
  theme: string;
  rating: number;
};

const BOARD_STYLE = {
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
  dropSquareStyle: { boxShadow: "inset 0 0 0 3px rgba(201, 162, 86, 0.7)" },
  darkSquareNotationStyle: {
    color: "rgba(243, 230, 200, 0.82)",
    fontSize: "10px",
    fontWeight: 600,
  },
  lightSquareNotationStyle: {
    color: "rgba(90, 61, 32, 0.72)",
    fontSize: "10px",
    fontWeight: 600,
  },
  boardStyle: { width: "100%", height: "100%", borderRadius: 0 },
};

function toUci(from: string, to: string, promo?: string) {
  return `${from}${to}${promo ?? ""}`.toLowerCase();
}

function applyUci(game: Chess, uci: string) {
  const u = uci.toLowerCase();
  return game.move({
    from: u.slice(0, 2),
    to: u.slice(2, 4),
    ...(u[4] ? { promotion: u[4] } : {}),
  });
}

function lineIndex(startFen: string, boardFen: string, solution: string[]) {
  const game = new Chess(startFen);
  if (game.fen() === boardFen) return 0;
  for (let i = 0; i < solution.length; i++) {
    try {
      applyUci(game, solution[i]);
    } catch {
      return -1;
    }
    if (game.fen() === boardFen) return i + 1;
  }
  return -1;
}

function sfx(
  move: { captured?: string; flags: string; promotion?: string },
  game: Chess,
  sound: boolean,
) {
  playSfx(
    sfxForMove({
      capture: move.captured !== undefined,
      castle: move.flags.includes("k")
        ? "k"
        : move.flags.includes("q")
          ? "q"
          : null,
      check: game.inCheck(),
      mate: game.isCheckmate(),
      promotion: move.promotion !== undefined,
    }),
    sound,
  );
}

async function fetchGeneratedPuzzle({
  fen,
  sideToMove,
}: {
  fen: string;
  sideToMove: "w" | "b";
}): Promise<PuzzleData> {
  const res = await fetch("/api/puzzle/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fen, sideToMove }),
  });
  if (!res.ok) {
    throw new Error((await res.json()).error || "Failed to generate puzzle.");
  }
  return await res.json();
}

export default function PuzzlesPage() {
  const [fenInput, setFenInput] = useState("");
  const [sideToMove, setSideToMove] = useState<"w" | "b">("w");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [puzzle, setPuzzle] = useState<PuzzleData | null>(null);
  const [boardFen, setBoardFen] = useState<string | null>(null);
  const [ply, setPly] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const [sound, setSound] = useState(true);
  const [flipped, setFlipped] = useState(false);
  const [sans, setSans] = useState<string[]>([]);

  const handleGeneratePuzzle = async () => {
    setLoading(true);
    setError(null);
    setPuzzle(null);
    setBoardFen(null);
    setPly(0);
    setHintLevel(0);
    setStatus(null);
    setFlipped(false);
    setSans([]);
    try {
      const data = await fetchGeneratedPuzzle({ fen: fenInput, sideToMove });
      setPuzzle(data);
      setBoardFen(data.fen);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to generate puzzle.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePieceDrop = useCallback(
    ({
      sourceSquare,
      targetSquare,
    }: {
      sourceSquare: string;
      targetSquare: string | null;
    }) => {
      if (!targetSquare || !puzzle || !boardFen) return false;

      const game = new Chess(boardFen);
      const idx = lineIndex(puzzle.fen, boardFen, puzzle.solution);
      const expected =
        idx >= 0
          ? puzzle.solution[idx]?.toLowerCase()
          : puzzle.solution[ply]?.toLowerCase();
      const piece = game.get(sourceSquare as Parameters<Chess["get"]>[0]);
      const needsPromo =
        piece?.type === "p" &&
        ((piece.color === "w" && targetSquare[1] === "8") ||
          (piece.color === "b" && targetSquare[1] === "1"));
      let move;
      try {
        move = game.move({
          from: sourceSquare,
          to: targetSquare,
          ...(needsPromo ? { promotion: expected?.[4] ?? "q" } : {}),
        });
      } catch {
        playSfx("error", sound);
        return false;
      }
      if (!move) {
        playSfx("error", sound);
        return false;
      }

      sfx(move, game, sound);
      const nextSans = [...sans, move.san];
      const played = toUci(sourceSquare, targetSquare, move.promotion);
      if (expected && played === expected) {
        let nextPly = (idx >= 0 ? idx : ply) + 1;
        if (nextPly < puzzle.solution.length) {
          try {
            const reply = applyUci(game, puzzle.solution[nextPly]);
            if (reply) {
              sfx(reply, game, sound);
              nextSans.push(reply.san);
            }
            nextPly += 1;
          } catch {
            playSfx("error", sound);
            return false;
          }
        }
        setPly(nextPly);
        setHintLevel(0);
        setStatus(nextPly >= puzzle.solution.length ? "Solved" : "Good");
        if (nextPly >= puzzle.solution.length) playSfx("success", sound);
      } else {
        setStatus(expected ? "Off the solution line" : null);
      }

      setSans(nextSans);
      setBoardFen(game.fen());
      return true;
    },
    [boardFen, ply, puzzle, sans, sound],
  );

  const playerSide = (puzzle?.fen.split(" ")[1] === "b" ? "black" : "white") as
    | "white"
    | "black";
  const orientation = flipped
    ? playerSide === "white"
      ? "black"
      : "white"
    : playerSide;

  const hintIdx =
    puzzle && boardFen ? lineIndex(puzzle.fen, boardFen, puzzle.solution) : -1;
  const hintUci = puzzle && hintIdx >= 0 ? puzzle.solution[hintIdx] : undefined;
  const hintFrom = hintUci?.slice(0, 2);
  const hintTo = hintUci?.slice(2, 4);

  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};
    if (hintLevel >= 1 && hintFrom) {
      styles[hintFrom] = {
        boxShadow: "inset 0 0 0 3px rgba(232, 197, 121, 0.95)",
      };
    }
    if (hintLevel >= 2 && hintTo) {
      styles[hintTo] = {
        boxShadow: "inset 0 0 0 3px rgba(127, 192, 175, 0.95)",
      };
    }
    return styles;
  }, [hintFrom, hintLevel, hintTo]);

  const boardOptions = useMemo(
    () => ({
      id: "puzzle-board",
      position: boardFen ?? undefined,
      boardOrientation: orientation as "white" | "black",
      allowDragging: Boolean(puzzle),
      allowDrawingArrows: false,
      allowDragOffBoard: false,
      animationDurationInMs: 180,
      showAnimations: true,
      showNotation: true,
      squareStyles,
      arrows:
        hintLevel >= 2 && hintFrom && hintTo
          ? ([
              { startSquare: hintFrom, endSquare: hintTo, color: "#e8c579" },
            ] as Arrow[])
          : [],
      ...BOARD_STYLE,
      onPieceDrop: handlePieceDrop,
    }),
    [
      boardFen,
      handlePieceDrop,
      hintFrom,
      hintLevel,
      hintTo,
      orientation,
      puzzle,
      squareStyles,
    ],
  );

  const statusTone =
    status === "Solved"
      ? "border-accent-teal/40 bg-accent-teal-dim text-accent-teal-bright"
      : status === "Off the solution line"
        ? "border-accent-garnet/40 bg-accent-garnet-dim text-accent-garnet-bright"
        : status
          ? "border-accent-gold/40 bg-accent-gold-dim text-accent-gold-bright"
          : "border-border-subtle bg-bg-elevated text-text-muted";

  return (
    <AppShell activeKey="puzzles">
      <div className="flex min-h-0 flex-col overflow-y-auto p-3 pb-24 xl:h-[calc(100dvh-5.5rem)] xl:max-h-[calc(100dvh-5.5rem)] xl:overflow-hidden xl:p-4 xl:pb-4">
        <div className="mx-auto grid min-h-0 w-full max-w-[1400px] flex-1 grid-cols-1 gap-4 xl:grid-cols-12 xl:items-stretch xl:gap-5 xl:overflow-hidden">
          <section
            className="flex min-h-0 min-w-0 flex-col items-center justify-center xl:col-span-7 xl:h-full"
            style={{ containerType: "inline-size" }}
          >
            <div className="flex w-full max-w-[min(100%,calc(100dvh-9rem))] flex-col xl:max-h-full xl:max-w-none">
              <div className="mb-2 flex items-center justify-between gap-2 px-1">
                <div className="flex min-w-0 items-center gap-2">
                  <PuzzleIcon className="h-4 w-4 shrink-0 text-accent-gold-bright" />
                  <span className="truncate font-serif text-sm text-text-primary">
                    {puzzle
                      ? `Find the best move for ${playerSide}`
                      : "Chess Puzzles"}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    aria-label={sound ? "Mute sounds" : "Enable sounds"}
                    onClick={() => setSound((s) => !s)}
                    className="grid h-8 w-8 place-items-center rounded-md border border-border-default bg-bg-surface text-text-secondary transition hover:border-accent-gold/50 hover:text-accent-gold-bright"
                  >
                    {sound ? (
                      <Volume2 className="h-4 w-4" />
                    ) : (
                      <VolumeX className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    aria-label="Flip board"
                    onClick={() => setFlipped((f) => !f)}
                    className="grid h-8 w-8 place-items-center rounded-md border border-border-default bg-bg-surface text-text-secondary transition hover:border-accent-teal/50 hover:text-accent-teal-bright"
                  >
                    <FlipVertical2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Reset puzzle"
                    disabled={!puzzle}
                    onClick={() => {
                      if (!puzzle) return;
                      setBoardFen(puzzle.fen);
                      setPly(0);
                      setHintLevel(0);
                      setStatus(null);
                      setSans([]);
                    }}
                    className="grid h-8 w-8 place-items-center rounded-md border border-border-default bg-bg-surface text-text-secondary transition hover:border-accent-garnet/50 hover:text-accent-garnet-bright disabled:pointer-events-none disabled:opacity-40"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="relative mx-auto aspect-square w-full max-w-[min(100%,640px)] xl:h-[min(100cqw,calc(100dvh-10rem))] xl:w-[min(100cqw,calc(100dvh-10rem))] xl:max-w-none">
                <div className="relative h-full w-full rounded-2xl p-2.5 wood-grain shadow-board sm:p-3">
                  <span className="pointer-events-none absolute left-2 top-2 h-3 w-3 rounded-tl-md border-l-2 border-t-2 border-accent-gold/50" />
                  <span className="pointer-events-none absolute right-2 top-2 h-3 w-3 rounded-tr-md border-r-2 border-t-2 border-accent-gold/50" />
                  <span className="pointer-events-none absolute bottom-2 left-2 h-3 w-3 rounded-bl-md border-b-2 border-l-2 border-accent-gold/50" />
                  <span className="pointer-events-none absolute bottom-2 right-2 h-3 w-3 rounded-br-md border-r-2 border-b-2 border-accent-gold/50" />
                  <div className="relative h-full w-full overflow-hidden rounded-lg ring-1 ring-black/40">
                    {boardFen ? (
                      <Chessboard options={boardOptions} />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-bg-elevated px-6 text-center">
                        <PuzzleIcon className="h-10 w-10 text-accent-gold/50" />
                        <p className="font-serif text-lg text-text-secondary">
                          No puzzle yet
                        </p>
                        <p className="max-w-xs font-mono text-xs text-text-muted">
                          Generate a tactic from a FEN or leave it blank for a
                          random position.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="flex min-h-0 flex-col gap-3 xl:col-span-5 xl:h-full xl:overflow-y-auto">
            <div className="rounded-xl border border-border-subtle bg-bg-surface p-4 shadow-panel">
              <h2 className="font-serif text-lg text-accent-gold-bright">
                Generate
              </h2>
              <p className="mt-1 font-mono text-[11px] text-text-muted">
                Optional starting FEN. Blank position uses a random tactic.
              </p>
              <label className="mt-3 flex flex-col gap-1.5">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  FEN
                </span>
                <input
                  type="text"
                  value={fenInput}
                  onChange={(e) => setFenInput(e.target.value)}
                  placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                  className="rounded-md border border-border-default bg-bg-elevated px-2.5 py-2 font-mono text-xs text-text-primary outline-none transition focus:border-accent-gold/60"
                  autoComplete="off"
                  spellCheck={false}
                />
              </label>
              <div className="mt-3 flex flex-wrap items-end gap-3">
                <label className="flex min-w-[8rem] flex-1 flex-col gap-1.5">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                    Side to move
                  </span>
                  <select
                    value={sideToMove}
                    onChange={(e) => setSideToMove(e.target.value as "w" | "b")}
                    className="rounded-md border border-border-default bg-bg-elevated px-2.5 py-2 font-mono text-xs outline-none focus:border-accent-gold/60"
                  >
                    <option value="w">White</option>
                    <option value="b">Black</option>
                  </select>
                </label>
                <button
                  className={cn(
                    "inline-flex h-[38px] flex-1 items-center justify-center gap-2 rounded-md bg-accent-gold-bright px-4 font-mono text-xs font-semibold text-bg-deepest transition hover:bg-accent-gold",
                    loading && "cursor-not-allowed opacity-75",
                  )}
                  onClick={handleGeneratePuzzle}
                  disabled={loading}
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {puzzle ? "Next puzzle" : "Generate puzzle"}
                </button>
              </div>
              {error && (
                <div className="mt-3 rounded-md border border-accent-garnet/30 bg-accent-garnet-dim px-2.5 py-2 font-mono text-xs text-accent-garnet-bright">
                  {error}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-border-subtle bg-bg-surface p-4 shadow-panel">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                    Status
                  </p>
                  <p
                    className={cn(
                      "mt-1 inline-flex rounded-md border px-2 py-0.5 font-mono text-xs",
                      statusTone,
                    )}
                  >
                    {status ?? (puzzle ? "Your move" : "Waiting")}
                  </p>
                </div>
                {puzzle && (
                  <div className="text-right">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                      Rating
                    </p>
                    <p className="mt-0.5 font-serif text-2xl text-accent-gold-bright">
                      {puzzle.rating}
                    </p>
                  </div>
                )}
              </div>
              {puzzle && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-md border border-accent-teal/30 bg-accent-teal-dim px-2 py-0.5 font-mono text-[11px] text-accent-teal-bright">
                    {puzzle.theme}
                  </span>
                  <button
                    type="button"
                    disabled={!hintUci}
                    onClick={() => setHintLevel((n) => Math.min(2, n + 1))}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-border-default bg-bg-elevated px-2.5 py-1.5 font-mono text-xs text-text-secondary transition hover:border-accent-gold/50 hover:text-accent-gold-bright disabled:opacity-40"
                  >
                    <Lightbulb className="h-3.5 w-3.5" />
                    Hint
                  </button>
                  {hintLevel >= 1 && hintFrom && (
                    <span className="font-mono text-xs text-text-muted">
                      {hintLevel === 1
                        ? `from ${hintFrom}`
                        : `${hintFrom} → ${hintTo}`}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex min-h-[10rem] flex-1 flex-col rounded-xl border border-border-subtle bg-bg-surface p-4 shadow-panel">
              <h2 className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                Move list
              </h2>
              <div className="mt-2 flex min-h-0 flex-1 flex-wrap content-start gap-1.5 font-mono text-xs">
                {!puzzle || sans.length === 0 ? (
                  <span className="italic text-text-muted">
                    {puzzle
                      ? "Play the winning line on the board."
                      : "Moves will appear here."}
                  </span>
                ) : (
                  sans.map((san, index) => {
                    const parts = puzzle.fen.split(" ");
                    const blackFirst = parts[1] === "b";
                    const startNum = Number(parts[5] || 1);
                    const prefix = blackFirst
                      ? index === 0
                        ? `${startNum}... `
                        : (index - 1) % 2 === 0
                          ? `${startNum + 1 + Math.floor((index - 1) / 2)}. `
                          : ""
                      : index % 2 === 0
                        ? `${startNum + Math.floor(index / 2)}. `
                        : "";
                    return (
                      <span
                        key={`${san}-${index}`}
                        className="rounded-md border border-border-subtle bg-bg-elevated px-1.5 py-0.5 text-text-secondary"
                      >
                        {prefix}
                        {san}
                      </span>
                    );
                  })
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
