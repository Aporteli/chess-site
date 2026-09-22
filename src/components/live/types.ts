export type BroadcastGame = {
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
  
  export type BroadcastResponse = {
    roundId: string;
    count: number;
    games: BroadcastGame[];
  };
  
  export type BroadcastRound = {
    id: string;
    name: string;
    slug: string;
    finishedAt?: number;
    finished?: boolean;
    startsAt?: number;
    url: string;
  };
  
  export type BroadcastTour = {
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
  
  export type BroadcastItem = {
    tour: BroadcastTour;
    rounds: BroadcastRound[];
    defaultRoundId?: string;
    group?: string;
  };
  
  export type RawBroadcastItem = {
    tour: BroadcastTour;
    round: BroadcastRound;
    roundToLink?: BroadcastRound;
    group?: string;
  };
  
  export type BroadcastListResponse = {
    count: number;
    broadcasts: RawBroadcastItem[];
  };