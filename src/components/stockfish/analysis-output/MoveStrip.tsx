
"use client";

interface MoveStripProps {
  items: { key: string; kind: "num" | "move"; text: string; ply?: number }[];
  ply: number;
  onPly: (n: number) => void;
  onPlay: (ucis: string[]) => void;
  moves: string[];
  isExpanded?: boolean;
}

export function MoveStrip({
  items,
  ply,
  onPly,
  onPlay,
  moves,
  isExpanded = false,
}: MoveStripProps) {
  return (
    <div
      className={`flex items-center gap-x-1.5 text-text-primary ${
        isExpanded
          ? "flex-wrap leading-relaxed"
          : "min-w-0 flex-nowrap overflow-hidden leading-none"
      }`}
    >
      {items.map((it) =>
        it.kind === "num" ? (
          <span
            key={it.key}
            className="inline-flex shrink-0 items-center whitespace-nowrap text-text-muted"
          >
            {it.text}
          </span>
        ) : (
          <button
            key={it.key}
            type="button"
            className={`inline-flex shrink-0 items-center whitespace-nowrap rounded border-0 bg-transparent px-0.5 font-sans text-[12px] hover:bg-accent-gold-dim hover:text-accent-gold-bright ${
              it.ply === ply ? "bg-accent-gold-dim text-accent-gold-bright" : ""
            }`}
            onMouseEnter={() => onPly(it.ply ?? 0)}
            onClick={(e) => {
              e.stopPropagation();
              onPlay(moves.slice(0, (it.ply ?? 0) + 1));
            }}
          >
            {it.text}
          </button>
        )
      )}
    </div>
  );
}