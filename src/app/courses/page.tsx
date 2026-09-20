import { AppShell } from "@/components/layout/AppShell";
import { RepertoireLibrary } from "@/components/courses/RepertoireLibrary";
import { TrainerGate, TrainerProvider } from "@/lib/trainer/context";

export default function CoursesPage() {
  return (
    <TrainerProvider full>
      <AppShell activeKey="courses">
        <TrainerGate allowEmpty>
          <RepertoireLibrary />
        </TrainerGate>
      </AppShell>
    </TrainerProvider>
  );
}
