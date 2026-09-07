"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { TablebaseResponse } from "@/app/api/tablebase/route";
import { Chess } from "chess.js";
import { Chessboard, type Arrow } from "react-chessboard";
import {
  FlipVertical2,
  Lightbulb,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { playSfx, sfxForMove } from "@/lib/chess/sounds";
import { useStockfish } from "@/lib/chess/use-stockfish";
import StockfishDashboard from "@/components/stockfish/StockfishDashboard";
import {
  DECK_BATCH,
  ENDGAMES,
  emptyDeck,
  fenMatchesKind,
  generateEndgameFen,
  isLegalPlayableFen,
  isLegalChessFen,
  isWinningEval,
  loadDeck,
  makeCard,
  saveDeck,
  upsertCard,
  type EndgameCard,
  type EndgameDeck,
  type EndgameKind,
} from "@/lib/chess/endgame-deck";

const START_FEN = ENDGAMES[0].fen;

type PipelineStatus = "idle" | "generate" | "legal" | "analyze" | "store";

function uciOf(move: { from: string; to: string; promotion?: string }) {
  return move.from + move.to + (move.promotion ?? "");
}

function clonePlayed(board: Chess) {
  return new Chess(board.fen());
}
type GameOverReason = "checkmate" | "stalemate" | "insufficient" | "threefold";
function endReason(game: Chess): GameOverReason | null {
  if (game.isCheckmate()) return "checkmate";
  if (game.isStalemate()) return "stalemate";
  if (game.isInsufficientMaterial()) return "insufficient";
  if (game.isThreefoldRepetition()) return "threefold";
  return null;
}

function playMoveSfx(
  next: Chess,
  move: { captured?: string; flags: string; promotion?: string },
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
      check: next.inCheck(),
      mate: next.isCheckmate(),
      promotion: move.promotion !== undefined,
    }),
    sound,
  );
}

function tablebaseScore(category: string | undefined, turn: "w" | "b"): number {
  const side = turn === "w" ? 1 : -1;
  switch (category) {
    case "win":
    case "cursed-win":
      return 10 * side;
    case "loss":
    case "blessed-loss":
      return -10 * side;
    default:
      return 0;
  }
}
function formatTbEval(
  category: string | undefined,
  dtm: number | null | undefined,
  turn: "w" | "b",
): string {
  const score = tablebaseScore(category, turn);
  if (!category || category === "draw") return "0.00";
  const sign = score > 0 ? "+" : "-";
  if (dtm != null) return `${sign}M${Math.abs(dtm)}`;
  return score > 0 ? "+10.00" : "-10.00";
}

function pieceCount(fen: string) {
  return (fen.split(" ")[0].match(/[pnbrqkPNBRQK]/g) ?? []).length;
}

function gameOverCopy(reason: GameOverReason) {
  if (reason === "checkmate") return "Checkmate";
  if (reason === "stalemate") return "Stalemate";
  if (reason === "insufficient") return "Draw · insufficient material";
  return "Draw · threefold repetition";
}

function isValidFen(value: string) {
  try {
    new Chess(value);
    return true;
  } catch {
    return false;
  }
}

function pickFallbackMove(game: Chess) {
  const legal = game.moves({ verbose: true });
  return legal.find((m) => m.captured) ?? legal[0] ?? null;
}

