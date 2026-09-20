'use client';

import { MultiplayerBoard } from './MultiplayerBoard';
import { MultiplayerPanel } from './MultiplayerPanel';
import { MoveHistory } from './MoveHistory';
import { useMultiplayerGame } from '@/lib/multiplayer/useMultiplayerGame';
import { useSettingsStore } from '@/stores/settings-store';
import type { GameStatus, MultiplayerSession, PlayerColor } from '@/lib/multiplayer/types';

export function MultiplayerWorkspace() {
  const game = useMultiplayerGame();
  const settingsFlipped = useSettingsStore((s) => s.flipped);

  const session: MultiplayerSession = {
    gameId: game.gameId,
    playerColor: game.playerColor,
    opponentPresent: game.opponentPresent,
    connection: game.connection,
    error: game.error,
  };

  const isMyTurn = game.playerColor !== null && game.turn === game.playerColor;

  const gameStatus: GameStatus =
    !game.gameId && !game.error
      ? 'idle'
      : game.error && game.connection !== 'connected'
        ? 'error'
        : game.connection === 'connecting'
          ? 'connecting'
          : !game.opponentPresent
            ? 'waiting'
            : isMyTurn
              ? 'your-turn'
              : 'opponent-turn';

  const orientation: PlayerColor =
    ((game.playerColor ?? 'white') === 'black') !== settingsFlipped ? 'black' : 'white';

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col p-2">
      <div className="board-workspace w-full">
        <section className="board-column">
          <div className="board-stage">
            <div className="wood-frame relative min-h-0 min-w-0 rounded-xl p-2 sm:rounded-2xl sm:p-2.5">
              <MultiplayerBoard
                fen={game.fen}
                orientation={orientation}
                interactive={game.connection === 'connected' && isMyTurn}
                onMove={game.sendMove}
              />
            </div>
          </div>
        </section>

        <aside className="board-panel thin-scrollbar gap-2">
          <MultiplayerPanel
            session={session}
            gameStatus={gameStatus}
            turn={game.turn}
            onCreateGame={game.createGame}
            onLeaveGame={game.leaveGame}
          />
          <MoveHistory moves={game.moves} />
        </aside>
      </div>
    </div>
  );
}
