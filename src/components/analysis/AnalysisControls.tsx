import { StockfishPanel } from "./StockfishPanel";
import { AnalysisActions } from "./AnalysisActions";
import { MoveHistory } from "./MoveHistory";
import { FenDisplay } from "./FenDisplay";

export function AnalysisControls() {
  return (
    <div className="board-panel thin-scrollbar">
      <AnalysisActions />
      <StockfishPanel />
      <MoveHistory />
      <FenDisplay />
    </div>
  );
}
