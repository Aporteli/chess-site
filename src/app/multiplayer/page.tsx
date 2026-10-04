import { Suspense } from 'react';
import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { MultiplayerWorkspace } from '@/components/multiplayer/MultiplayerWorkspace';

export const metadata: Metadata = {
  title: 'Play · PawnX',
  description: 'Play an unrated chess game with a friend or the next player online.',
};

export default function MultiplayerPage() {
  return (
    <AppShell activeKey="multiplayer">
      <Suspense
        fallback={
          <div className="grid min-h-full flex-1 place-items-center font-mono text-xs text-text-muted">
            Opening the board…
          </div>
        }>
        <MultiplayerWorkspace />
      </Suspense>
    </AppShell>
  );
}
