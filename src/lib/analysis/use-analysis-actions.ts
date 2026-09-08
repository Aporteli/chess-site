import { useAnalysisStore } from "./analysis-store";

export function useAnalysisActions() {
  return useAnalysisStore((state) => ({
    isUploadBoardOpen: state.isUploadBoardOpen,
    loadPosition: state.loadPosition,
    closeUploadModal: state.closeUploadModal,
  }));
}
