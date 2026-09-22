import { NextRequest, NextResponse } from 'next/server';

const LICHESS_API = 'https://lichess.org/api';

type Broadcast = {
  tour: {
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
      regulations?: string;
    };
    createdAt?: number;
    url: string;
    tier?: number;
    dates?: number[];
    image?: string;
    description?: string;
    teamTable?: boolean;
    showTeamScores?: boolean;
  };
  rounds: Array<{
    id: string;
    name: string;
    slug: string;
    startsAt?: number;
    finishedAt?: number;
    finished?: boolean;
    ongoing?: boolean;
    url: string;
  }>;
  defaultRoundId?: string;
  group?: string;
};

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      {
        error: 'Missing broadcast id',
      },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${LICHESS_API}/broadcast/${encodeURIComponent(id)}`,
      {
        headers: {
          Accept: 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const body = await response.text();

      return NextResponse.json(
        {
          error: 'Lichess API request failed',
          status: response.status,
          details: body,
        },
        { status: response.status }
      );
    }

    const data = (await response.json()) as Broadcast;

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Lichess broadcast API error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch broadcast from Lichess',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}