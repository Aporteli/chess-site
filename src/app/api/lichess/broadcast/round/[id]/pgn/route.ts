import { NextRequest, NextResponse } from 'next/server';
import { parseBroadcastPgn } from '@/lib/lichess/broadcast-pgn';

const LICHESS_API = 'https://lichess.org/api';

const activeRequests = new Map<string, Promise<string>>();

async function fetchBroadcastPgn(id: string): Promise<string> {
  const existingRequest = activeRequests.get(id);

  if (existingRequest) {
    return existingRequest;
  }

  const request = (async () => {
    const response = await fetch(
      `${LICHESS_API}/broadcast/round/${encodeURIComponent(id)}.pgn`,
      {
        headers: {
          Accept: 'application/x-chess-pgn',
        },

        cache: 'no-store',

        signal: AbortSignal.timeout(15_000),
      }
    );

    if (!response.ok) {
      const details = await response.text();

      throw new Error(
        `Lichess API request failed (${response.status}): ${details}`
      );
    }

    return response.text();
  })();

  activeRequests.set(id, request);

  try {
    return await request;
  } finally {
    activeRequests.delete(id);
  }
}

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
        error: 'Missing broadcast round id',
      },
      {
        status: 400,
      }
    );
  }

  try {
    const pgn = await fetchBroadcastPgn(id);

    const games = parseBroadcastPgn(pgn);

    return NextResponse.json(
      {
        roundId: id,
        count: games.length,
        games,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (error) {
    console.error(
      'Lichess broadcast PGN error:',
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : String(error);

    const isTimeout =
      message.includes('TimeoutError') ||
      message.includes('timed out') ||
      message.includes('aborted');

    const isRateLimited =
      message.includes('(429)');

    return NextResponse.json(
      {
        error: 'Failed to fetch broadcast PGN',
        details: message,
        reason: isTimeout
          ? 'Lichess request timed out after 15 seconds.'
          : isRateLimited
            ? 'Lichess is temporarily rate-limiting concurrent requests.'
            : 'Unexpected error while fetching the broadcast.',
      },
      {
        status: isTimeout ? 504 : isRateLimited ? 429 : 500,
      }
    );
  }
}