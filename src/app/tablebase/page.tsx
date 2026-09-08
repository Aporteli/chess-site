import { AppShell } from "@/components/layout/AppShell";
import { TablebaseChecker } from "@/components/tablebase/chess/TablebaseChecker";
import { TrainerProvider } from "@/lib/trainer/context";

export default function TablebasePage() {
  return (
    <TrainerProvider>
      <AppShell activeKey="tablebase">
        <TablebaseChecker />
      </AppShell>
    </TrainerProvider>
  );
}