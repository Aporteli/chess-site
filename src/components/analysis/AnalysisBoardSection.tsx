import { BoardWithEvaluation } from "./BoardWithEvaluation";
import { BoardNavigation } from "./BoardNavigation";

export function AnalysisBoardSection() {
  return (
    <section className="board-column justify-center gap-2 sm:gap-3">
      <div className="mx-auto flex w-full max-w-[var(--board-size,52rem)] items-stretch gap-2 sm:gap-3">
        <BoardWithEvaluation />
      </div>
      <BoardNavigation />
    </section>
  );
}
