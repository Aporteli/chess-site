"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  TablebaseMove,
  TablebaseResponse,
} from "@/app/api/tablebase/route";
import { Chess } from "chess.js";
import { Chessboard, type Arrow } from "react-chessboard";
import {
  Camera,
  FlipVertical2,
  Lightbulb,
  RotateCcw,
  Trash2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { playSfx, sfxForMove } from "@/lib/chess/sounds";
import { useStockfish, type EngineLine } from "@/lib/chess/use-stockfish";
import StockfishDashboard from "@/components/stockfish/StockfishDashboard";
import { UploadBoardModal } from "@/components/board/UploadBoardModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  DECK_BATCH,
  ENDGAMES,
  endgameIcons,
  fenMatchesKind,
  generateEndgameFen,
  isLegalPlayableFen,
  isLegalChessFen,
  isWinningEval,
  listEndgames,
  loadDeck,
  hydrateCustomKinds,
  makeCard,
  registerEndgameFromFen,
  removeAllCards,
  removeAllEndgameKinds,
  removeCard,
  removeCardsByKind,
  removeEndgameKind,
  saveDeck,
  upsertCard,
} from "@/lib/chess/endgame-deck";

import {
  type EndgameCard,
  type EndgameDeck,
  type EndgameKind,
} from "@/lib/tablebase/types";

const START_FEN = ENDGAMES[0].fen;

type PipelineStatus = "idle" | "generate" | "legal" | "analyze" | "store";
type ConfirmRequest = {
  title: string;
  body: string;
  confirmLabel?: string;
  run: () => void;
};

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

function playUci(game: Chess, uci: string) {
  const from = uci.slice(0, 2);
  const to = uci.slice(2, 4);
  const promotion = uci.length > 4 ? uci[4].toLowerCase() : undefined;
  try {
    return game.move({ from, to, promotion });
  } catch {
    try {
      return game.move({ from, to });
    } catch {
      return null;
    }
  }
}

function pickFallbackMove(game: Chess) {
  const legal = game.moves({ verbose: true });
  return legal.find((m) => m.captured) ?? legal[0] ?? null;
}

function isValidFen(value: string) {
  try {
    new Chess(value);
    return true;
  } catch {
    return false;
  }
}

function tablebaseLines(
  moves: TablebaseMove[] | undefined,
  turn: "w" | "b",
): EngineLine[] {
  return (moves ?? []).slice(0, 5).map((move, i) => ({
    multipv: i + 1,
    uci: move.uci,
    pv: move.uci,
    evaluation: tablebaseScore(move.category, turn),
    depth: move.dtm ?? 0,
  }));
}

