'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

type BroadcastGame = {
  id: string;
  event: string;
  site: string;
  date: string;
  round: string;
  white: string;
  black: string;
  result: string;
  whiteElo?: string;
  blackElo?: string;
  whiteTeam?: string;
  blackTeam?: string;
  whiteFideId?: string;
  blackFideId?: string;
  gameUrl?: string;
  broadcastUrl?: string;
  moves: string[];
  clocks?: Array<string | undefined>;
  pgn: string;
};

type BroadcastResponse = {
  roundId: string;
  count: number;
  games: BroadcastGame[];
};

type BroadcastRound = {
  id: string;
  name: string;
  slug: string;
  finishedAt?: number;
  finished?: boolean;
  startsAt?: number;
  url: string;
};

type BroadcastTour = {
  id: string;
  name: string;
  slug: string;
  info?: {
    format?: string;
    tc?: string;
    fideTC?: string;
    location?: string;
    timeZone?: string;
    players?: string;
    website?: string;
    standings?: string;
  };
  createdAt?: number;
  url: string;
  tier?: number;
  dates?: number[];
  image?: string;
  teamTable?: boolean;
  showTeamScores?: boolean;
};

type BroadcastItem = {
  tour: BroadcastTour;
  rounds: BroadcastRound[];
  defaultRoundId?: string;
  group?: string;
};

type RawBroadcastItem = {
  tour: BroadcastTour;
  round: BroadcastRound;
  roundToLink?: BroadcastRound;
  group?: string;
};

type BroadcastListResponse = {
  count: number;
  broadcasts: RawBroadcastItem[];
};

function parseClock(value: string | undefined): string {
  return value ?? '--:--:--';
}

function normalizeBroadcasts(
  items: RawBroadcastItem[]
): BroadcastItem[] {
  const grouped = new Map<string, BroadcastItem>();

  for (const item of items) {
    if (!item?.tour?.id || !item?.round?.id) {
      continue;
    }

    const existing = grouped.get(item.tour.id);

    if (existing) {
      const alreadyExists = existing.rounds.some(
        (round) => round.id === item.round.id
      );

      if (!alreadyExists) {
        existing.rounds.push(item.round);
      }

      continue;
    }

    grouped.set(item.tour.id, {
      tour: item.tour,
      rounds: [item.round],
      defaultRoundId: item.round.id,
      group: item.group,
    });
  }

  return Array.from(grouped.values());
}

