import { useCallback, useRef, useState } from "react";
import { Chess } from "chess.js";
import type { TablebaseResponse } from "@/app/api/tablebase/route";
import { useStockfish } from "@/lib/chess/use-stockfish";
import {
  fenMatchesKind,
  isLegalPlayableFen,
} from "@/lib/tablebase/chess/fen-legal";
import { generateEndgameFen } from "@/lib/tablebase/chess/generate";
import {
  isWinningEval,
  makeCard,
  upsertCard,
} from "@/lib/tablebase/chess/deck";
import type {
  EndgameCard,
  EndgameDeck,
  EndgameKind,
  GameOverReason,
  PipelineStatus,
} from "@/lib/tablebase/chess/types";
import {
  endReason,
  pickFallbackMove,
  playUci,
  uciOf,
} from "@/lib/tablebase/chess/moves";

export function isValidFen(fen: string): boolean {
  try {
    // chess.js throws if FEN is invalid
    new Chess(fen);
    return true;
  } catch {
    return false;
  }
}

// Default implementation for clonePlayed
export function clonePlayed(board: Chess): Chess {
  // Clone the given chess.js board object
  return new Chess(board.fen());
}

// Default stub for playMoveSfx
export function playMoveSfx(
  board: Chess,
  move: { from: string; to: string; promotion?: string },
  sound: boolean
) {
  // Implementation stub: play move sound if wanted
  // No-op for now or plug into real sound effect logic
}

// Default implementation for tablebaseScore
export function tablebaseScore(category: string, color: "w" | "b"): number | null {
  // Example: +100 for won, -100 for lost, 0 for drawn (adapt to real categories)
  if (category === "win") return color === "w" ? 100 : -100;
  if (category === "loss") return color === "w" ? -100 : 100;
  if (category === "draw") return 0;
  return null;
}

