import { useMemo } from "react";
import type { Arrow } from "react-chessboard";

export function useBoardOptions(t: any, squareStyles: Record<string, React.CSSProperties>) {
  const turn = t.fen.split(" ")[1] === "b" ? "b" : "w";

  return useMemo(
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
      boardStyle: { width: "100%", height: "100%", borderRadius: 0 },
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
        const canSelect = t.mode === "study" ? color === turn : color === ours;
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
}