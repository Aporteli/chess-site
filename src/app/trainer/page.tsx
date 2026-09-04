import { AppShell } from "@/components/layout/AppShell";
import { TrainerWorkspace } from "@/components/trainer/TrainerWorkspace";
import { TrainerGate, TrainerProvider } from "@/lib/trainer/context";

export default function TrainerPage() {
  return (
    <TrainerProvider>
      <AppShell activeKey="trainer">
        <TrainerGate>
          <TrainerWorkspace />
        </TrainerGate>
      </AppShell>
    </TrainerProvider>
  );
}
