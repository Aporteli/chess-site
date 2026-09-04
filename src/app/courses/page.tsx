import { AppShell } from "@/components/layout/AppShell";
import { RepertoireLibrary } from "@/components/trainer/RepertoireLibrary";
import { TrainerGate, TrainerProvider } from "@/lib/trainer/context";

export default function CoursesPage() {
  return (
    <TrainerProvider>
      <AppShell activeKey="courses">
        <TrainerGate>
          <RepertoireLibrary />
        </TrainerGate>
      </AppShell>
    </TrainerProvider>
  );
}
