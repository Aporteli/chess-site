import { useShallow } from 'zustand/react/shallow';
import { useAnalysisStore } from './store/analysis-store';

export function useAnalysisActions() {
  return useAnalysisStore(
    useShallow((state) => ({
      isUploadBoardOpen: state.isUploadBoardOpen,
      loadPosition: state.loadPosition,
      closeUploadModal: state.closeUploadModal,
    })),
  );
}
