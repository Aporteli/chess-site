import { create } from "zustand";

import { createInitialAnalysisState } from "./initial-state";
import { createAnalysisActions } from "./analysis-actions";

import type { AnalysisStore } from "./analysis-types";

export type { SaveState } from "./analysis-types";

export const useAnalysisStore =
  create<AnalysisStore>()((...args) => ({
    ...createInitialAnalysisState(),

    ...createAnalysisActions(...args),
  }));