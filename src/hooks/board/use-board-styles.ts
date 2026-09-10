import { useMemo } from "react";

export function useBoardStyles(t: any) {
  return useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};
    for (const [sq, color] of Object.entries(t.userHighlights)) {
      styles[sq] = { backgroundColor: color as string };
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
}