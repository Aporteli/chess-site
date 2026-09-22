'use client';

import { Chessboard } from 'react-chessboard';
import { AppShell } from '@/components/layout/AppShell';
import { GamesList } from '@/components/live/components/GamesList';
import { PlayerBar } from '@/components/live/components/PlayerBar';
import { BoardControls } from '@/components/live/components/BoardControls';
import { MovesList } from '@/components/live/components/MovesList';
import { LoadingState } from '@/components/live/components/LoadingState';
import { ErrorState } from '@/components/live/components/ErrorState';
import { LiveBroadcastProvider, useLiveBroadcast } from '@/components/live/LiveBroadcastContext';
import { useMoveNavigation } from '@/components/live/hooks/useMoveNavigation';
import { useChessPosition, useChessClocks } from '@/components/live/hooks/useChessDerivations';

export default function LivePage() {
  return (
    <LiveBroadcastProvider>
      <AppShell activeKey="live">
        <LiveWorkspace />
      </AppShell>
    </LiveBroadcastProvider>
  );
}

function LiveWorkspace() {
  const live = useLiveBroadcast();

  const {
    selectedRoundId,
    games,
    selectedIndex,
    moveIndex,
    loadingBroadcasts,
    loadingGames,
    error,
    isFollowingLive,
    selectedGame,
    selectGame,
  } = live;

  const { firstMove, previousMove, nextMove, lastMove, goLive, handleMoveClick } = useMoveNavigation(live);

  const position = useChessPosition(selectedGame, moveIndex);
  const clocks = useChessClocks(selectedGame, moveIndex);

  return (
    <div className="flex min-h-full w-full flex-1 flex-col p-2 font-mono text-white landscape:h-full landscape:min-h-0">
      {loadingBroadcasts && <LoadingState message="Loading Lichess broadcasts..." />}

      {!loadingBroadcasts && loadingGames && <LoadingState message="Loading broadcast games..." />}

      {error && <ErrorState message={error} />}

      {!loadingBroadcasts && !loadingGames && !error && (
        <>
          {games.length === 0 ? (
            <div className="rounded-lg border border-[#383838] bg-[#2A2A2A] p-6 text-center shadow-lg">
              <p className="text-xs italic text-[#A0A0A0]">No games available in this round.</p>
            </div>
          ) : (
            <div className="board-workspace w-full">
              <section className="board-column">
                <div className="board-stage">
                  <div className="board-frame relative min-h-0 min-w-0 overflow-hidden rounded-lg border border-[#383838] shadow-lg">
                    <Chessboard
                      options={{
                        id: 'live-board',
                        position,
                        boardStyle: { width: '100%', height: 'auto', aspectRatio: '1 / 1' },
                      }}
                    />
                  </div>
                </div>
              </section>

              <aside className="board-panel thin-scrollbar gap-2">
                {selectedGame && (
                  <>
                    <PlayerBar game={selectedGame} clocks={clocks} />
                    <BoardControls
                      moveIndex={moveIndex}
                      totalMoves={selectedGame.moves.length}
                      isFollowingLive={isFollowingLive}
                      onFirst={firstMove}
                      onPrevious={previousMove}
                      onNext={nextMove}
                      onLast={lastMove}
                      onGoLive={goLive}
                    />
                  </>
                )}

                <div className="flex min-h-[min(18rem,42dvh)] flex-col gap-2 landscape:min-h-40 landscape:flex-1 landscape:overflow-hidden min-[1440px]:landscape:flex-row">
                  {selectedGame && (
                    <div className="h-[min(18rem,40dvh)] min-h-0 landscape:h-auto landscape:min-h-0 landscape:flex-1 min-[1440px]:landscape:min-w-56">
                      <MovesList moves={selectedGame.moves} moveIndex={moveIndex} onMoveClick={handleMoveClick} />
                    </div>
                  )}

                  <div className="h-[min(16rem,36dvh)] min-h-0 landscape:h-auto landscape:min-h-0 landscape:flex-1 min-[1440px]:landscape:min-w-40">
                    <GamesList
                      games={games}
                      selectedIndex={selectedIndex}
                      selectedRoundId={selectedRoundId}
                      onSelectGame={selectGame}
                    />
                  </div>
                </div>
              </aside>
            </div>
          )}
        </>
      )}
    </div>
  );
}
