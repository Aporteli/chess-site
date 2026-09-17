import { Chessboard, type Arrow } from 'react-chessboard';
import { useAnalysisStore } from '@/lib/analysis/store/analysis-store';
import { useChessBoardOptions } from '@/lib/analysis/use-chess-board-options';

export function ChessBoard() {
  const boardOptions = useChessBoardOptions();

  return (
    <div className="relative aspect-square w-full shrink-0">
      <div className="flex h-full w-full items-center justify-center rounded-xl border border-[var(--color-border-default,#3a3122)] p-1.5 shadow-board wood-grain sm:rounded-2xl sm:p-2.5">
        <div className="relative h-full w-full overflow-hidden rounded-lg ring-1 ring-black/40">
          <Chessboard options={boardOptions} />
        </div>
      </div>
    </div>
  );
}