export default function TablebaseChecker() {
  const [endgameQuery, setEndgameQuery] = useState("");
  const [endgameIndex, setEndgameIndex] = useState(0);
  const [board, setBoard] = useState(() => new Chess(START_FEN));
  const [fen, setFen] = useState<string>(START_FEN);
  const [fenInput, setFenInput] = useState<string>(START_FEN);
  const [fenValid, setFenValid] = useState(true);
  const [flipped, setFlipped] = useState(false);
  const [sound, setSound] = useState(true);
  const [result, setResult] = useState<TablebaseResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uciHistory, setUciHistory] = useState<string[]>([]);
  const [hintUci, setHintUci] = useState<string | null>(null);
  const hintPending = useRef(false);
  const hintFen = useRef<string | null>(null);
  const soundRef = useRef(sound);
  const [gameOver, setGameOver] = useState<GameOverReason | null>(null);
  soundRef.current = sound;
  const replyFen = useRef<string | null>(null);
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const engineUciRef = useRef<string | null>(null);
  const sawGenThink = useRef(false);
  const finishingGen = useRef(false);
  const genJob = useRef<{
    seq: number;
    fen: string;
    kind: EndgameKind;
    tries: number;
    remaining: number;
    playWhenDone: boolean;
  } | null>(null);
  const genSeq = useRef(0);
  const [deck, setDeck] = useState<EndgameDeck>(emptyDeck);
  const [activeCard, setActiveCard] = useState<EndgameCard | null>(null);
  const [pipeline, setPipeline] = useState<PipelineStatus>("idle");
  const {
    bestMove: engineUci,
    evaluation,
    isThinking,
    lines,
    depth,
    nps,
    enabled,
    settings,
    limits,
    evaluatePosition,
    stop,
    commitSettings,
    setEnabled,
  } = useStockfish();

  engineUciRef.current = engineUci;
  const humanColor: "w" | "b" = flipped ? "b" : "w";
  const selectedKind = ENDGAMES[endgameIndex]?.id ?? ENDGAMES[0].id;
  const typedCards = useMemo(
    () => deck.cards.filter((card) => card.kind === selectedKind),
    [deck.cards, selectedKind],
  );
  const building = pipeline !== "idle";
  const engineBusy = isThinking;
  const shownLines =
    building ||
    uciHistory.length > 0 ||
    activeCard?.fen !== fen ||
    !activeCard?.lines.length
      ? lines
      : activeCard?.lines;

  const pipelineLabel =
    pipeline === "generate"
      ? "Generating position…"
      : pipeline === "legal"
        ? "Checking legality…"
        : pipeline === "analyze"
          ? "Stockfish MultiPV…"
          : pipeline === "store"
            ? "Saving to deck…"
            : `${typedCards.length} ${selectedKind} in deck`;

  const haltEngine = useCallback(() => {
    stop();
    hintPending.current = false;
    hintFen.current = null;
    replyFen.current = null;
    if (replyTimer.current) {
      clearTimeout(replyTimer.current);
      replyTimer.current = null;
    }
  }, [stop]);

  const safeEvaluate = useCallback(
    (queryFen: string) => {
      if (!enabled || !fenValid || !isValidFen(queryFen)) return;
      if (!enabled) return;
      evaluatePosition(queryFen);
    },
    [enabled, evaluatePosition, fenValid, haltEngine],
  );

  const commitFen = useCallback((nextFen: string) => {
    try {
      const next = new Chess(nextFen);
      setBoard(next);
      setFen(next.fen());
      setFenInput(next.fen());
      setFenValid(true);
      setUciHistory([]);
      setGameOver(null);
      setResult(null);
      setHintUci(null);
      setError(null);
      return true;
    } catch {
      setFenValid(false);
      return false;
    }
  }, []);

  useEffect(() => {
    const stored = loadDeck();
    setDeck(stored);
    const idx = Math.min(stored.cursor, Math.max(0, stored.cards.length - 1));
    const card = stored.cards[idx];
    if (!card) return;
    setActiveCard(card);
    setEndgameIndex(
      Math.max(
        0,
        ENDGAMES.findIndex((e) => e.id === card.kind),
      ),
    );
    commitFen(card.fen);
  }, [commitFen]);

  const filteredEndgames = useMemo(() => {
    const q = endgameQuery.trim().toLowerCase();
    if (!q) return ENDGAMES.map((eg, i) => ({ eg, i }));
    return ENDGAMES.flatMap((eg, i) =>
      eg.id.toLowerCase().includes(q) ? [{ eg, i }] : [],
    );
  }, [endgameQuery]);

  const applyPlayedFen = useCallback((next: Chess, uci: string) => {
    setBoard(next);
    setFen(next.fen());
    setFenInput(next.fen());
    setFenValid(true);
    setUciHistory((prev) => [...prev, uci]);
    setResult(null);
  }, []);

  // ----------- WHERE IS "FIRST-LEGAL-MOVE" FALLBACK? -----------
  // The fallback to play the first legal move happens below, inside applyEngineReply:

  const applyEngineReply = useCallback(
    (fromFen: string, uci: string | null) => {
      if (replyFen.current !== fromFen) return false;
      let next: Chess;
      try {
        next = new Chess(fromFen);
      } catch {
        return false;
      }
      let move = null;
      // Try the UCI move
      if (uci && uci !== "(none)" && uci.length >= 4) {
        try {
          move = next.move({
            from: uci.slice(0, 2),
            to: uci.slice(2, 4),
            promotion: uci[4],
          });
        } catch {
          move = null;
        }
      }
      // If provided UCI is not valid or missing, fallback to the first legal move
      if (!move) {
        // This is the "first-legal-move fallback":
        const fallback = pickFallbackMove(next);
        if (fallback) {
          try {
            move = next.move({
              from: fallback.from,
              to: fallback.to,
              promotion: fallback.promotion,
            });
          } catch {
            move = null;
          }
        }
      }
      replyFen.current = null;
      if (replyTimer.current) {
        clearTimeout(replyTimer.current);
        replyTimer.current = null;
      }
      if (!move) {
        const reason = endReason(next);
        if (reason) setGameOver(reason);
        return true;
      }
      playMoveSfx(next, move, soundRef.current);
      applyPlayedFen(next, uciOf(move));
      const reason = endReason(next);
      if (reason) setGameOver(reason);
      return true;
    },
    [applyPlayedFen],
  );
  // -------------------------------------------------------------

  const requestEngineReply = useCallback(
    (fromFen: string) => {
      if (!isValidFen(fromFen)) return;
      const probe = new Chess(fromFen);
      if (probe.isGameOver() || probe.turn() === humanColor) return;
      if (replyFen.current === fromFen) return;
      replyFen.current = fromFen;
      if (replyTimer.current) clearTimeout(replyTimer.current);
      if (!enabled) {
        applyEngineReply(fromFen, null);
        return;
      }
      const thinkMs = Math.max(limits.searchTimeMin, settings.searchTimeMs);
      replyTimer.current = setTimeout(() => {
        applyEngineReply(fromFen, engineUciRef.current);
      }, thinkMs + 600);
      evaluatePosition(fromFen, ({ fen, bestMove }) => {
        applyEngineReply(fen, bestMove);
      });
    },
    [
      applyEngineReply,
      enabled,
      evaluatePosition,
      humanColor,
      limits.searchTimeMin,
      settings.searchTimeMs,
    ],
  );

  const loadCard = useCallback(
    (card: EndgameCard, index: number) => {
      setActiveCard(card);
      setEndgameIndex(
        Math.max(
          0,
          ENDGAMES.findIndex((e) => e.id === card.kind),
        ),
      );
      haltEngine();
      commitFen(card.fen);
      setDeck((prev) => {
        const next = { ...prev, cursor: index, updatedAt: Date.now() };
        saveDeck(next);
        return next;
      });
    },
    [commitFen, haltEngine],
  );

  const analyzeCandidate = useCallback(
    (
      fen: string,
      kind: EndgameKind,
      tries: number,
      remaining: number,
      playWhenDone: boolean,
    ) => {
      genSeq.current += 1;
      genJob.current = {
        seq: genSeq.current,
        fen,
        kind,
        tries,
        remaining,
        playWhenDone,
      };
      sawGenThink.current = false;
      finishingGen.current = false;
      setPipeline("analyze");
      if (isValidFen(fen)) evaluatePosition(fen);
    },
    [evaluatePosition],
  );

  const startCandidate = useCallback(
    (
      remaining: number,
      playWhenDone: boolean,
      tries = 0,
      kind: EndgameKind = selectedKind,
    ) => {
      setPipeline("generate");
      const seen = new Set(
        deck.cards.filter((c) => c.kind === kind).map((c) => c.fen),
      );
      const fen = generateEndgameFen(kind, seen);
      setPipeline("legal");
      if (!fen || !isLegalPlayableFen(fen) || !fenMatchesKind(fen, kind)) {
        setPipeline("idle");
        setError(`Could not find a legal ${kind} position`);
        genJob.current = null;
        return;
      }
      analyzeCandidate(fen, kind, tries, remaining, playWhenDone);
    },
    [analyzeCandidate, deck.cards, selectedKind],
  );

  const startPipeline = useCallback(
    (
      count: number,
      playWhenDone: boolean,
      kind: EndgameKind = selectedKind,
    ) => {
      haltEngine();
      genJob.current = null;
      sawGenThink.current = false;
      finishingGen.current = false;
      setError(null);
      startCandidate(Math.max(1, count), playWhenDone, 0, kind);
    },
    [haltEngine, selectedKind, startCandidate],
  );
  const handleHint = useCallback(() => {
    if (building || gameOver || board.turn() !== humanColor) return;
    const fromFen = board.fen();
    if (!fenValid || !isValidFen(fromFen)) return;
    haltEngine();
    hintFen.current = fromFen;
    hintPending.current = true;
    const existing =
      engineUciRef.current ?? lines[0]?.uci ?? result?.moves?.[0]?.uci ?? null;
    if (existing && existing.length >= 4) {
      hintPending.current = false;
      setHintUci(existing);
      return;
    }
    setHintUci(null);
    evaluatePosition(fromFen, ({ bestMove }) => {
      if (hintFen.current !== fromFen) return;
      hintPending.current = false;
      if (bestMove) setHintUci(bestMove);
    });
  }, [
    board,
    building,
    enabled,
    evaluatePosition,
    fenValid,
    gameOver,
    humanColor,
    lines,
    result,
  ]);

  const playUcis = useCallback(
    (ucis: string[]) => {
      if (building || gameOver || !ucis.length) return false;
      haltEngine();
      const next = clonePlayed(board);
      const played: string[] = [];
      for (const uci of ucis) {
        let move;
        try {
          move = next.move({
            from: uci.slice(0, 2),
            to: uci.slice(2, 4),
            promotion: uci[4],
          });
        } catch {
          return false;
        }
        if (!move) return false;
        playMoveSfx(next, move, sound);
        played.push(uciOf(move));
      }
      setBoard(next);
      setFen(next.fen());
      setFenInput(next.fen());
      setFenValid(true);
      setUciHistory((prev) => [...prev, ...played]);
      setResult(null);
      setHintUci(null);
      const reason = endReason(next);
      if (reason) setGameOver(reason);
      else if (next.turn() !== humanColor) requestEngineReply(next.fen());
      return true;
    },
    [
      board,
      building,
      gameOver,
      haltEngine,
      humanColor,
      requestEngineReply,
      sound,
    ],
  );

  const applyFen = (value: string) => {
    setFenInput(value);
    if (!commitFen(value)) return;
    haltEngine();
    setActiveCard(null);
  };

  const handlePieceDrop = useCallback(
    ({
      sourceSquare,
      targetSquare,
    }: {
      sourceSquare: string;
      targetSquare: string | null;
    }) => {
      if (!targetSquare) return false;
      if (building || gameOver || board.turn() !== humanColor) return false;

      try {
        const next = clonePlayed(board);
        const move = next.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: "q",
        });
        if (move) {
          playMoveSfx(next, move, sound);
          hintPending.current = false;
          hintFen.current = null;
          setHintUci(null);
          applyPlayedFen(next, uciOf(move));
          const reason = endReason(next);
          if (reason) {
            setGameOver(reason);
          } else {
            requestEngineReply(next.fen());
          }
          return true;
        }
      } catch {
        return false;
      }
      return false;
    },
    [
      applyPlayedFen,
      board,
      building,
      gameOver,
      humanColor,
      requestEngineReply,
      sound,
    ],
  );

  const handleReset = () => {
    haltEngine();
    commitFen(activeCard?.fen ?? ENDGAMES[endgameIndex].fen);
  };

  const loadEndgame = (index: number) => {
    if (building) return;
    const next =
      ((index % ENDGAMES.length) + ENDGAMES.length) % ENDGAMES.length;
    const kind = ENDGAMES[next].id;
    haltEngine();
    setEndgameIndex(next);
    const existing = deck.cards.filter((c) => c.kind === kind);
    if (existing.length > 0) {
      loadCard(
        existing[0],
        deck.cards.findIndex((c) => c.id === existing[0].id),
      );
      return;
    }
    setActiveCard(null);
    commitFen(ENDGAMES[next].fen);
    startPipeline(1, true, kind);
  };
  const handleNext = () => {
    if (building) return;
    const idx = typedCards.findIndex((c) => c.id === activeCard?.id);
    const queued = typedCards[idx + 1] ?? typedCards[0];
    if (queued) {
      loadCard(
        queued,
        deck.cards.findIndex((c) => c.id === queued.id),
      );
      return;
    }
    startPipeline(1, true, selectedKind);
  };

  const fillDeck = () => {
    if (building) return;
    startPipeline(DECK_BATCH, false, selectedKind);
  };

  const fetchEvaluation = useCallback(async (queryFen: string) => {
    if (!isLegalChessFen(queryFen)) {
      setResult(null);
      setError("Illegal FEN: opponent is in check on the side to move");
      return;
    }
    if (pieceCount(queryFen) > 7) {
      setResult(null);
      setError("Tablebase supports at most 7 pieces");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/tablebase?fen=${encodeURIComponent(queryFen)}`,
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Could not load tablebase");
      }

      setResult(data);
    } catch (err: unknown) {
      setResult(null);
      setError(err instanceof Error ? err.message : "Tablebase error");
    } finally {
      setLoading(false);
    }
  }, []);

  const boardOptions = useMemo(
    () => ({
      id: "tablebase-board",
      position: fen,
      boardOrientation: (flipped ? "black" : "white") as "white" | "black",
      allowDragging: !building && !gameOver && board.turn() === humanColor,
      allowDrawingArrows: false,
      squareStyles:
        hintUci && hintUci.length >= 4
          ? {
              [hintUci.slice(0, 2)]: {
                boxShadow: "inset 0 0 0 3px rgba(232, 197, 121, 0.95)",
              },
              [hintUci.slice(2, 4)]: {
                boxShadow: "inset 0 0 0 3px rgba(127, 192, 175, 0.95)",
              },
            }
          : {},
      arrows:
        hintUci && hintUci.length >= 4
          ? ([
              {
                startSquare: hintUci.slice(0, 2),
                endSquare: hintUci.slice(2, 4),
                color: "#e8c579",
              },
            ] as Arrow[])
          : [],
      allowDragOffBoard: false,
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
    [
      board,
      building,
      fen,
      flipped,
      gameOver,
      handlePieceDrop,
      hintUci,
      humanColor,
    ],
  );

  useEffect(() => {
    if (!fenValid || building) return;
    const id = window.setTimeout(() => {
      void fetchEvaluation(board.fen());
    }, 350);
    return () => window.clearTimeout(id);
  }, [board, building, fenValid, fetchEvaluation]);

  useEffect(() => {
    if (!fenValid || building || gameOver) return;
    if (!isValidFen(fen)) return;
    try {
      const probe = new Chess(fen);
      if (probe.isGameOver() || probe.turn() === humanColor) return;
    } catch {
      return;
    }
    requestEngineReply(fen);
  }, [building, fen, fenValid, gameOver, humanColor, requestEngineReply]);

  useEffect(() => {
    if (!enabled || !fenValid || building || gameOver) return;
    if (!isValidFen(fen)) return;
    try {
      const probe = new Chess(fen);
      if (probe.isGameOver() || probe.turn() !== humanColor) return;
    } catch {
      return;
    }
    evaluatePosition(fen);
  }, [
    building,
    enabled,
    evaluatePosition,
    fen,
    fenValid,
    gameOver,
    humanColor,
  ]);

  useEffect(() => {
    return () => {
      if (replyTimer.current) clearTimeout(replyTimer.current);
    };
  }, []);

  const finishGenJob = useCallback(
    (force = false) => {
      const job = genJob.current;
      if (!job || finishingGen.current) return;
      finishingGen.current = true;
      sawGenThink.current = false;
      genJob.current = null;

      if (!force && !isWinningEval(evaluation) && job.tries < 12) {
        void startCandidate(
          job.remaining,
          job.playWhenDone,
          job.tries + 1,
          job.kind,
        );
        return;
      }

      setPipeline("store");
      const card = makeCard({
        fen: job.fen,
        kind: job.kind,
        evaluation,
        bestMove: engineUci,
        depth,
        lines,
      });
      const nextDeck = upsertCard(deck, card);
      setDeck(nextDeck);
      const cardIndex = nextDeck.cards.findIndex((c) => c.fen === card.fen);

      const remaining = job.remaining - 1;
      if (remaining > 0) {
        void startCandidate(remaining, job.playWhenDone, 0, job.kind);
        return;
      }

      finishingGen.current = false;
      setPipeline("idle");
      if (job.playWhenDone) {
        loadCard(nextDeck.cards[cardIndex] ?? card, Math.max(0, cardIndex));
      }
    },
    [deck, depth, engineUci, evaluation, lines, loadCard, startCandidate],
  );

  useEffect(() => {
    if (pipeline !== "analyze") return;
    const job = genJob.current;
    if (!job || finishingGen.current) return;
    if (isThinking) {
      sawGenThink.current = true;
      return;
    }
    if (!sawGenThink.current) return;
    finishGenJob();
  }, [engineUci, evaluation, finishGenJob, isThinking, lines, pipeline]);

  useEffect(() => {
    if (pipeline !== "analyze") return;
    const seq = genJob.current?.seq;
    const timer = window.setTimeout(() => {
      const job = genJob.current;
      if (!job || job.seq !== seq || finishingGen.current) return;
      finishGenJob(true);
    }, 8000);
    return () => window.clearTimeout(timer);
  }, [finishGenJob, pipeline]);

  return (
    <div className="flex min-h-0 flex-col overflow-y-auto p-2 pb-24 xl:h-[calc(100dvh-5.5rem)] xl:max-h-[calc(100dvh-5.5rem)] xl:overflow-hidden xl:p-1 xl:pb-1">
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-12 xl:items-stretch xl:gap-5 xl:overflow-hidden">
        <div
          className="flex min-h-0 min-w-0 w-full flex-col items-center xl:col-span-8 xl:h-full xl:overflow-hidden"
          style={{ background: "none", containerType: "inline-size" }}
        >
          <div className="flex min-h-0 w-full max-w-[min(100%,calc(100dvh-9rem))] flex-1 flex-col items-center gap-2 xl:max-h-full xl:max-w-none">
            <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col">
              <div className="mb-1.5 flex w-full shrink-0 items-center justify-between px-1 xl:w-[min(100cqw,calc(100dvh-10rem))]">
                <span className="text-xs font-mono text-[var(--color-text-muted,#7d735d)]">
                  Turn: {board.turn() === "w" ? "White" : "Black"}
                  {board.inCheck() ? " · check" : ""}
                  {engineBusy ? " · engine" : ""}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleHint}
                    disabled={
                      building || !!gameOver || board.turn() !== humanColor
                    }
                    aria-label="Show hint"
                    className="grid h-7 w-7 place-items-center rounded-md border border-border-default bg-bg-surface text-text-secondary transition-colors hover:border-accent-gold/50 hover:text-accent-gold-bright active:scale-95 disabled:opacity-40"
                  >
                    <Lightbulb className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
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
                    type="button"
                    onClick={() => setFlipped((prev) => !prev)}
                    aria-label="Flip board"
                    className="grid h-7 w-7 place-items-center rounded-md border border-border-default bg-bg-surface text-text-secondary transition-colors hover:border-accent-teal/50 hover:text-accent-teal-bright active:scale-95"
                  >
                    <FlipVertical2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    aria-label="Restart position"
                    className="grid h-7 w-7 place-items-center rounded-md border border-border-default bg-bg-surface text-text-secondary transition-colors hover:border-accent-garnet/50 hover:text-accent-garnet-bright active:scale-95"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="relative flex min-h-0 w-full flex-1 items-stretch xl:h-auto xl:w-[min(100cqw,calc(100dvh-10rem))] xl:flex-none xl:aspect-square">
                <div className="relative aspect-square min-w-0 flex-1">
                  <div className="flex h-full w-full items-center justify-center rounded-xl border border-[var(--color-border-default,#3a3122)] p-1.5 shadow-board wood-grain sm:rounded-2xl sm:p-2.5">
                    <div className="relative h-full w-full overflow-visible rounded-lg ring-1 ring-black/40">
                      <Chessboard options={boardOptions} />
                    </div>
                  </div>
                </div>
              </div>
              {gameOver && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
                  <div className="w-full max-w-sm rounded-xl border border-border-default bg-bg-surface p-4 shadow-lg">
                    <p className="mb-3 font-serif-display text-[15px] text-text-primary">
                      {gameOverCopy(gameOver)}
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="flex-1 rounded-lg border border-border-default bg-bg-elevated px-3 py-2 text-sm text-text-primary hover:border-accent-garnet/50"
                      >
                        Replay
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={building}
                        className="flex-1 rounded-lg border border-accent-gold/40 bg-bg-elevated px-3 py-2 text-sm text-accent-gold-bright hover:border-accent-gold/70 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex min-h-0 w-full flex-col gap-3 xl:col-span-4 xl:h-full xl:min-h-0 xl:overflow-hidden">
          <section
            aria-label="Endgame catalog"
            className="flex min-h-0 shrink-0 flex-col gap-1.5 rounded-xl border border-border-default bg-bg-surface p-3 xl:max-h-[38%] xl:flex-none"
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-serif-display text-[15px] text-text-primary">
                Endgame type
              </h2>
              <span className="truncate font-mono text-[10px] text-accent-gold-bright">
                {ENDGAMES[endgameIndex]?.id}{" "}
                <span className="text-text-muted">
                  {filteredEndgames.length}/{ENDGAMES.length}
                </span>
              </span>
            </div>
            <input
              type="search"
              value={endgameQuery}
              onChange={(e) => setEndgameQuery(e.target.value)}
              placeholder="Filter types…"
              className="w-full rounded-md border border-border-default bg-bg-elevated px-2 py-1 font-mono text-[11px] text-text-primary outline-none placeholder:text-text-muted focus:border-accent-gold/50"
            />
            <div className="grid max-h-24 grid-cols-2 gap-1 overflow-y-auto sm:grid-cols-3 xl:max-h-36 xl:grid-cols-2">
              {filteredEndgames.map(({ eg, i }) => (
                <button
                  key={eg.id}
                  type="button"
                  onClick={() => loadEndgame(i)}
                  disabled={building}
                  className={`truncate rounded-md border px-1.5 py-1 text-left font-mono text-[10px] disabled:opacity-50 ${
                    i === endgameIndex
                      ? "border-accent-gold/60 bg-accent-gold/10 text-accent-gold-bright"
                      : "border-border-default text-text-secondary hover:border-accent-gold/30"
                  }`}
                >
                  {eg.id}
                </button>
              ))}
            </div>
          </section>

          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden rounded-xl border border-[var(--color-border-subtle,#221d17)] bg-[var(--color-bg-surface,#131110)] p-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-serif-display text-[15px] text-text-primary">
                Deck
              </h2>
              <span className="font-mono text-[10px] text-text-muted">
                {pipelineLabel}
              </span>
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={handleNext}
                disabled={building}
                className="flex-1 rounded-lg border border-accent-gold/35 bg-[var(--color-bg-elevated,#1c1815)] px-3 py-1.5 text-xs font-semibold text-accent-gold-bright hover:border-accent-gold/70 disabled:opacity-50"
              >
                {building ? "Working…" : "Next"}
              </button>
              <button
                type="button"
                onClick={fillDeck}
                disabled={building}
                className="flex-1 rounded-lg border border-border-default bg-bg-elevated px-3 py-1.5 text-xs text-text-primary hover:border-accent-teal/50 disabled:opacity-50"
              >
                Fill deck
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                if (!fenValid) {
                  setError("Invalid FEN");
                  return;
                }
                void fetchEvaluation(board.fen());
              }}
              disabled={loading || !fenValid || building}
              className="rounded-lg border border-border-default bg-bg-elevated px-3 py-1.5 text-xs text-text-secondary hover:border-accent-gold/50 disabled:opacity-50"
            >
              {loading ? "Looking up…" : "Refresh tablebase"}
            </button>
            {error && (
              <p className="text-[11px] text-accent-garnet-bright">{error}</p>
            )}
            {/* {result && (
              <div className="rounded-md border border-border-default bg-bg-elevated p-2">
                <div className="mb-1 flex items-center justify-between font-mono text-[10px] text-text-secondary">
                  <span className="uppercase text-accent-gold-bright">
                    {result.category}
                  </span>
                  <span>
                    {formatTbEval(result.category, result.dtm, board.turn())}
                    {result.dtz != null ? ` · DTZ ${result.dtz}` : ""}
                  </span>
                </div>
                <div className="flex max-h-20 flex-wrap gap-1 overflow-y-auto">
                  {result.moves.slice(0, 12).map((move) => (
                    <button
                      key={move.uci}
                      type="button"
                      disabled={building || Boolean(gameOver)}
                      onClick={() => playUcis([move.uci])}
                      className="rounded border border-border-default px-1.5 py-0.5 font-mono text-[10px] text-text-secondary hover:border-accent-gold/40 disabled:opacity-50"
                    >
                      {move.san}
                    </button>
                  ))}
                </div>
              </div>
            )} */}
            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              {typedCards.length === 0 ? (
                <p className="text-[11px] italic text-text-muted">
                  No {selectedKind} cards yet. Choose a type to generate one.
                </p>
              ) : (
                <ul className="flex flex-col gap-1">
                  {typedCards.map((card, i) => (
                    <li key={card.id}>
                      <button
                        type="button"
                        disabled={building}
                        onClick={() =>
                          loadCard(
                            card,
                            deck.cards.findIndex((c) => c.id === card.id),
                          )
                        }
                        className={`flex w-full items-center justify-between rounded-md border px-2 py-1 text-left font-mono text-[10px] disabled:opacity-50 ${
                          activeCard?.id === card.id
                            ? "border-accent-gold/60 text-accent-gold-bright"
                            : "border-border-default text-text-secondary"
                        }`}
                      >
                        <span>
                          {i + 1}. {card.kind}
                        </span>
                        <span>
                          {card.evaluation == null
                            ? "—"
                            : card.evaluation > 0
                              ? `+${card.evaluation.toFixed(2)}`
                              : card.evaluation.toFixed(2)}{" "}
                          · {card.lines.length} pv
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="flex min-h-0 shrink-0 flex-col gap-3 overflow-y-auto xl:min-h-0 xl:max-h-[42%]">
            <StockfishDashboard
              evalScore={evaluation}
              isAnalyzing={isThinking}
              onStart={() => {
                if (building || !fenValid) return;
                safeEvaluate(board.fen());
              }}
              onStop={haltEngine}
              settings={settings}
              limits={limits}
              depth={depth}
              nps={nps}
              onSettingsChange={commitSettings}
              analysisLines={shownLines}
              onPlayMove={playUcis}
              turn={board.turn()}
              moveNumber={Number(board.fen().split(" ")[5] ?? 1)}
              fen={board.fen()}
              enabled={enabled}
              onToggleEnabled={() => {
                const next = !enabled;
                setEnabled(next);
                if (!next) {
                  if (!enabled) return;
                  return;
                }
                if (fenValid && isValidFen(board.fen())) {
                  if (!enabled && !result?.moves?.[0]?.uci) return;
                  evaluatePosition(board.fen());
                }
              }}
            />

            <div className="flex min-h-[72px] flex-col overflow-hidden rounded-xl border border-[var(--color-border-subtle,#221d17)] bg-[var(--color-bg-surface,#131110)] p-3">
              <h2 className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted,#7d735d)] font-mono mb-1.5 shrink-0">
                UCI
              </h2>
              <div className="flex-1 overflow-y-auto pr-1 flex flex-wrap gap-1 content-start font-mono text-xs">
                {uciHistory.length === 0 ? (
                  <span className="text-[var(--color-text-muted,#7d735d)] italic text-xs">
                    No moves yet
                  </span>
                ) : (
                  uciHistory.map((uci, index) => (
                    <span
                      key={`${uci}-${index}`}
                      className="px-1.5 py-0.5 bg-[var(--color-bg-elevated,#1c1815)] border border-[var(--color-border-subtle,#221d17)] rounded text-[var(--color-text-secondary,#b9ac91)] text-xs"
                    >
                      {index % 2 === 0 ? `${Math.floor(index / 2) + 1}. ` : ""}
                      {uci}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="bg-[var(--color-bg-surface,#131110)] p-2 rounded-xl border border-[var(--color-border-subtle,#221d17)] shrink-0">
              <span className="text-[8px] uppercase font-mono text-[var(--color-text-muted,#7d735d)] block mb-0.5">
                FEN
              </span>
              <input
                type="text"
                value={fenInput}
                onChange={(e) => applyFen(e.target.value)}
                spellCheck={false}
                className={`w-full bg-transparent font-mono text-[9px] outline-none select-all ${
                  fenValid
                    ? "text-[var(--color-text-muted,#7d735d)]"
                    : "text-accent-garnet-bright"
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
