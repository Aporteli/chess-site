
import { NextRequest, NextResponse } from 'next/server';

const LICHESS_API = 'https://lichess.org/api';

type LichessBroadcastItem = {
  tour: Record<string, unknown>;
  round: Record<string, unknown>;
  roundToLink?: Record<string, unknown>;
  group?: string;
};

type LichessTopResponse = {
  active?: LichessBroadcastItem[];
  upcoming?: LichessBroadcastItem[];
  past?: {
    currentPageResults?: LichessBroadcastItem[];
  };
};

function parseNdjson(text: string): LichessTopResponse[] {
  const results: LichessTopResponse[] = [];

  for (const line of text.split('\n')) {
    const trimmed = line.trim();

    if (!trimmed) {
      continue;
    }

    try {
      const parsed: unknown = JSON.parse(trimmed);

      if (
        typeof parsed === 'object' &&
        parsed !== null
      ) {
        results.push(
          parsed as LichessTopResponse
        );
      }
    } catch {
      console.warn(
        'Skipping invalid Lichess broadcast line:',
        trimmed
      );
    }
  }

  return results;
}

export async function GET(
  request: NextRequest
) {
  try {
    const page =
      request.nextUrl.searchParams.get('page') ?? '1';

    const url = new URL(
      `${LICHESS_API}/broadcast/top`
    );

    url.searchParams.set('page', page);

    const response = await fetch(
      url.toString(),
      {
        headers: {
          Accept: 'application/x-ndjson',
        },
        cache: 'no-store',
        signal: AbortSignal.timeout(15_000),
      }
    );

    if (!response.ok) {
      const details = await response.text();

      return NextResponse.json(
        {
          error: 'Lichess broadcast top failed',
          status: response.status,
          details,
        },
        {
          status: response.status,
        }
      );
    }

    const text = await response.text();

    const ndjsonResults = parseNdjson(text);

    const firstResult = ndjsonResults[0];

    if (!firstResult) {
      return NextResponse.json(
        {
          page: Number(page),
          count: 0,
          broadcasts: [],
        },
        {
          status: 200,
          headers: {
            'Cache-Control':
              'no-store, max-age=0',
          },
        }
      );
    }

    /*
     * Lichess /api/broadcast/top returns:
     *
     * {
     *   active: [...],
     *   upcoming: [...],
     *   past: {...}
     * }
     *
     * Our frontend expects:
     *
     * {
     *   broadcasts: [
     *     {
     *       tour: {...},
     *       round: {...}
     *     }
     *   ]
     * }
     *
     * Flatten the active list here so the rest
     * of the application does not need to know
     * about Lichess' top-endpoint structure.
     */

    const active =
      firstResult.active ?? [];

    const upcoming =
      firstResult.upcoming ?? [];

    const past =
      firstResult.past?.currentPageResults ?? [];

    const broadcasts = [
      ...active,
      ...upcoming,
      ...past,
    ];

    return NextResponse.json(
      {
        page: Number(page),
        count: broadcasts.length,
        broadcasts,
      },
      {
        status: 200,
        headers: {
          'Cache-Control':
            'no-store, max-age=0',
        },
      }
    );
  } catch (error) {
    console.error(
      'Lichess broadcast top error:',
      error
    );

    return NextResponse.json(
      {
        error:
          'Failed to fetch Lichess broadcasts',
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      }
    );
  }
}

