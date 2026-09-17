import { Chessboard } from 'react-chessboard';
import { useChessBoardOptions } from '@/lib/analysis/use-chess-board-options';

export function ChessBoard() {
  const boardOptions = useChessBoardOptions();

  return (
    <div className="relative h-full w-full overflow-hidden rounded-md ring-1 ring-fg/15">
      <Chessboard options={boardOptions} />
    </div>
  );
}