export default function TablebaseChecker() {
  const [endgameQuery, setEndgameQuery] = useState("");
  const [endgameIndex, setEndgameIndex] = useState(0);
  const [catalog, setCatalog] = useState(ENDGAMES);
  const [isUploadBoardOpen, setIsUploadBoardOpen] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmRequest | null>(null);
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
  const repliedFen = useRef<string | null>(null);
  const engineUciRef = useRef<string | null>(null);
  const fillSeq = useRef(0);
  const [deck, setDeck] = useState<EndgameDeck>(() => ({
    id: "deck",
    name: "Endgame deck",
    cards: [],
    cursor: 0,
    updatedAt: 0,
  }));
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
    resultFen,
  } = useStockfish();

  engineUciRef.current = engineUci;
  const deckRef = useRef(deck);
  deckRef.current = deck;
  const humanColor: "w" | "b" = flipped ? "b" : "w";
  const selectedKind =
    catalog[endgameIndex]?.id ?? catalog[0]?.id ?? ENDGAMES[0].id;
  const typedCards = useMemo(
    () => deck.cards.filter((card) => card.kind === selectedKind),
    [deck.cards, selectedKind],
  );
  const building = pipeline !== "idle";
  const engineBusy = isThinking;
  const shownLines =
    uciHistory.length > 0 || activeCard?.fen !== fen
      ? lines
      : lines.length > 0
        ? lines
        : (activeCard?.lines ?? []);

  const pipelineLabel =
    pipeline === "generate"
      ? "Generating position…"
      : pipeline === "legal"
        ? "Checking legality…"
        : pipeline === "analyze"
          ? "Stockfish MultiPV…"
          : pipeline === "store"
            ? "Saving to deck…"
            : `${typedCards.length} ${endgameIcons(selectedKind)} in deck`;

  const haltEngine = useCallback(() => {
    stop();
    hintPending.current = false;
    hintFen.current = null;
    replyFen.current = null;
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
      replyFen.current = null;
      repliedFen.current = null;
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
    hydrateCustomKinds();
    const stored = loadDeck();
    setCatalog(listEndgames());
    setDeck(stored);
    const idx = Math.min(stored.cursor, Math.max(0, stored.cards.length - 1));
    const card = stored.cards[idx];
    if (!card) return;
    setActiveCard(card);
    setEndgameIndex(
      Math.max(
        0,
        listEndgames().findIndex((e) => e.id === card.kind),
      ),
    );
    commitFen(card.fen);
  }, [commitFen]);

  const filteredEndgames = useMemo(() => {
    const q = endgameQuery.trim().toLowerCase();
    if (!q) return catalog.map((eg, i) => ({ eg, i }));
    return catalog.flatMap((eg, i) =>
      eg.id.toLowerCase().includes(q) || eg.icons.includes(q)
        ? [{ eg, i }]
        : [],
    );
  }, [catalog, endgameQuery]);

  const applyPlayedFen = useCallback((next: Chess, uci: string) => {
    setBoard(next);
    setFen(next.fen());
    setFenInput(next.fen());
    setFenValid(true);
    setUciHistory((prev) => [...prev, uci]);
    setResult(null);
  }, []);

  //ეს ფუნქცია პასუხისმგებელია ჭადრაკის ძრავის (Engine / Stockfish / Tablebase) მიერ შემოთავაზებული პასუხის (სვლის) დაფაზე განხორციელებაზე.

  const applyEngineReply = useCallback(
    (fromFen: string, uci: string | null) => {
      if (replyFen.current !== fromFen) return false;
      if (repliedFen.current === fromFen) return false;
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
      if (probe.isGameOver() || probe.turn() === humanColor) return;
      if (replyFen.current === fromFen) return;
      replyFen.current = fromFen;
      if (!enabled) return;
      evaluatePosition(fromFen, ({ bestMove }) => {
        applyEngineReply(fromFen, bestMove);
      });
    },
    [applyEngineReply, enabled, evaluatePosition, humanColor],
  );

  const loadCard = useCallback(
    (card: EndgameCard, index: number) => {
      setActiveCard(card);
      setEndgameIndex(
        Math.max(
          0,
          catalog.findIndex((e) => e.id === card.kind),
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
    [catalog, commitFen, haltEngine],
  );

  const startPipeline = useCallback(
    async (
      count: number,
      playWhenDone: boolean,
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
          if (!isLegalPlayableFen(nextFen) || !fenMatchesKind(nextFen, kind)) {
            continue;
          }
          commitFen(nextFen);
          setPipeline("analyze");

          let snapEval: number | null = null;
          let snapMove: string | null = null;
          try {
            const ac = new AbortController();
            const timer = window.setTimeout(() => ac.abort(), 6000);
            const res = await fetch(
              `/api/tablebase?fen=${encodeURIComponent(nextFen)}`,
              { signal: ac.signal },
            );
            window.clearTimeout(timer);
            const data = (await res.json()) as TablebaseResponse & {
              error?: string;
            };
            if (res.ok && data.category) {
              snapEval = tablebaseScore(data.category, "w");
              snapMove = data.moves?.[0]?.uci ?? null;
            }
          } catch {
            /* keep generating even if tablebase is down */
          }

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
    [commitFen, evaluatePosition, haltEngine, loadCard, selectedKind],
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

  //ეს ფუნქცია ჭადრაკის დაფაზე სვლების სიას (მაგალითად: ["e2e4", "e7e5"]) სათითაოდ, ავტომატურად ათამაშებს და განახლებს ჭადრაკის დაფაზე.

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

//ეს ფუნქცია მართავს მოთამაშის (ადამიანის) მიერ დაფაზე ფიგურის ხელით გადაადგილებას (Drag & Drop-ს).

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
    commitFen(activeCard?.fen ?? catalog[endgameIndex]?.fen ?? START_FEN);
  };

  const loadEndgame = (index: number) => {
    if (building || catalog.length === 0) return;
    const next = ((index % catalog.length) + catalog.length) % catalog.length;
    const kind = catalog[next].id;
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
    commitFen(catalog[next].fen);
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

  const revealKind = useCallback(
    (
      kind: EndgameKind,
      nextDeck: EndgameDeck,
      nextCatalog = listEndgames(),
    ) => {
      setCatalog(nextCatalog);
      const idx = nextCatalog.findIndex((e) => e.id === kind);
      const entry = idx >= 0 ? nextCatalog[idx] : nextCatalog[0];
      setEndgameIndex(Math.max(0, idx));
      const existing = entry
        ? nextDeck.cards.filter((c) => c.kind === entry.id)
        : [];
      if (existing[0]) {
        loadCard(
          existing[0],
          nextDeck.cards.findIndex((c) => c.id === existing[0].id),
        );
        return;
      }
      setActiveCard(null);
      haltEngine();
      commitFen(entry?.fen ?? START_FEN);
    },
    [commitFen, haltEngine, loadCard],
  );

  const askConfirm = (request: ConfirmRequest) => {
    if (building) return;
    setConfirm(request);
  };

  const deleteKind = (kind: EndgameKind) => {
    const label = endgameIcons(kind);
    askConfirm({
      title: "Delete this type?",
      body: `${label} and every variation stored under it will be removed.`,
      run: () => {
        removeEndgameKind(kind);
        const nextDeck = removeCardsByKind(deckRef.current, kind);
        setDeck(nextDeck);
        const nextCatalog = listEndgames();
        if (selectedKind === kind) {
          revealKind(
            nextCatalog[0]?.id ?? ENDGAMES[0].id,
            nextDeck,
            nextCatalog,
          );
          return;
        }
        setCatalog(nextCatalog);
        setEndgameIndex((i) => {
          const next = nextCatalog.findIndex((e) => e.id === selectedKind);
          return next >= 0
            ? next
            : Math.min(i, Math.max(0, nextCatalog.length - 1));
        });
      },
    });
  };

  const deleteAllKinds = () => {
    if (catalog.length === 0) return;
    askConfirm({
      title: "Delete all types?",
      body: "Every endgame type and all of their variations will be removed. This cannot be undone.",
      confirmLabel: "Delete all",
      run: () => {
        removeAllEndgameKinds();
        const nextDeck = removeAllCards(deckRef.current);
        setDeck(nextDeck);
        setCatalog([]);
        setEndgameIndex(0);
        setActiveCard(null);
        haltEngine();
        commitFen(START_FEN);
      },
    });
  };

  const deleteVariation = (cardId: string) => {
    askConfirm({
      title: "Delete this variation?",
      body: "This position will be removed from the list. You can scan or generate it again later.",
      run: () => {
        const nextDeck = removeCard(deckRef.current, cardId);
        setDeck(nextDeck);
        if (activeCard?.id !== cardId) return;
        const remaining = nextDeck.cards.filter((c) => c.kind === selectedKind);
        if (remaining[0]) {
          loadCard(
            remaining[0],
            nextDeck.cards.findIndex((c) => c.id === remaining[0].id),
          );
          return;
        }
        setActiveCard(null);
        haltEngine();
        commitFen(catalog[endgameIndex]?.fen ?? START_FEN);
      },
    });
  };

  const deleteAllVariations = (kind: EndgameKind = selectedKind) => {
    if (typedCards.length === 0) return;
    askConfirm({
      title: "Delete all variations?",
      body: `All ${typedCards.length} variation${typedCards.length === 1 ? "" : "s"} for ${endgameIcons(kind)} will be removed.`,
      confirmLabel: "Delete all",
      run: () => {
        const nextDeck = removeCardsByKind(deckRef.current, kind);
        setDeck(nextDeck);
        setActiveCard(null);
        haltEngine();
        commitFen(catalog[endgameIndex]?.fen ?? START_FEN);
      },
    });
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

  const handlePositionLoaded = useCallback(
    (loadedFen: string) => {
      let game: Chess;
      try {
        game = new Chess(loadedFen);
      } catch {
        return false;
      }
      const kind = registerEndgameFromFen(game.fen());
      if (!kind) {
        setError("Could not read both kings from that diagram");
        return false;
      }
      const nextCatalog = listEndgames();
      setCatalog(nextCatalog);
      setEndgameIndex(
        Math.max(
          0,
          nextCatalog.findIndex((e) => e.id === kind),
        ),
      );
      haltEngine();
      commitFen(game.fen());
      repliedFen.current = game.fen();

      const scannedFen = game.fen();
      const turn = game.turn();
      void (async () => {
        let snapEval: number | null = null;
        let snapMove: string | null = null;
        let tbLines: EngineLine[] = [];
        if (pieceCount(scannedFen) <= 7 && isLegalChessFen(scannedFen)) {
          try {
            const ac = new AbortController();
            const timer = window.setTimeout(() => ac.abort(), 6000);
            const res = await fetch(
              `/api/tablebase?fen=${encodeURIComponent(scannedFen)}`,
              { signal: ac.signal },
            );
            window.clearTimeout(timer);
            const data = (await res.json()) as TablebaseResponse & {
              error?: string;
            };
            if (res.ok && data.category) {
              setResult(data);
              snapEval = tablebaseScore(data.category, turn);
              snapMove = data.moves?.[0]?.uci ?? null;
              tbLines = tablebaseLines(data.moves, turn);
            }
          } catch {
            /* engine still fills variations */
          }
        }
        const card = makeCard({
          fen: scannedFen,
          kind,
          evaluation: snapEval,
          bestMove: snapMove,
          depth: 0,
          lines: tbLines,
        });
        const nextDeck = upsertCard(deckRef.current, card);
        setDeck(nextDeck);
        const stored = nextDeck.cards.find((c) => c.fen === scannedFen) ?? card;
        setActiveCard(stored);
        evaluatePosition(scannedFen, ({ bestMove }) => {
          if (!bestMove) return;
          const withMove = {
            ...stored,
            bestMove,
            lines: stored.lines.length ? stored.lines : tbLines,
          };
          setDeck(upsertCard(deckRef.current, withMove));
          setActiveCard((prev) =>
            prev?.fen === scannedFen ? { ...prev, bestMove } : prev,
          );
        });
      })();
      return true;
    },
    [commitFen, evaluatePosition, haltEngine],
  );

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
    }, 80);
    return () => window.clearTimeout(id);
  }, [board, building, fenValid, fetchEvaluation]);

  useEffect(() => {
    if (building || gameOver || !result?.moves?.[0]?.uci) return;
    if (!fenValid || !isValidFen(fen)) return;
    try {
      const probe = new Chess(fen);
      if (probe.isGameOver() || probe.turn() === humanColor) return;
    } catch {
      return;
    }
    if (repliedFen.current === fen) return;
    if (replyFen.current !== fen) replyFen.current = fen;
    applyEngineReply(fen, result.moves[0].uci);
  }, [applyEngineReply, building, fen, fenValid, gameOver, humanColor, result]);

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
    if (building || gameOver || isThinking) return;
    if (!replyFen.current || replyFen.current !== fen) return;
    if (resultFen !== fen) return;
    applyEngineReply(fen, engineUci);
  }, [
    applyEngineReply,
    building,
    engineUci,
    fen,
    gameOver,
    isThinking,
    resultFen,
  ]);

  useEffect(() => {
    if (!enabled || !fenValid || building || gameOver) return;
    if (!isValidFen(fen)) return;
    try {
      const probe = new Chess(fen);
      if (probe.isGameOver() || probe.turn() !== humanColor) return;
    } catch {
      return;
    }
    if (replyFen.current) return;
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

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-3 xl:h-full xl:overflow-hidden">
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
                    onClick={() => setIsUploadBoardOpen(true)}
                    disabled={building}
                    aria-label="Scan board from image"
                    className="grid h-7 w-7 place-items-center rounded-md border border-border-default bg-bg-surface text-text-secondary transition-colors hover:border-accent-gold/50 hover:text-accent-gold-bright active:scale-95 disabled:opacity-40"
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </button>
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
                    <div className="relative h-full w-full overflow-hidden rounded-lg ring-1 ring-black/40">
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

        <div className="flex min-h-0 w-full flex-col gap-3 overflow-y-auto xl:col-span-4 xl:h-full xl:min-h-0 xl:overflow-hidden">
          <section
            aria-label="Endgame catalog"
            className="flex shrink-0 flex-col gap-1.5 rounded-xl border border-border-default bg-bg-surface p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-serif-display text-[15px] text-text-primary">
                Endgame type
              </h2>
              <div className="flex min-w-0 items-center gap-2">
                <span className="truncate text-[14px] tracking-wide text-accent-gold-bright">
                  {catalog[endgameIndex]?.icons ?? "—"}{" "}
                  <span className="text-text-muted">
                    {filteredEndgames.length}/{catalog.length}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsUploadBoardOpen(true)}
                  disabled={building}
                  className="inline-flex shrink-0 items-center gap-1 rounded-md border border-accent-gold/35 bg-bg-elevated px-2 py-1 text-[11px] font-semibold text-accent-gold-bright hover:border-accent-gold/70 disabled:opacity-50"
                >
                  <Camera className="h-3 w-3" />
                  Scan
                </button>
                <button
                  type="button"
                  onClick={deleteAllKinds}
                  disabled={building || catalog.length === 0}
                  aria-label="Delete all endgame types"
                  className="inline-flex shrink-0 items-center gap-1 rounded-md border border-accent-garnet/40 bg-bg-elevated px-2 py-1 text-[11px] text-accent-garnet-bright hover:border-accent-garnet/70 disabled:opacity-50"
                >
                  <Trash2 className="h-3 w-3" />
                  All
                </button>
              </div>
            </div>
            <input
              type="search"
              value={endgameQuery}
              onChange={(e) => setEndgameQuery(e.target.value)}
              placeholder="Filter types…"
              className="w-full rounded-md border border-border-default bg-bg-elevated px-2 py-1 font-mono text-[11px] text-text-primary outline-none placeholder:text-text-muted focus:border-accent-gold/50"
            />
            <div className="grid max-h-24 grid-cols-1 gap-1 overflow-y-auto sm:grid-cols-2 xl:max-h-28">
              {filteredEndgames.length === 0 ? (
                <p className="col-span-full text-[11px] italic text-text-muted">
                  No endgame types. Scan a diagram to add one.
                </p>
              ) : (
                filteredEndgames.map(({ eg, i }) => (
                  <div
                    key={eg.id}
                    className={`flex min-w-0 items-center gap-1 rounded-md border ${
                      i === endgameIndex
                        ? "border-accent-gold/60 bg-accent-gold/10"
                        : "border-border-default"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => loadEndgame(i)}
                      disabled={building}
                      className={`min-w-0 flex-1 truncate px-1.5 py-1 text-left text-[16px] leading-none disabled:opacity-50 ${
                        i === endgameIndex
                          ? "text-accent-gold-bright"
                          : "text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      {eg.icons}
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${eg.id}`}
                      disabled={building}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteKind(eg.id);
                      }}
                      className="grid h-7 w-7 shrink-0 place-items-center text-text-muted hover:text-accent-garnet-bright disabled:opacity-40"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          <div className="flex min-h-0 max-h-48 flex-col gap-2 overflow-hidden rounded-xl border border-border-subtle bg-bg-surface p-3 xl:max-h-[28%] xl:shrink-0">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-serif-display text-[15px] text-text-primary">
                Variations
              </h2>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[10px] text-text-muted">
                  {pipelineLabel}
                </span>
                <button
                  type="button"
                  onClick={() => deleteAllVariations()}
                  disabled={building || typedCards.length === 0}
                  aria-label="Delete all variations"
                  className="inline-flex items-center gap-1 rounded-md border border-accent-garnet/40 px-1.5 py-0.5 text-[10px] text-accent-garnet-bright hover:border-accent-garnet/70 disabled:opacity-40"
                >
                  <Trash2 className="h-3 w-3" />
                  All
                </button>
              </div>
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
                  No {endgameIcons(selectedKind)} cards yet. Choose a type to
                  generate one.
                </p>
              ) : (
                <ul className="flex flex-col gap-1">
                  {typedCards.map((card, i) => (
                    <li key={card.id} className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={building}
                        onClick={() =>
                          loadCard(
                            card,
                            deck.cards.findIndex((c) => c.id === card.id),
                          )
                        }
                        className={`flex min-w-0 flex-1 items-center justify-between rounded-md border px-2 py-1 text-left font-mono text-[10px] disabled:opacity-50 ${
                          activeCard?.id === card.id
                            ? "border-accent-gold/60 text-accent-gold-bright"
                            : "border-border-default text-text-secondary"
                        }`}
                      >
                        <span>
                          {i + 1}. {endgameIcons(card.kind)}
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
                      <button
                        type="button"
                        aria-label="Delete variation"
                        disabled={building}
                        onClick={() => deleteVariation(card.id)}
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-border-default text-text-muted hover:border-accent-garnet/50 hover:text-accent-garnet-bright disabled:opacity-40"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
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
              onToggleEnabled={() => setEnabled(!enabled)}
            />

            <div className="flex max-h-24 min-h-0 shrink-0 flex-col overflow-hidden rounded-xl border border-border-subtle bg-bg-surface p-2.5">
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
      <UploadBoardModal
        isOpen={isUploadBoardOpen}
        onClose={() => setIsUploadBoardOpen(false)}
        onPositionLoaded={handlePositionLoaded}
      />
      <ConfirmDialog
        open={confirm !== null}
        title={confirm?.title ?? ""}
        body={confirm?.body ?? ""}
        confirmLabel={confirm?.confirmLabel}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          const run = confirm?.run;
          setConfirm(null);
          run?.();
        }}
      />
    </div>
  );
}
