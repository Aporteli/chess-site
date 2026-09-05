"use client";

import { useMemo } from "react";
import { Chessboard, type Arrow } from "react-chessboard";
import { FlipVertical2, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { BoardOverlay } from "./BoardOverlay";
import { PromotionDialog } from "./PromotionDialog";
import { useTrainer } from "@/lib/trainer/context";
import { useStockfishEngine } from "@/lib/chess/use-stockfish";

export function BoardWrapper() {
  const t = useTrainer();
  const { evaluation } = useStockfishEngine();
  const turn = t.fen.split(" ")[1] === "b" ? "b" : "w";
  const evalScore = evaluation ?? 0;
  const whiteBarHeight = Math.round(((Math.max(-10, Math.min(10, evalScore)) + 10) / 20) * 100);
  const evalLabel =
    evaluation == null
      ? "—"
      : Math.abs(evaluation) >= 99
        ? (evaluation > 0 ? "M" : "-M")
        : evaluation > 0
          ? `+${evaluation.toFixed(1)}`
          : evaluation.toFixed(1);

  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};
    for (const [sq, color] of Object.entries(t.userHighlights)) {
      styles[sq] = { backgroundColor: color };
    }

    if (t.lastMove) {
      const wash = { boxShadow: "inset 0 0 0 1000px rgba(201, 162, 86, 0.28)" };
      styles[t.lastMove.from] = { ...styles[t.lastMove.from], ...wash };
      styles[t.lastMove.to] = { ...styles[t.lastMove.to], ...wash };
    }
    if (t.selectedSquare) {
      styles[t.selectedSquare] = {
        ...styles[t.selectedSquare],
        boxShadow: "inset 0 0 0 1000px rgba(79, 148, 132, 0.38)",
      };
    }
    if (t.checkSquare) {
      styles[t.checkSquare] = {
        ...styles[t.checkSquare],
        boxShadow: "inset 0 0 0 1000px rgba(184, 80, 63, 0.42)",
      };
    }
    if (t.hintSquares.from) {
      styles[t.hintSquares.from] = {
        ...styles[t.hintSquares.from],
        boxShadow: "inset 0 0 0 3px rgba(232, 197, 121, 0.9)",
      };
    }
    if (t.hintSquares.to) {
      styles[t.hintSquares.to] = {
        ...styles[t.hintSquares.to],
        boxShadow: "inset 0 0 0 3px rgba(127, 192, 175, 0.95)",
      };
    }
    if (t.settings.legalHints) {
      for (const sq of t.legalTargets) {
        styles[sq] = {
          ...styles[sq],
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(20, 38, 33, 0.5) 14%, transparent 16%)",
        };
      }
    }
    if (t.premove) {
      styles[t.premove.from] = {
        ...styles[t.premove.from],
        boxShadow: "inset 0 0 0 1000px rgba(79, 148, 132, 0.25)",
      };
      styles[t.premove.to] = {
        ...styles[t.premove.to],
        boxShadow: "inset 0 0 0 1000px rgba(79, 148, 132, 0.25)",
      };
    }
    return styles;
  }, [t.lastMove, t.selectedSquare, t.checkSquare, t.hintSquares, t.legalTargets, t.userHighlights, t.settings.legalHints, t.premove]);

  const options = useMemo(
    () => ({
      id: "movetrainer-board",
      position: t.fen,
      boardOrientation: (t.flipped ? "black" : "white") as "white" | "black",
      allowDragging: true,
      allowDrawingArrows: true,
      allowDragOffBoard: false,
      arrows: t.arrows,
      onArrowsChange: ({ arrows }: { arrows: Arrow[] }) => t.setArrows(arrows),
      animationDurationInMs: t.settings.animations ? 180 : 0,
      showAnimations: t.settings.animations,
      showNotation: t.settings.coordinates,
      lightSquareStyle: {
        backgroundColor: "#e8d9b5",
        backgroundImage: "linear-gradient(155deg, rgba(255,255,255,0.12), transparent 55%)",
      },
      darkSquareStyle: {
        backgroundColor: "#7a4c2c",
        backgroundImage: "linear-gradient(155deg, rgba(255,255,255,0.06), transparent 55%)",
      },
      dropSquareStyle: { boxShadow: "inset 0 0 0 3px rgba(201, 162, 86, 0.7)" },
      darkSquareNotationStyle: { color: "rgba(243, 230, 200, 0.82)", fontSize: "10px", fontWeight: 600 },
      lightSquareNotationStyle: { color: "rgba(90, 61, 32, 0.72)", fontSize: "10px", fontWeight: 600 },
      squareStyles,
      boardStyle: {
        width: "100%",
        height: "100%",
        borderRadius: 0,
      },
      canDragPiece: ({ piece }: { piece: { pieceType: string } }) => {
        const color = piece.pieceType.startsWith("w") ? "w" : "b";
        if (t.mode === "study") return color === turn;
        const ours = t.repertoire.side === "white" ? "w" : "b";
        return color === ours;
      },
      onPieceDrop: ({
        sourceSquare,
        targetSquare,
      }: {
        sourceSquare: string;
        targetSquare: string | null;
      }) => {
        if (!targetSquare) return false;
        return t.playUserMove(sourceSquare, targetSquare);
      },
      onSquareClick: ({ square, piece }: { square: string; piece: { pieceType: string } | null }) => {
        if (t.selectedSquare && t.legalTargets.includes(square)) {
          t.playUserMove(t.selectedSquare, square);
          return;
        }
        const color = piece?.pieceType.startsWith("w") ? "w" : piece ? "b" : null;
        const ours = t.repertoire.side === "white" ? "w" : "b";
        const canSelect =
          t.mode === "study" ? color === turn : color === ours;
        if (canSelect && piece) {
          t.selectSquare(t.selectedSquare === square ? null : square);
        } else {
          t.selectSquare(null);
        }
      },
      onSquareRightClick: ({ square }: { square: string }) => t.toggleHighlight(square),
    }),
    [t, squareStyles, turn],
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative mx-auto w-full max-w-[620px]">
        <div className="mb-3 flex items-center justify-between">
          <span className="hidden items-center gap-1.5 rounded-full border border-border-default bg-bg-surface px-3 py-1 text-[11px] font-medium tracking-wide text-text-muted sm:inline-flex">
            Board · Walnut &amp; Maple
            {t.mode === "drill" && t.drill?.opponentThinking && (
              <span className="ml-1 text-accent-teal-bright">· opponent</span>
            )}
            {t.premove && <span className="ml-1 text-accent-gold-bright">· premove</span>}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => t.setSettings({ sound: !t.settings.sound })}
              aria-label={t.settings.sound ? "Mute sounds" : "Enable sounds"}
              className="grid h-9 w-9 place-items-center rounded-md border border-border-default bg-bg-surface text-text-secondary transition-colors hover:border-accent-gold/50 hover:text-accent-gold-bright active:scale-95"
            >
              {t.settings.sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            <button
              onClick={t.flipBoard}
              aria-label="Flip board"
              className="grid h-9 w-9 place-items-center rounded-md border border-border-default bg-bg-surface text-text-secondary transition-colors hover:border-accent-teal/50 hover:text-accent-teal-bright active:scale-95"
            >
              <FlipVertical2 className="h-4 w-4" />
            </button>
            <button
              onClick={t.restartLine}
              aria-label="Restart line"
              className="grid h-9 w-9 place-items-center rounded-md border border-border-default bg-bg-surface text-text-secondary transition-colors hover:border-accent-garnet/50 hover:text-accent-garnet-bright active:scale-95"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="relative flex w-full items-stretch gap-2">
          <div
            className={`relative w-3.5 shrink-0 overflow-hidden rounded-full border border-accent-gold/50 bg-bg-deepest shadow-lg ${t.flipped ? "flex flex-col" : "flex flex-col justify-end"}`}
            title={evalLabel}
          >
            <div
              className="w-full bg-text-primary transition-all duration-300"
              style={{ height: `${t.flipped ? 100 - whiteBarHeight : whiteBarHeight}%` }}
            />
          </div>
        <div className="relative aspect-square min-w-0 flex-1 rounded-2xl p-3 wood-grain shadow-board sm:p-4">
          <span className="pointer-events-none absolute left-2 top-2 h-3 w-3 rounded-tl-md border-l-2 border-t-2 border-accent-gold/50" />
          <span className="pointer-events-none absolute right-2 top-2 h-3 w-3 rounded-tr-md border-r-2 border-t-2 border-accent-gold/50" />
          <span className="pointer-events-none absolute bottom-2 left-2 h-3 w-3 rounded-bl-md border-b-2 border-l-2 border-accent-gold/50" />
          <span className="pointer-events-none absolute bottom-2 right-2 h-3 w-3 rounded-br-md border-b-2 border-r-2 border-accent-gold/50" />

          <div className="relative h-full w-full overflow-hidden rounded-lg ring-1 ring-black/40">
            <Chessboard options={options} />
            {t.promotion && (
              <PromotionDialog
                color={turn}
                onPick={t.completePromotion}
                onCancel={t.cancelPromotion}
              />
            )}
          </div>
          <BoardOverlay status={t.moveStatus} />
        </div>
        </div>
      </div>
    </div>
  );
}
