import { EvalBar } from '@/components/board/EvalBar';
import { ChessBoard } from './ChessBoard';
import { useSettingsStore } from '@/stores/settings-store';

export function BoardWithEvaluation() {
  const flipped = useSettingsStore((state) => state.flipped);

  return (
    <div className="board-stage">
      <EvalBar flipped={flipped} />

      <div className="wood-frame relative min-h-0 min-w-0 rounded-xl p-2 sm:rounded-2xl sm:p-2.5">
        <ChessBoard />
      </div>
    </div>
  );
}
