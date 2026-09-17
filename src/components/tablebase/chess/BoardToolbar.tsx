// "use client";

// import { Chess } from "chess.js";
// import { fenTurn } from "@/lib/tablebase/chess/moves";
// import { useTablebaseStore } from "@/stores/tablebase-store";

// export function BoardToolbar() {
//   const fen = useTablebaseStore((s) => s.fen);
//   const loading = useTablebaseStore((s) => s.loading);

//   const turn = fenTurn(fen);
//   let inCheck = false;
//   try {
//     inCheck = new Chess(fen).inCheck();
//   } catch {
//     inCheck = false;
//   }

//   return (
//     <div className="mb-2 mt-2 flex w-full shrink-0 items-center justify-between px-1">
//       <span className="font-mono text-xs text-[#A0A0A0] tabular-nums">
//         Turn: <span className="font-semibold text-white">{turn === "w" ? "White" : "Black"}</span>
//         {inCheck && <span className="text-[#E63946]"> · Check</span>}
//         {loading && <span className="text-[#769656]"> · Tablebase...</span>}
//       </span>
//     </div>
//   );
// }