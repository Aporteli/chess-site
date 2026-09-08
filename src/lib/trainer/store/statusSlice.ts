import type { StatusActions, TrainerSlice } from './types';

let statusTimer: ReturnType<typeof setTimeout> | null = null;

export const createStatusSlice: TrainerSlice<StatusActions> = (set) => ({
  flashStatus: (status) => {
    set({ moveStatus: status });
    if (statusTimer) clearTimeout(statusTimer);
    statusTimer = setTimeout(() => set({ moveStatus: 'pending' }), 900);
  },
});
