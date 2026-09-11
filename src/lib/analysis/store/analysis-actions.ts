import type { StateCreator } from 'zustand';

import { createMoveActions } from './move-actions';
import { createPositionActions } from './position-actions';
import { createUiActions } from './ui-actions';

import type { AnalysisActions, AnalysisStore } from './analysis-types';

export const createAnalysisActions: StateCreator<AnalysisStore, [], [], AnalysisActions> = (set, get, api) => ({
  ...createUiActions(set, get, api),
  ...createPositionActions(set, get, api),
  ...createMoveActions(set, get, api),
});
