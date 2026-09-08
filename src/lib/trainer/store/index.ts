import { create } from 'zustand';
import { initialCoreState, createCoreSlice } from './coreSlice';
import { createStatusSlice } from './statusSlice';
import { createHydrationSlice } from './hydrationSlice';
import { createNavigationSlice } from './navigationSlice';
import { createMoveSlice } from './moveSlice';
import { createDrillSlice } from './drillSlice';
import { createEditingSlice } from './editingSlice';
import { createImportExportSlice } from './importExportSlice';
import { createLibrarySlice } from './librarySlice';
import { createBoardMarksSlice } from './boardMarksSlice';
import { createSettingsSlice } from './settingsSlice';
import type { TrainerState } from './types';

export const useTrainerStore = create<TrainerState>()((...args) => ({
  ...initialCoreState,
  ...createCoreSlice(...args),
  ...createStatusSlice(...args),
  ...createHydrationSlice(...args),
  ...createNavigationSlice(...args),
  ...createMoveSlice(...args),
  ...createDrillSlice(...args),
  ...createEditingSlice(...args),
  ...createImportExportSlice(...args),
  ...createLibrarySlice(...args),
  ...createBoardMarksSlice(...args),
  ...createSettingsSlice(...args),
}));

export type { TrainerState } from './types';
export { deriveActive } from './deriveActive';
