import { ScanSearch } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ComingSoon } from "@/components/layout/ComingSoon";

export default function AnalysisPage() {
  return (
    <AppShell activeKey="analysis">
      <ComingSoon
        icon={ScanSearch}
        title="Analysis board is on its way"
        description="Drop in a PGN or FEN and get engine evaluation, threat arrows, and line comparison — powered by Stockfish."
      />
    </AppShell>
  );
}
