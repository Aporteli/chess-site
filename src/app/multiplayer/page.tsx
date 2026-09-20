import { AppShell } from '@/components/layout/AppShell';
import { MultiplayerWorkspace } from '@/components/multiplayer/MultiplayerWorkspace';

export default function MultiplayerPage() {
  return (
    <AppShell activeKey="multiplayer">
      <MultiplayerWorkspace />
    </AppShell>
  );
}
