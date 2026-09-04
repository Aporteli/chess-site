// src/components/board/Coordinates.tsx
const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
const RANKS = ["8", "7", "6", "5", "4", "3", "2", "1"];

interface CoordinatesProps {
  flipped?: boolean;
}

/**
 * Renders file letters along the bottom edge and rank numbers along the
 * left edge of the board, like brass inlay on a wooden board — a warm
 * espresso tone on the light (maple) squares, a soft ivory on the dark
 * (walnut) squares, so labels stay legible against either.
 */
export function Coordinates({ flipped = false }: CoordinatesProps) {
  const files = flipped ? [...FILES].reverse() : FILES;
  const ranks = flipped ? [...RANKS].reverse() : RANKS;

  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex px-1.5 pb-1">
        {files.map((file, i) => (
          <span
            key={file}
            className={[
              "flex-1 text-right font-mono text-[10px] font-semibold",
              i % 2 === 0 ? "text-[#5a3d20]/70" : "text-[#f3e6c8]/80",
            ].join(" ")}
          >
            {file}
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex flex-col py-1 pl-1.5">
        {ranks.map((rank, i) => (
          <span
            key={rank}
            className={[
              "flex-1 font-mono text-[10px] font-semibold",
              i % 2 === 0 ? "text-[#5a3d20]/70" : "text-[#f3e6c8]/80",
            ].join(" ")}
          >
            {rank}
          </span>
        ))}
      </div>
    </>
  );
}
