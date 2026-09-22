
import { NextRequest } from 'next/server';

const LICHESS_API = 'https://lichess.org/api';

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await context.params;

  if (!id) {
    return new Response(
      JSON.stringify({
        error: 'Missing broadcast round id',
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  try {
    const response = await fetch(
      `${LICHESS_API}/stream/broadcast/round/${encodeURIComponent(id)}.pgn`,
      {
        headers: {
          Accept: 'application/x-chess-pgn',
        },
        cache: 'no-store',
        signal: request.signal,
      }
    );

    if (!response.ok || !response.body) {
      const details = await response.text();

      return new Response(
        JSON.stringify({
          error: 'Lichess stream request failed',
          status: response.status,
          details,
        }),
        {
          status: response.status,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return new Response(response.body, {
      status: 200,
      headers: {
        'Content-Type': 'application/x-chess-pgn',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error(
      'Lichess broadcast stream error:',
      error
    );

    return new Response(
      JSON.stringify({
        error: 'Failed to connect to Lichess broadcast stream',
        details:
          error instanceof Error
            ? error.message
            : String(error),
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

