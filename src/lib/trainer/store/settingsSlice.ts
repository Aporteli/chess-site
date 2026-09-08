import { saveSettings } from '@/lib/chess';
import { cancelScheduledOpponentReply } from './drillSlice';
import type { SettingsActions, TrainerSlice } from './types';

export const createSettingsSlice: TrainerSlice<SettingsActions> = (set, get) => ({
  setSettings: (patch) =>
    set((state) => {
      const next = { ...state.settings, ...patch };
      saveSettings(next);
      return { settings: next };
    }),

  setMode: (next) => {
    set({ mode: next, selectedSquare: null, moveStatus: 'pending', premove: null });
    cancelScheduledOpponentReply();
    if (next === 'drill') get().startPractice();
    else set({ drill: null });
  },
});