export default function LivePage() {
  const [broadcasts, setBroadcasts] = useState<BroadcastItem[]>([]);

  const [selectedBroadcastIndex, setSelectedBroadcastIndex] =
    useState(0);

  const [selectedRoundId, setSelectedRoundId] =
    useState<string | null>(null);

  const [games, setGames] = useState<BroadcastGame[]>([]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const [moveIndex, setMoveIndex] = useState(-1);

  const [loadingBroadcasts, setLoadingBroadcasts] =
    useState(true);

  const [loadingGames, setLoadingGames] =
    useState(false);

  const [streamConnected, setStreamConnected] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [isFollowingLive, setIsFollowingLive] =
    useState(true);

  const selectedGameIdRef =
    useRef<string | null>(null);

  const gamesRef =
    useRef<BroadcastGame[]>([]);

  const selectedIndexRef =
    useRef(0);

  const moveIndexRef =
    useRef(-1);

  const isFollowingLiveRef =
    useRef(true);

  const selectedBroadcast =
    broadcasts[selectedBroadcastIndex];

  const selectedGame =
    games[selectedIndex];

  /*
   * Keep refs synchronized with React state.
   */

  useEffect(() => {
    selectedGameIdRef.current =
      selectedGame?.id ?? null;
  }, [selectedGame]);

  useEffect(() => {
    gamesRef.current = games;
  }, [games]);

  useEffect(() => {
    selectedIndexRef.current =
      selectedIndex;
  }, [selectedIndex]);

  useEffect(() => {
    moveIndexRef.current =
      moveIndex;
  }, [moveIndex]);

  useEffect(() => {
    isFollowingLiveRef.current =
      isFollowingLive;
  }, [isFollowingLive]);

  /*
   * Load available Lichess broadcasts automatically.
   */

  useEffect(() => {
    let cancelled = false;

    async function loadBroadcasts() {
      try {
        setLoadingBroadcasts(true);
        setError(null);

        const response = await fetch(
          '/api/lichess/broadcast',
          {
            method: 'GET',
            cache: 'no-store',
          }
        );

        const text = await response.text();

        if (!response.ok) {
          throw new Error(
            `Broadcast API ${response.status}: ${text}`
          );
        }

        const data =
          JSON.parse(text) as BroadcastListResponse;

        if (!Array.isArray(data.broadcasts)) {
          throw new Error(
            'Broadcast API response does not contain broadcasts.'
          );
        }

        if (cancelled) {
          return;
        }

        const result =
          normalizeBroadcasts(data.broadcasts);

        setBroadcasts(result);

        if (result.length > 0) {
          const firstBroadcast = result[0];

          setSelectedBroadcastIndex(0);

          const defaultRound =
            firstBroadcast.rounds.find(
              (round) =>
                round.id ===
                firstBroadcast.defaultRoundId
            );

          const firstRound =
            defaultRound ??
            firstBroadcast.rounds[0];

          setSelectedRoundId(
            firstRound?.id ?? null
          );
        } else {
          setSelectedRoundId(null);
        }
      } catch (err) {
        if (cancelled) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load broadcasts.'
        );
      } finally {
        if (!cancelled) {
          setLoadingBroadcasts(false);
        }
      }
    }

    void loadBroadcasts();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * Load games whenever the selected round changes.
   */

  useEffect(() => {
    const roundId =
      selectedRoundId;

    if (!roundId) {
      setGames([]);
      gamesRef.current = [];

      setSelectedIndex(0);
      selectedIndexRef.current = 0;

      setMoveIndex(-1);
      moveIndexRef.current = -1;

      return;
    }

    let cancelled = false;

    async function loadGames(id: string) {
      try {
        setLoadingGames(true);
        setStreamConnected(false);
        setError(null);

        setIsFollowingLive(true);
        isFollowingLiveRef.current = true;

        const response = await fetch(
          `/api/lichess/broadcast/round/${encodeURIComponent(id)}/pgn`,
          {
            method: 'GET',
            cache: 'no-store',
          }
        );

        const text =
          await response.text();

        if (!response.ok) {
          throw new Error(
            `API ${response.status}: ${text}`
          );
        }

        const data =
          JSON.parse(text) as BroadcastResponse;

        if (!Array.isArray(data.games)) {
          throw new Error(
            'API response does not contain games.'
          );
        }

        if (cancelled) {
          return;
        }

        const firstGame =
          data.games[0];

        setGames(data.games);
        gamesRef.current =
          data.games;

        setSelectedIndex(0);
        selectedIndexRef.current = 0;

        selectedGameIdRef.current =
          firstGame?.id ?? null;

        const initialMoveIndex =
          firstGame
            ? firstGame.moves.length - 1
            : -1;

        setMoveIndex(
          initialMoveIndex
        );

        moveIndexRef.current =
          initialMoveIndex;
      } catch (err) {
        if (cancelled) {
          return;
        }

        setGames([]);
        gamesRef.current = [];

        setSelectedIndex(0);
        selectedIndexRef.current = 0;

        setMoveIndex(-1);
        moveIndexRef.current = -1;

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load broadcast games.'
        );
      } finally {
        if (!cancelled) {
          setLoadingGames(false);
        }
      }
    }

    void loadGames(roundId);

    return () => {
      cancelled = true;
    };
  }, [selectedRoundId]);

  /*
   * ONE live stream for the selected round.
   */

  useEffect(() => {
    const roundId = selectedRoundId;
  
    if (!roundId) {
      return;
    }
  
    let cancelled = false;
    let controller: AbortController | null = null;
    let pollInterval: ReturnType<typeof setInterval> | null = null;
  
    async function updateGames(id: string) {
      try {
        const latestResponse = await fetch(
          `/api/lichess/broadcast/round/${encodeURIComponent(id)}/pgn`,
          {
            method: 'GET',
            cache: 'no-store',
          }
        );
  
        if (!latestResponse.ok) {
          return;
        }
  
        const latestData =
          (await latestResponse.json()) as BroadcastResponse;
  
        if (
          cancelled ||
          !Array.isArray(latestData.games)
        ) {
          return;
        }
  
        const currentGameId =
          selectedGameIdRef.current;
  
        const currentGames =
          gamesRef.current;
  
        const currentSelectedIndex =
          selectedIndexRef.current;
  
        const currentMoveIndex =
          moveIndexRef.current;
  
        const currentlyFollowingLive =
          isFollowingLiveRef.current;
  
        const newSelectedIndex =
          currentGameId
            ? latestData.games.findIndex(
                (game) =>
                  game.id === currentGameId
              )
            : currentSelectedIndex;
  
        const finalSelectedIndex =
          newSelectedIndex >= 0
            ? newSelectedIndex
            : 0;
  
        const latestGame =
          latestData.games[
            finalSelectedIndex
          ];
  
        const previousGame =
          currentGameId
            ? currentGames.find(
                (game) =>
                  game.id === currentGameId
              )
            : currentGames[
                currentSelectedIndex
              ];
  
        const previousMoveCount =
          previousGame?.moves.length ?? 0;
  
        const wasAtLiveEnd =
          currentlyFollowingLive ||
          currentMoveIndex >=
            previousMoveCount - 1;
  
        gamesRef.current =
          latestData.games;
  
        setGames(
          latestData.games
        );
  
        selectedIndexRef.current =
          finalSelectedIndex;
  
        setSelectedIndex(
          finalSelectedIndex
        );
  
        if (!latestGame) {
          return;
        }
  
        selectedGameIdRef.current =
          latestGame.id;
  
        const latestMoveIndex =
          latestGame.moves.length - 1;
  
        if (wasAtLiveEnd) {
          moveIndexRef.current =
            latestMoveIndex;
  
          setMoveIndex(
            latestMoveIndex
          );
  
          isFollowingLiveRef.current =
            true;
  
          setIsFollowingLive(true);
        } else {
          const safeMoveIndex =
            Math.min(
              currentMoveIndex,
              latestMoveIndex
            );
  
          moveIndexRef.current =
            safeMoveIndex;
  
          setMoveIndex(
            safeMoveIndex
          );
        }
      } catch (updateError) {
        if (!cancelled) {
          console.warn(
            'Could not update broadcast games:',
            updateError
          );
        }
      }
    }
  
    async function connectStream(id: string) {
      try {
        controller =
          new AbortController();
  
        const response = await fetch(
          `/api/lichess/broadcast/round/${encodeURIComponent(id)}/stream`,
          {
            method: 'GET',
            cache: 'no-store',
            signal: controller.signal,
          }
        );
  
        if (!response.ok) {
          const text =
            await response.text();
  
          throw new Error(
            `Stream API ${response.status}: ${text}`
          );
        }
  
        if (!response.body) {
          throw new Error(
            'Stream response has no body.'
          );
        }
  
        if (cancelled) {
          return;
        }
  
        setStreamConnected(true);
  
        const reader =
          response.body.getReader();
  
        const decoder =
          new TextDecoder();
  
        while (!cancelled) {
          const {
            value,
            done,
          } = await reader.read();
  
          if (done) {
            break;
          }
  
          if (value) {
            decoder.decode(
              value,
              {
                stream: true,
              }
            );
          }
        }
      } catch (err) {
        if (
          cancelled ||
          controller?.signal.aborted
        ) {
          return;
        }
  
        setStreamConnected(false);
  
        console.error(
          'Broadcast stream error:',
          err
        );
      }
    }
  
    void updateGames(roundId);
  
    pollInterval =
      setInterval(() => {
        if (!cancelled) {
          void updateGames(roundId);
        }
      }, 2000);
  
    void connectStream(roundId);
  
    return () => {
      cancelled = true;
  
      controller?.abort();
  
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [selectedRoundId]);

  /*
   * Build current chessboard position.
   */

  const position = useMemo(() => {
    const chess = new Chess();

    if (!selectedGame) {
      return chess.fen();
    }

    const moves =
      selectedGame.moves.slice(
        0,
        moveIndex + 1
      );

    for (const move of moves) {
      try {
        chess.move(move);
      } catch (err) {
        console.warn(
          'Could not apply broadcast move:',
          move,
          err
        );

        break;
      }
    }

    return chess.fen();
  }, [selectedGame, moveIndex]);

  /*
   * Get latest known clocks.
   */

  const clocks = useMemo(() => {
    if (!selectedGame?.clocks) {
      return {
        white: undefined,
        black: undefined,
      };
    }

    if (moveIndex < 0) {
      return {
        white: undefined,
        black: undefined,
      };
    }

    if (moveIndex % 2 === 0) {
      return {
        white:
          selectedGame.clocks[
            moveIndex
          ],

        black:
          moveIndex > 0
            ? selectedGame.clocks[
                moveIndex - 1
              ]
            : undefined,
      };
    }

    return {
      white:
        moveIndex > 0
          ? selectedGame.clocks[
              moveIndex - 1
            ]
          : undefined,

      black:
        selectedGame.clocks[
          moveIndex
        ],
    };
  }, [selectedGame, moveIndex]);

  function selectBroadcast(index: number) {
    const broadcast =
      broadcasts[index];

    if (!broadcast) {
      return;
    }

    setSelectedBroadcastIndex(index);

    const defaultRound =
      broadcast.rounds.find(
        (round) =>
          round.id ===
          broadcast.defaultRoundId
      );

    const firstRound =
      defaultRound ??
      broadcast.rounds[0];

    setSelectedRoundId(
      firstRound?.id ?? null
    );

    setIsFollowingLive(true);
    isFollowingLiveRef.current = true;
  }

  function selectRound(
    event: ChangeEvent<HTMLSelectElement>
  ) {
    const roundId =
      event.target.value;

    setSelectedRoundId(
      roundId || null
    );

    setIsFollowingLive(true);
    isFollowingLiveRef.current = true;
  }

  function selectGame(index: number) {
    const game =
      games[index];

    if (!game) {
      return;
    }

    selectedGameIdRef.current =
      game.id;

    selectedIndexRef.current =
      index;

    setSelectedIndex(index);

    const latestMoveIndex =
      game.moves.length - 1;

    moveIndexRef.current =
      latestMoveIndex;

    setMoveIndex(
      latestMoveIndex
    );

    setIsFollowingLive(true);
    isFollowingLiveRef.current = true;
  }

  function firstMove() {
    moveIndexRef.current = -1;

    setMoveIndex(-1);

    isFollowingLiveRef.current =
      false;

    setIsFollowingLive(false);
  }

  function previousMove() {
    const nextIndex =
      Math.max(
        -1,
        moveIndexRef.current - 1
      );

    moveIndexRef.current =
      nextIndex;

    setMoveIndex(nextIndex);

    isFollowingLiveRef.current =
      false;

    setIsFollowingLive(false);
  }

  function nextMove() {
    if (!selectedGame) {
      return;
    }

    const latestMoveIndex =
      selectedGame.moves.length - 1;

    const nextIndex =
      Math.min(
        latestMoveIndex,
        moveIndexRef.current + 1
      );

    moveIndexRef.current =
      nextIndex;

    setMoveIndex(nextIndex);

    const reachedLive =
      nextIndex >=
      latestMoveIndex;

    isFollowingLiveRef.current =
      reachedLive;

    setIsFollowingLive(
      reachedLive
    );
  }

  function lastMove() {
    if (!selectedGame) {
      return;
    }

    const latestMoveIndex =
      selectedGame.moves.length - 1;

    moveIndexRef.current =
      latestMoveIndex;

    setMoveIndex(
      latestMoveIndex
    );

    isFollowingLiveRef.current =
      true;

    setIsFollowingLive(true);
  }

  function goLive() {
    if (!selectedGame) {
      return;
    }

    const latestMoveIndex =
      selectedGame.moves.length - 1;

    moveIndexRef.current =
      latestMoveIndex;

    setMoveIndex(
      latestMoveIndex
    );

    isFollowingLiveRef.current =
      true;

    setIsFollowingLive(true);
  }

  return (
    <main className="min-h-screen bg-[#121212] font-mono text-white">
      <div className="mx-auto max-w-[1500px] px-2 py-3">

        {/* HEADER - compact single row */}

        <header className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#383838] pb-2">
          <div className="flex items-center gap-2">
            <span
              className={`size-2 rounded-full ${
                streamConnected
                  ? 'bg-[#769656] animate-pulse'
                  : 'bg-[#E63946]'
              }`}
            />

            <h1 className="text-xs font-semibold uppercase tracking-wider text-white">
              Live Broadcast
            </h1>

            <span className="text-[10px] text-[#A0A0A0]">
              · {selectedBroadcast?.tour.name ?? 'Lichess Broadcasts'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[10px] text-[#A0A0A0]">
            {selectedRoundId && (
              <span className="uppercase tracking-wider">
                Round: {selectedRoundId.slice(0, 8)}
              </span>
            )}
            <span
              className={`flex items-center gap-1 ${
                streamConnected
                  ? 'text-[#769656]'
                  : 'text-yellow-400'
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  streamConnected
                    ? 'bg-[#769656] animate-pulse'
                    : 'bg-yellow-400 animate-pulse'
                }`}
              />
              {streamConnected ? 'Live' : 'Connecting'}
            </span>
            <span className="tabular-nums">
              Games: {games.length}
            </span>
          </div>
        </header>

        {/* BROADCAST SELECTORS - compact */}

        {!loadingBroadcasts &&
          broadcasts.length > 0 && (
            <div className="mb-2 grid gap-2 rounded-lg border border-[#383838] bg-[#2A2A2A] p-2 shadow-lg md:grid-cols-2">

              <div className="flex items-center gap-2">
                <label
                  htmlFor="broadcast"
                  className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-[#A0A0A0]"
                >
                  Tour
                </label>

                <select
                  id="broadcast"
                  value={
                    selectedBroadcastIndex
                  }
                  onChange={(event) =>
                    selectBroadcast(
                      Number(
                        event.target.value
                      )
                    )
                  }
                  className="h-7 w-full rounded-md border border-[#383838] bg-[#1E1E1E] px-2 text-xs text-white outline-none transition-colors focus:border-[#769656]"
                >
                  {broadcasts.map(
                    (
                      broadcast,
                      index
                    ) => (
                      <option
                        key={
                          broadcast.tour.id
                        }
                        value={index}
                      >
                        {
                          broadcast.tour
                            .name
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="round"
                  className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-[#A0A0A0]"
                >
                  Round
                </label>

                <select
                  id="round"
                  value={
                    selectedRoundId ??
                    ''
                  }
                  onChange={
                    selectRound
                  }
                  className="h-7 w-full rounded-md border border-[#383838] bg-[#1E1E1E] px-2 text-xs text-white outline-none transition-colors focus:border-[#769656] disabled:opacity-40"
                  disabled={
                    !selectedBroadcast ||
                    selectedBroadcast.rounds.length ===
                      0
                  }
                >
                  {selectedBroadcast?.rounds.map(
                    (round) => (
                      <option
                        key={round.id}
                        value={round.id}
                      >
                        {round.name}
                        {round.finished
                          ? ' · Finished'
                          : ' · Live'}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          )}

        {/* LOADING BROADCASTS */}

        {loadingBroadcasts && (
          <div className="mb-2 rounded-lg border border-[#383838] bg-[#2A2A2A] p-3 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="size-3.5 animate-spin rounded-full border-2 border-[#383838] border-t-[#769656]" />

              <span className="text-xs text-[#A0A0A0]">
                Loading Lichess broadcasts...
              </span>
            </div>
          </div>
        )}

        {/* LOADING GAMES */}

        {!loadingBroadcasts &&
          loadingGames && (
            <div className="mb-2 rounded-lg border border-[#383838] bg-[#2A2A2A] p-3 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="size-3.5 animate-spin rounded-full border-2 border-[#383838] border-t-[#769656]" />

                <span className="text-xs text-[#A0A0A0]">
                  Loading broadcast games...
                </span>
              </div>
            </div>
          )}

        {/* ERROR */}

        {error && (
          <div className="mb-2 rounded-lg border border-[#E63946]/40 bg-[#E63946]/10 p-3 shadow-lg">
            <h2 className="text-[10px] font-semibold uppercase tracking-wider text-[#E63946]">
              Broadcast error
            </h2>

            <p className="mt-1.5 whitespace-pre-wrap break-words text-xs text-[#E63946]/90">
              {error}
            </p>
          </div>
        )}

        {/* SUCCESS */}

        {!loadingBroadcasts &&
          !loadingGames &&
          !error && (
            <>
              {games.length === 0 ? (
                <div className="rounded-lg border border-[#383838] bg-[#2A2A2A] p-6 text-center shadow-lg">
                  <p className="text-xs italic text-[#A0A0A0]">
                    No games available in this round.
                  </p>
                </div>
              ) : (
                <div className="grid gap-2 lg:grid-cols-[240px_minmax(0,1fr)]">

                  {/* GAMES LIST */}

                  <aside className="overflow-hidden rounded-lg border border-[#383838] bg-[#2A2A2A] shadow-lg">
                    <div className="border-b border-[#383838] bg-[#1E1E1E] px-2.5 py-1.5">
                      <h2 className="text-[10px] font-semibold uppercase tracking-wider text-[#A0A0A0]">
                        Games · {games.length}
                      </h2>
                    </div>

                    <div className="thin-scrollbar max-h-[700px] overflow-y-auto">
                      {games.map(
                        (
                          game,
                          index
                        ) => (
                          <button
                            key={game.id}
                            type="button"
                            onClick={() =>
                              selectGame(
                                index
                              )
                            }
                            className={`w-full border-b border-[#383838] px-2.5 py-1.5 text-left transition-colors last:border-b-0 ${
                              index ===
                              selectedIndex
                                ? 'bg-[#4A7C59] text-white'
                                : 'text-white hover:bg-[#383838]'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`text-[10px] tabular-nums ${
                                  index ===
                                  selectedIndex
                                    ? 'text-white/70'
                                    : 'text-[#A0A0A0]/60'
                                }`}
                              >
                                #{index + 1}
                              </span>

                              <span
                                className={`text-[10px] font-semibold tabular-nums ${
                                  index ===
                                  selectedIndex
                                    ? 'text-white'
                                    : 'text-[#769656]'
                                }`}
                              >
                                {
                                  game.result
                                }
                              </span>
                            </div>

                            <div className="mt-0.5 truncate text-xs font-semibold">
                              {
                                game.white
                              }
                            </div>

                            <div
                              className={`truncate text-xs ${
                                index ===
                                selectedIndex
                                  ? 'text-white/90'
                                  : 'text-[#A0A0A0]'
                              }`}
                            >
                              {
                                game.black
                              }
                            </div>
                          </button>
                        )
                      )}
                    </div>
                  </aside>

                  {/* BOARD SECTION */}

                  <section className="min-w-0">
                    {selectedGame && (
                      <>
                        {/* PLAYER BAR - very compact */}

                        <div className="mb-2 rounded-lg border border-[#383838] bg-[#2A2A2A] px-3 py-2 shadow-lg">
                          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">

                            {/* WHITE */}

                            <div className="flex min-w-0 items-center gap-2">
                              <span className="size-2 shrink-0 rounded-full bg-white ring-1 ring-[#383838]" />

                              <div className="min-w-0">
                                <p className="truncate text-xs font-semibold text-white">
                                  {selectedGame.white}
                                  {selectedGame.whiteElo
                                    ? ` · ${selectedGame.whiteElo}`
                                    : ''}
                                </p>
                              </div>

                              <span className="ml-auto shrink-0 rounded border border-[#383838] bg-[#1E1E1E] px-2 py-0.5 font-mono text-xs font-semibold tabular-nums text-white">
                                {parseClock(clocks.white)}
                              </span>
                            </div>

                            {/* RESULT */}

                            <div className="rounded bg-[#1E1E1E] px-2 py-0.5 text-xs font-semibold tabular-nums text-[#769656]">
                              {selectedGame.result}
                            </div>

                            {/* BLACK */}

                            <div className="flex min-w-0 items-center gap-2">
                              <span className="shrink-0 rounded border border-[#383838] bg-[#1E1E1E] px-2 py-0.5 font-mono text-xs font-semibold tabular-nums text-white">
                                {parseClock(clocks.black)}
                              </span>

                              <div className="ml-auto min-w-0 text-right">
                                <p className="truncate text-xs font-semibold text-white">
                                  {selectedGame.black}
                                  {selectedGame.blackElo
                                    ? ` · ${selectedGame.blackElo}`
                                    : ''}
                                </p>
                              </div>

                              <span className="size-2 shrink-0 rounded-full bg-black ring-1 ring-[#383838]" />
                            </div>
                          </div>
                        </div>

                        {/* BOARD + MOVES GRID */}

                        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_clamp(280px,28vw,420px)] lg:items-start">


                          {/* LEFT: Board + Controls */}

                          <div className="min-w-0">
                            {/* CHESSBOARD */}

                            <div className="mx-auto w-full max-w-[700px] overflow-hidden rounded-lg border border-[#383838] shadow-lg">
                              <Chessboard
                                options={{
                                  position,
                                }}
                              />
                            </div>

                            {/* CONTROLS - compact */}

                            <div className="mt-2 flex flex-wrap items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={firstMove}
                                className="flex h-7 min-w-7 items-center justify-center rounded border border-[#383838] bg-[#2A2A2A] px-2 text-xs text-[#A0A0A0] transition-colors hover:border-[#769656] hover:bg-[#383838] hover:text-white"
                              >
                                ⏮
                              </button>

                              <button
                                type="button"
                                onClick={previousMove}
                                className="flex h-7 min-w-7 items-center justify-center rounded border border-[#383838] bg-[#2A2A2A] px-2 text-xs text-[#A0A0A0] transition-colors hover:border-[#769656] hover:bg-[#383838] hover:text-white"
                              >
                                ◀
                              </button>

                              <span className="min-w-[80px] text-center text-[11px] tabular-nums text-[#A0A0A0]">
                                {Math.max(0, moveIndex + 1)} /{' '}
                                {selectedGame.moves.length}
                              </span>

                              <button
                                type="button"
                                onClick={nextMove}
                                className="flex h-7 min-w-7 items-center justify-center rounded border border-[#383838] bg-[#2A2A2A] px-2 text-xs text-[#A0A0A0] transition-colors hover:border-[#769656] hover:bg-[#383838] hover:text-white"
                              >
                                ▶
                              </button>

                              <button
                                type="button"
                                onClick={lastMove}
                                className="flex h-7 min-w-7 items-center justify-center rounded border border-[#383838] bg-[#2A2A2A] px-2 text-xs text-[#A0A0A0] transition-colors hover:border-[#769656] hover:bg-[#383838] hover:text-white"
                              >
                                ⏭
                              </button>

                              <button
                                type="button"
                                onClick={goLive}
                                disabled={isFollowingLive}
                                className={`flex h-7 items-center gap-1.5 rounded border px-2.5 text-[11px] font-medium transition-colors ${
                                  isFollowingLive
                                    ? 'cursor-default border-[#769656]/40 bg-[#769656]/15 text-[#769656]'
                                    : 'border-[#769656] bg-[#769656]/20 text-[#769656] hover:bg-[#769656]/30'
                                }`}
                              >
                                <span
                                  className={`size-1.5 rounded-full ${
                                    isFollowingLive
                                      ? 'bg-[#769656]'
                                      : 'bg-[#769656] animate-pulse'
                                  }`}
                                />
                                Live
                              </button>
                            </div>
                          </div>

                          {/* RIGHT: Moves */}

                          <div className="flex flex-col overflow-hidden rounded-lg border border-[#383838] bg-[#2A2A2A] shadow-lg lg:h-[700px]">
                            <div className="shrink-0 border-b border-[#383838] bg-[#1E1E1E] px-2.5 py-1.5">
                              <h2 className="text-[10px] font-semibold uppercase tracking-wider text-[#A0A0A0]">
                                Moves
                              </h2>
                            </div>

                            <div className="thin-scrollbar min-h-0 flex-1 overflow-y-auto">
                              {selectedGame.moves.length === 0 ? (
                                <div className="p-3 text-center text-xs italic text-[#A0A0A0]">
                                  No moves yet
                                </div>
                              ) : (
                                Array.from({
                                  length: Math.ceil(
                                    selectedGame.moves.length / 2
                                  ),
                                }).map((_, rowIndex) => {
                                  const whiteIndex = rowIndex * 2;
                                  const blackIndex = whiteIndex + 1;

                                  const whiteMove =
                                    selectedGame.moves[whiteIndex];
                                  const blackMove =
                                    selectedGame.moves[blackIndex];

                                  const whiteCurrent =
                                    whiteIndex === moveIndex;
                                  const blackCurrent =
                                    blackIndex === moveIndex;

                                  const handleMoveClick = (
                                    index: number
                                  ) => {
                                    setMoveIndex(index);
                                    moveIndexRef.current = index;

                                    const atLive =
                                      index ===
                                      selectedGame.moves.length - 1;

                                    setIsFollowingLive(atLive);
                                    isFollowingLiveRef.current =
                                      atLive;
                                  };

                                  return (
                                    <div
                                      key={rowIndex}
                                      className="grid grid-cols-[24px_1fr_1fr] items-stretch border-b border-[#383838]/40 last:border-b-0"
                                    >
                                      <span className="flex items-center justify-end pr-1 text-[10px] tabular-nums text-[#A0A0A0]">
                                        {rowIndex + 1}.
                                      </span>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleMoveClick(whiteIndex)
                                        }
                                        className={`px-1.5 py-0.5 text-left text-xs transition-colors ${
                                          whiteCurrent
                                            ? 'bg-[#4A7C59] font-semibold text-white'
                                            : 'text-[#A0A0A0] hover:bg-[#383838] hover:text-white'
                                        }`}
                                      >
                                        {whiteMove}
                                      </button>

                                      {blackMove ? (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleMoveClick(blackIndex)
                                          }
                                          className={`px-1.5 py-0.5 text-left text-xs transition-colors ${
                                            blackCurrent
                                              ? 'bg-[#4A7C59] font-semibold text-white'
                                              : 'text-[#A0A0A0] hover:bg-[#383838] hover:text-white'
                                          }`}
                                        >
                                          {blackMove}
                                        </button>
                                      ) : (
                                        <span />
                                      )}
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </section>
                </div>
              )}
            </>
          )}
      </div>
    </main>
  );
}