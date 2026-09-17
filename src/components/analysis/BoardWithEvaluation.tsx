import { EvalBar } from '@/components/board/EvalBar';
import { BoardToolbar } from './BoardToolbar';
import { ChessBoard } from './ChessBoard';
import { useSettingsStore } from '@/stores/settings-store';

export function BoardWithEvaluation() {
  const flipped = useSettingsStore((state) => state.flipped);

  return (
    <>
      <div className="flex shrink-0 self-stretch pt-7 sm:pt-8">
        <EvalBar flipped={flipped} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <BoardToolbar />
        <ChessBoard />
      </div>
    </>
  );
}
