"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard, type Arrow } from "react-chessboard";
import { EvaluationBar } from "@/components/stockfish/EvaluationBar";
import StockfishDashboard from "@/components/stockfish/StockfishDashboard";
import {
  Camera,
  FlipVertical2,
  RotateCcw,
  Save,
  Undo2,
  Redo2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { AppShell } from "@/components/layout/AppShell";
import { UploadBoardModal } from "@/components/board/UploadBoardModal";
import { useStockfish } from "@/lib/chess/use-stockfish";
import { playSfx, sfxForMove } from "@/lib/chess/sounds";

export default function AnalysisPage() {
  const [game, setGame] = useState(() => new Chess());
  const [fen, setFen] = useState(game.fen());
  const [history, setHistory] = useState<string[]>([]);
  const [undoneMoves, setUndoneMoves] = useState<string[]>([]);
  const [flipped, setFlipped] = useState(false);
  const [sound, setSound] = useState(true);
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const [isUploadBoardOpen, setIsUploadBoardOpen] = useState(false);
  const [startFen, setStartFen] = useState(game.fen());
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [saveMessage, setSaveMessage] = useState("");
  const { status } = useSession();

  const {
    bestMove,
    evaluation,
    isThinking,
    lines,
    depth,
    nps,
    settings,
    limits,
    evaluatePosition,
    stop,
    resetEngine,
    commitSettings,
    enabled,
    setEnabled,
  } = useStockfish();

  const handlePositionLoaded = useCallback(
    (loadedFen: string) => {
      try {
        const newGame = new Chess(loadedFen);
        setGame(newGame);
        setFen(loadedFen);
        setHistory([]);
        setUndoneMoves([]);
        setArrows([]);
        setStartFen(loadedFen);
        evaluatePosition(loadedFen);
        return true;
      } catch {
        return false;
      }
    },
    [evaluatePosition],
  );

  const handlePieceDrop = useCallback(
    ({
      sourceSquare,
      targetSquare,
    }: {
      sourceSquare: string;
      targetSquare: string | null;
    }) => {
      if (!targetSquare) return false;

      try {
        const move = game.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: "q",
        });

        if (move) {
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
          const nextFen = game.fen();
          setFen(nextFen);
          setHistory((prev) => [...prev, move.san]);
          setUndoneMoves([]);
          evaluatePosition(nextFen);
          return true;
        }
      } catch {
        return false;
      }
      return false;
    },
    [game, evaluatePosition, sound],
  );

  const handleUndo = useCallback(() => {
    const undoneMove = game.undo();
    if (undoneMove) {
      const prevFen = game.fen();
      setFen(prevFen);
      setUndoneMoves((prev) => [...prev, undoneMove.san]);
      setHistory((prev) => prev.slice(0, -1));
      setArrows([]);
      evaluatePosition(prevFen);
    }
  }, [game, evaluatePosition]);

  const handleRedo = useCallback(() => {
    if (undoneMoves.length === 0) return;

    const nextMoveSan = undoneMoves[undoneMoves.length - 1];
    const move = game.move(nextMoveSan);

    if (move) {
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
      const nextFen = game.fen();
      setFen(nextFen);
      setHistory((prev) => [...prev, move.san]);
      setUndoneMoves((prev) => prev.slice(0, -1));
      setArrows([]);
      evaluatePosition(nextFen);
    }
  }, [game, undoneMoves, evaluatePosition, sound]);

  const handleReset = () => {
    resetEngine();
    const newGame = new Chess();
    setGame(newGame);
    const startFen = newGame.fen();
    setFen(startFen);
    setHistory([]);
    setUndoneMoves([]);
    setArrows([]);
    setStartFen(startFen);
    evaluatePosition(startFen);
  };

  const handleSavePlay = async () => {
    if (status !== "authenticated") {
      setSaveState("error");
      setSaveMessage("Sign in first, then save from Analysis.");
      return;
    }

    setSaveState("saving");
    setSaveMessage("");

    const result = game.isCheckmate()
      ? game.turn() === "w"
        ? "0-1"
        : "1-0"
      : game.isDraw()
        ? "1/2-1/2"
        : "*";

    try {
      const res = await fetch("/api/plays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Analysis · ${history.length} moves`,
          source: "analysis",
          result,
          pgn: game.pgn(),
          startFen,
          currentFen: fen,
        }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        setSaveState("error");
        setSaveMessage(data?.error ?? "Could not save play.");
        return;
      }
      setSaveState("saved");
      setSaveMessage("Saved. Open Profile to see it.");
    } catch {
      setSaveState("error");
      setSaveMessage("Could not save play.");
    }
  };

  const handleFlip = () => setFlipped((prev) => !prev);

  const handleAnalyzeClick = () => {
    evaluatePosition(fen);
  };

  useEffect(() => {
    const playId = new URLSearchParams(window.location.search).get("play");
    if (!playId) {
      evaluatePosition(fen);
      return;
    }

    let cancelled = false;
    (async () => {
      const res = await fetch(`/api/plays?id=${encodeURIComponent(playId)}`);
      const data = (await res.json().catch(() => null)) as {
        play?: { pgn?: string; startFen?: string };
      } | null;
      if (cancelled || !res.ok || !data?.play) {
        evaluatePosition(fen);
        return;
      }

      try {
        const loaded = new Chess(data.play.startFen || undefined);
        if (data.play.pgn) loaded.loadPgn(data.play.pgn);
        const loadedFen = loaded.fen();
        setGame(loaded);
        setFen(loadedFen);
        setHistory(loaded.history());
        setUndoneMoves([]);
        setArrows([]);
        setStartFen(data.play.startFen || loadedFen);
        evaluatePosition(loadedFen);
      } catch {
        evaluatePosition(fen);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT")
      ) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handleUndo();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo]);

  const boardOptions = useMemo(
    () => ({
      id: "analysis-board",
      position: fen,
      boardOrientation: (flipped ? "black" : "white") as "white" | "black",
      allowDragging: true,
      allowDrawingArrows: true,
      allowDragOffBoard: false,
      arrows,
      onArrowsChange: ({ arrows: nextArrows }: { arrows: Arrow[] }) =>
        setArrows(nextArrows),
      animationDurationInMs: 180,
      showAnimations: true,
      showNotation: true,
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
      boardStyle: {
        width: "100%",
        height: "100%",
        borderRadius: 0,
      },
      onPieceDrop: handlePieceDrop,
    }),
    [fen, flipped, arrows, handlePieceDrop],
  );

  return (
    <AppShell activeKey="analysis">
      <div className="flex min-h-0 flex-col overflow-y-auto p-2 pb-24 xl:h-[calc(100dvh-5.5rem)] xl:max-h-[calc(100dvh-5.5rem)] xl:overflow-hidden xl:p-1 xl:pb-1">
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-12 xl:items-stretch xl:gap-5 xl:overflow-hidden">
          <div
            className="flex w-full min-h-0 min-w-0 flex-col items-center justify-center xl:col-span-8 xl:h-full"
            style={{ background: "none", containerType: "inline-size" }}
          >
            <div className="flex w-full max-w-[min(100%,calc(100dvh-9rem))] flex-col items-center justify-center gap-2 sm:gap-3 xl:max-h-full xl:max-w-none xl:flex-row">
              <div className="flex w-full min-w-0 items-stretch justify-center gap-2 sm:gap-3 xl:w-auto">
                <div className="flex shrink-0 self-stretch pt-7 sm:pt-8">
                  <EvaluationBar evaluation={evaluation} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col xl:flex-none">
                  <div className="mb-1.5 flex w-full shrink-0 items-center justify-between px-1 xl:w-[min(100cqw-4.5rem,calc(100dvh-10rem))]">
                    <span className="text-xs font-mono text-[var(--color-text-muted,#7d735d)]">
                      სვლა: {game.turn() === "w" ? "თეთრები" : "შავები"}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSound((prev) => !prev)}
                        aria-label={sound ? "Mute sounds" : "Enable sounds"}
                        className="grid h-7 w-7 place-items-center rounded-md border border-border-default bg-bg-surface text-text-secondary transition-colors hover:border-accent-gold/50 hover:text-accent-gold-bright active:scale-95"
                      >
                        {sound ? (
                          <Volume2 className="h-3.5 w-3.5" />
                        ) : (
                          <VolumeX className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <button
                        onClick={handleFlip}
                        aria-label="Flip board"
                        className="grid h-7 w-7 place-items-center rounded-md border border-border-default bg-bg-surface text-text-secondary transition-colors hover:border-accent-teal/50 hover:text-accent-teal-bright active:scale-95"
                      >
                        <FlipVertical2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={handleReset}
                        aria-label="Restart line"
                        className="grid h-7 w-7 place-items-center rounded-md border border-border-default bg-bg-surface text-text-secondary transition-colors hover:border-accent-garnet/50 hover:text-accent-garnet-bright active:scale-95"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="relative aspect-square w-full shrink-0 xl:h-[min(100cqw-4.5rem,calc(100dvh-10rem))] xl:w-[min(100cqw-4.5rem,calc(100dvh-10rem))]">
                    <div className="flex h-full w-full items-center justify-center rounded-xl border border-[var(--color-border-default,#3a3122)] p-1.5 shadow-board wood-grain sm:rounded-2xl sm:p-2.5">
                      <div className="relative h-full w-full overflow-hidden rounded-lg ring-1 ring-black/40">
                        <Chessboard options={boardOptions} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-row justify-center gap-2.5 xl:flex-col">
                <button
                  onClick={handleUndo}
                  disabled={history.length === 0}
                  aria-label="Undo move"
                  className="grid h-9 w-9 place-items-center rounded-md border border-border-default bg-bg-surface text-text-secondary transition-colors hover:border-accent-gold/50 hover:text-accent-gold-bright active:scale-95 disabled:opacity-40 disabled:pointer-events-none shadow-sm"
                >
                  <Undo2 className="h-4 w-4" />
                </button>
                <button
                  onClick={handleRedo}
                  disabled={undoneMoves.length === 0}
                  aria-label="Redo move"
                  className="grid h-9 w-9 place-items-center rounded-md border border-border-default bg-bg-surface text-text-secondary transition-colors hover:border-accent-gold/50 hover:text-accent-gold-bright active:scale-95 disabled:opacity-40 disabled:pointer-events-none shadow-sm"
                >
                  <Redo2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* მარჯვენა მხარე: მართვის პანელი */}
          <div className="flex min-h-0 w-full flex-col gap-3 xl:col-span-4 xl:h-full xl:overflow-y-auto">
            <div className="flex shrink-0 flex-col gap-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setIsUploadBoardOpen(true)}
                  className="flex-1 px-3.5 py-1.5 rounded-lg text-xs bg-[var(--color-bg-elevated,#1c1815)] border border-[var(--color-border-subtle,#221d17)] text-[var(--color-text-secondary,#b9ac91)] hover:bg-[var(--color-bg-elevated-hover,#262019)] hover:text-[var(--color-accent-gold-bright,#e8c579)] transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span className="w-full text-center font-semibold flex justify-center items-center gap-1">
                    Scan Book
                    <Camera className="h-3.5 w-3.5 ml-0.5" />
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleSavePlay}
                  disabled={saveState === "saving"}
                  className="flex-1 px-3.5 py-1.5 rounded-lg text-xs bg-[var(--color-bg-elevated,#1c1815)] border border-accent-gold/35 text-accent-gold-bright hover:border-accent-gold/70 hover:bg-accent-gold-dim transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  <span className="w-full text-center font-semibold flex justify-center items-center gap-1">
                    {saveState === "saving" ? "Saving…" : "Save play"}
                    <Save className="h-3.5 w-3.5 ml-0.5" />
                  </span>
                </button>
              </div>
              {saveMessage && (
                <p
                  className={[
                    "text-[11px]",
                    saveState === "error" ? "text-accent-garnet-bright" : "text-text-muted",
                  ].join(" ")}
                >
                  {saveMessage}
                </p>
              )}
              <StockfishDashboard
                evalScore={evaluation}
                isAnalyzing={isThinking}
                onStart={handleAnalyzeClick}
                onStop={stop}
                settings={settings}
                limits={limits}
                depth={depth}
                nps={nps}
                onSettingsChange={commitSettings}
                analysisLines={lines}
                turn={game.turn()}
                moveNumber={Number(fen.split(" ")[5] || 1)}
                fen={fen}
                enabled={enabled}
                onToggleEnabled={() => setEnabled(!enabled)}
                onPlayMove={(ucis) => {
                  try {
                    let lastFen = fen;
                    for (const uci of ucis) {
                      const move = game.move({
                        from: uci.slice(0, 2),
                        to: uci.slice(2, 4),
                        ...(uci[4] ? { promotion: uci[4] } : {}),
                      });
                      if (!move) return;
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
                      lastFen = game.fen();
                      setHistory((prev) => [...prev, move.san]);
                    }
                    setFen(lastFen);
                    setUndoneMoves([]);
                    evaluatePosition(lastFen);
                  } catch {
                    /* illegal for this position */
                  }
                }}
              />
            </div>

            {/* Eval მეტრიკა */}
            <div className="bg-[var(--color-bg-surface,#131110)] p-3 rounded-xl border border-[var(--color-border-subtle,#221d17)] space-y-2 shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted,#7d735d)] font-mono">
                  Engine Eval
                </span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                    isThinking
                      ? "bg-[var(--color-accent-teal-dim,#142621)] text-[var(--color-accent-teal-bright,#7fc0af)] border border-[var(--color-accent-teal,#4f9484)]"
                      : "bg-[var(--color-bg-elevated,#1c1815)] text-[var(--color-text-secondary,#b9ac91)]"
                  }`}
                >
                  {isThinking ? "Calculating" : "Idle"}
                </span>
              </div>

              <div className="flex items-baseline justify-between border-t border-[var(--color-border-subtle,#221d17)] pt-1.5">
                <span className="text-xs text-[var(--color-text-secondary,#b9ac91)]">
                  შეფასება:
                </span>
                <span className="text-xl font-mono font-bold text-[var(--color-accent-gold-bright,#e8c579)]">
                  {evaluation !== null
                    ? evaluation > 0
                      ? `+${evaluation}`
                      : evaluation
                    : "0.00"}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-[var(--color-border-subtle,#221d17)] pt-1.5">
                <span className="text-xs text-[var(--color-text-secondary,#b9ac91)]">
                  საუკეთესო სვლა:
                </span>
                <span className="font-mono text-xs font-semibold text-[var(--color-accent-teal-bright,#7fc0af)] bg-[var(--color-accent-teal-dim,#142621)] px-2 py-0.5 rounded border border-[var(--color-border-subtle,#221d17)]">
                  {bestMove ?? "—"}
                </span>
              </div>
            </div>

            {/* სვლების ისტორია */}
            <div className="bg-[var(--color-bg-surface,#131110)] p-3 rounded-xl border border-[var(--color-border-subtle,#221d17)] flex-1 min-h-[100px] flex flex-col overflow-hidden">
              <h2 className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted,#7d735d)] font-mono mb-1.5 shrink-0">
                სვლების ისტორია
              </h2>
              <div className="flex-1 overflow-y-auto pr-1 flex flex-wrap gap-1 content-start font-mono text-xs">
                {history.length === 0 ? (
                  <span className="text-[var(--color-text-muted,#7d735d)] italic text-xs">
                    სვლები ჯერ არ გაკეთებულა
                  </span>
                ) : (
                  history.map((san, index) => (
                    <span
                      key={index}
                      className="px-1.5 py-0.5 bg-[var(--color-bg-elevated,#1c1815)] border border-[var(--color-border-subtle,#221d17)] rounded text-[var(--color-text-secondary,#b9ac91)] text-xs"
                    >
                      {index % 2 === 0 ? `${Math.floor(index / 2) + 1}. ` : ""}
                      {san}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* FEN */}
            <div className="bg-[var(--color-bg-surface,#131110)] p-2 rounded-xl border border-[var(--color-border-subtle,#221d17)] shrink-0">
              <span className="text-[8px] uppercase font-mono text-[var(--color-text-muted,#7d735d)] block mb-0.5">
                FEN
              </span>
              <p className="font-mono text-[9px] text-[var(--color-text-muted,#7d735d)] truncate select-all">
                {fen}
              </p>
            </div>
          </div>
        </div>
      </div>

      <UploadBoardModal
        isOpen={isUploadBoardOpen}
        onClose={() => setIsUploadBoardOpen(false)}
        onPositionLoaded={handlePositionLoaded}
      />
    </AppShell>
  );
}
