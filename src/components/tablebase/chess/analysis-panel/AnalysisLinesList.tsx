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
        <p className="font-mono text-xs italic text-[#A0A0A0]">No lines yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {lines.map((line) => (
            <button
              key={`${line.multipv}-${line.uci}`}
              type="button"
              disabled={building || Boolean(gameOver)}
              onClick={() => onSelectMove(line.uci)}
              className="min-h-8 rounded-md border border-[#383838] bg-[#2A2A2A] px-3 py-1 font-mono text-xs font-medium text-white transition-colors hover:border-[#769656] hover:bg-[#383838] hover:text-[#769656] disabled:pointer-events-none disabled:opacity-40"
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