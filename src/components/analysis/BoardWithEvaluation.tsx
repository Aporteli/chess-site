import { EvaluationBar } from "@/components/stockfish/EvaluationBar";
import { BoardToolbar } from "./BoardToolbar";
import { ChessBoard } from "./ChessBoard";

export function BoardWithEvaluation() {
  return (
    <>
      <div className="flex shrink-0 self-stretch pt-7 sm:pt-8">
        <EvaluationBar />
      </div>

      <div className="flex min-w-0 flex-1 flex-col xl:flex-none">
        <BoardToolbar />
        <ChessBoard />
      </div>
    </>
  );
}
