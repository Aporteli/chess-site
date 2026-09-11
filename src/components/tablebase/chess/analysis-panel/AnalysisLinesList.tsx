"use client";

interface LineItem {
  multipv?: number;
  uci: string;
  san?: string;
  evaluation?: number;
}

interface AnalysisLinesListProps {
    lines: LineItem[];
    building: boolean;
    gameOver: string | null;
    onSelectMove: (uci: string) => void;
  }

export function AnalysisLinesList({ lines, building, gameOver, onSelectMove }: AnalysisLinesListProps) {
  return (
    <div className="flex flex-col gap-2 p-1">
      {lines.length === 0 ? (
        <p className="text-micro italic text-muted">No lines yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {lines.map((line) => (
            <button
              key={`${line.multipv}-${line.uci}`}
              type="button"
              disabled={building || Boolean(gameOver)}
              onClick={() => onSelectMove(line.uci)}
              className="min-h-8 rounded px-3 py-1 font-mono text-xs text-muted shadow-[var(--shadow-border)] hover:text-fg disabled:opacity-50 bg-surface/80"
              style={{ minWidth: "3.5rem" }}
            >
              {line.san ?? line.uci}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
