import { BoardToolbar } from "./BoardToolbar";
import { BoardWithEvaluation } from "./BoardWithEvaluation";
import { BoardNavigation } from "./BoardNavigation";

export function AnalysisBoardSection() {
  return (
    <div className="flex w-full min-h-0 min-w-0 flex-col items-center justify-center xl:col-span-8 xl:h-full">
      <div className="flex w-full max-w-[min(100%,calc(100dvh-9rem))] flex-col items-center justify-center gap-2 sm:gap-3 xl:max-h-full xl:max-w-none xl:flex-row">
        <div className="flex w-full min-w-0 items-stretch justify-center gap-2 sm:gap-3 xl:w-auto">
          <BoardWithEvaluation />
        </div>
        <BoardNavigation />
      </div>
    </div>
  );
}
