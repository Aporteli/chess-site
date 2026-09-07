import { AppShell } from "@/components/layout/AppShell";
import TablebaseChecker from "@/components/board/TablebaseChecker";
import { TrainerProvider } from "@/lib/trainer/context";

export default function TablebasePage() {
  return (
    <TrainerProvider>
      <AppShell activeKey="tablebase">
          <div>
            <TablebaseChecker />
          </div>
      </AppShell>
    </TrainerProvider>
  );
}