export function useTablebasePipeline(
  selectedKind: EndgameKind,
  humanColor: "w" | "b",
  sound: boolean,
  commitFen: (fen: string) => boolean,
  setBoard: (board: Chess) => void,
  board: Chess,
) {
  const [pipeline, setPipeline] = useState<PipelineStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState<GameOverReason | null>(null);
  const [uciHistory, setUciHistory] = useState<string[]>([]);
  const [hintUci, setHintUci] = useState<string | null>(null);

  const fillSeq = useRef(0);
  const hintPending = useRef(false);
  const hintFen = useRef<string | null>(null);
  const replyFen = useRef<string | null>(null);
  const repliedFen = useRef<string | null>(null);
  const engineUciRef = useRef<string | null>(null);
  const soundRef = useRef(sound);
  soundRef.current = sound;

  const building = pipeline !== "idle";

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
    resultFen,
  } = useStockfish();

  engineUciRef.current = engineUci;

  const haltEngine = useCallback(() => {
    stop();
    hintPending.current = false;
    hintFen.current = null;
    replyFen.current = null;
  }, [stop]);

  const applyPlayedFen = useCallback(
    (next: Chess, uci: string) => {
      commitFen(next.fen());
      setUciHistory((prev) => [...prev, uci]);
    },
    [commitFen],
  );

  const applyEngineReply = useCallback(
    (fromFen: string, uci: string | null) => {
      if (replyFen.current !== fromFen || repliedFen.current === fromFen)
        return false;
      let next: Chess;
      try {
        next = new Chess(fromFen);
      } catch {
        return false;
      }
      let move = null;
      if (uci && uci !== "(none)" && uci.length >= 4) {
        move = playUci(next, uci);
      }
      if (!move) {
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
      repliedFen.current = fromFen;
      replyFen.current = null;
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

  const requestEngineReply = useCallback(
    (fromFen: string) => {
      if (!isValidFen(fromFen)) return;
      const probe = new Chess(fromFen);
      if (
        probe.isGameOver() ||
        probe.turn() === humanColor ||
        replyFen.current === fromFen
      )
        return;
      replyFen.current = fromFen;
      if (!enabled) return;
      evaluatePosition(fromFen, ({ bestMove }) => {
        applyEngineReply(fromFen, bestMove);
      });
    },
    [applyEngineReply, humanColor, enabled, evaluatePosition],
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

  const startPipeline = useCallback(
    async (
      count: number,
      playWhenDone: boolean,
      deckRef: React.MutableRefObject<EndgameDeck>,
      setDeck: React.Dispatch<React.SetStateAction<EndgameDeck>>,
      loadCard: (card: EndgameCard, index: number) => void,
      kind: EndgameKind = selectedKind,
    ) => {
      const seq = ++fillSeq.current;
      haltEngine();
      setError(null);
      setPipeline("generate");

      const seen = new Set(
        deckRef.current.cards.filter((c) => c.kind === kind).map((c) => c.fen),
      );
      let remaining = Math.max(1, count);
      let last: { card: EndgameCard; deck: EndgameDeck } | null = null;

      while (remaining > 0) {
        if (seq !== fillSeq.current) return;
        let stored = false;
        for (let tries = 0; tries < 12; tries++) {
          if (seq !== fillSeq.current) return;
          setPipeline("generate");
          const nextFen = generateEndgameFen(kind, seen);
          if (!nextFen) break;
          seen.add(nextFen);
          setPipeline("legal");
          if (!isLegalPlayableFen(nextFen) || !fenMatchesKind(nextFen, kind))
            continue;

          commitFen(nextFen);
          setPipeline("analyze");

          let snapEval: number | null = null;
          let snapMove: string | null = null;
          try {
            const ac = new AbortController();
            const timer = window.setTimeout(() => ac.abort(), 6000);
            const res = await fetch(
              `/api/tablebase?fen=${encodeURIComponent(nextFen)}`,
              {
                signal: ac.signal,
              },
            );
            window.clearTimeout(timer);
            const data = (await res.json()) as TablebaseResponse & {
              error?: string;
            };
            if (res.ok && data.category) {
              snapEval = tablebaseScore(data.category, "w");
              snapMove = data.moves?.[0]?.uci ?? null;
            }
          } catch {}

          if (!isWinningEval(snapEval) && tries < 11) continue;

          setPipeline("store");
          const card = makeCard({
            fen: nextFen,
            kind,
            evaluation: snapEval,
            bestMove: snapMove,
            depth: 0,
            lines: [],
          });
          const nextDeck = upsertCard(deckRef.current, card);
          setDeck(nextDeck);
          last = { card, deck: nextDeck };
          remaining -= 1;
          stored = true;
          break;
        }
        if (!stored) {
          setError(`Could not find a legal ${kind} position`);
          break;
        }
      }

      if (seq !== fillSeq.current) return;
      setPipeline("idle");
      if (playWhenDone && last) {
        const cardIndex = last.deck.cards.findIndex(
          (c) => c.fen === last.card.fen,
        );
        loadCard(
          last.deck.cards[cardIndex] ?? last.card,
          Math.max(0, cardIndex),
        );
      } else if (last) {
        evaluatePosition(last.card.fen);
      }
    },
    [commitFen, haltEngine, selectedKind, evaluatePosition],
  );

  return {
    pipeline,
    setPipeline,
    error,
    setError,
    gameOver,
    setGameOver,
    uciHistory,
    setUciHistory,
    hintUci,
    setHintUci,
    hintPending,
    hintFen,
    replyFen,
    repliedFen,
    engineUciRef,
    evaluation,
    isThinking,
    lines,
    depth,
    nps,
    enabled,
    settings,
    commitSettings,
    setEnabled,
    resultFen,
    limits,
    evaluatePosition,
    haltEngine,
    applyPlayedFen,
    applyEngineReply,
    requestEngineReply,
    startPipeline,
    handlePieceDrop,
  };
}