import { Puzzle } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ComingSoon } from "@/components/layout/ComingSoon";

export default function PuzzlesPage() {
  return (
    <AppShell activeKey="puzzles">
      <ComingSoon
        icon={Puzzle}
        title="Puzzle training is on its way"
        description="Tactics drawn from your own games and repertoire gaps, rated and tracked alongside your opening SRS."
      />
    </AppShell>
  );
}
