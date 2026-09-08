import { StockfishPanel } from "./StockfishPanel";
import { AnalysisActions } from "./AnalysisActions";
import { MoveHistory } from "./MoveHistory";
import { FenDisplay } from "./FenDisplay";

export function AnalysisControls() {
  return (
    <div className="flex min-h-0 w-full flex-col gap-3 xl:col-span-4 xl:h-full xl:overflow-y-auto">
      <AnalysisActions />
      <StockfishPanel />
      <MoveHistory />
      <FenDisplay />
    </div>
  );
}
