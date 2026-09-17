'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type NnueModel = 'nnue-85' | 'nnue-108' | 'nnue-lite' | 'hce';

export interface SettingsData {
  sound: boolean;
  flipped: boolean;
  legalHints: boolean;
  animations: boolean;
  coordinates: boolean;
  autoReplyDelay: number;
  confirmPromotion: boolean;
  engineEnabled: boolean;
  searchTimeMs: number;
  multiPv: number;
  threads: number;
  hashMb: number;
  nnueModel: NnueModel;
}

export interface SettingsActions {
  toggleSound: () => void;
  toggleFlip: () => void;
  toggleEngine: () => void;
  setSound: (v: boolean) => void;
  setFlipped: (v: boolean) => void;
  setEngineEnabled: (v: boolean) => void;
  setSetting: <K extends keyof SettingsData>(key: K, value: SettingsData[K]) => void;
  reset: () => void;
}

export type SettingsState = SettingsData & SettingsActions;

export const DEFAULT_SETTINGS: SettingsData = {
  sound: true,
  flipped: false,
  legalHints: true,
  animations: true,
  coordinates: true,
  autoReplyDelay: 400,
  confirmPromotion: true,
  engineEnabled: true,
  searchTimeMs: 1000,
  multiPv: 1,
  threads: 1,
  hashMb: 8,
  nnueModel: 'hce',
};

const LEGACY_KEY = 'movetrainer:settings:v1';
const PERSIST_KEY = 'movetrainer:settings';

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_SETTINGS,

      toggleSound: () => set({ sound: !get().sound }),
      toggleFlip: () => set({ flipped: !get().flipped }),
      toggleEngine: () => set({ engineEnabled: !get().engineEnabled }),

      setSound: (sound) => set({ sound }),
      setFlipped: (flipped) => set({ flipped }),
      setEngineEnabled: (engineEnabled) => set({ engineEnabled }),

      setSetting: (key, value) => set({ [key]: value } as Partial<SettingsData>),

      reset: () => set({ ...DEFAULT_SETTINGS }),
    }),
    {
      name: PERSIST_KEY,
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: (s): SettingsData => ({
        sound: s.sound,
        flipped: s.flipped,
        legalHints: s.legalHints,
        animations: s.animations,
        coordinates: s.coordinates,
        autoReplyDelay: s.autoReplyDelay,
        confirmPromotion: s.confirmPromotion,
        engineEnabled: s.engineEnabled,
        searchTimeMs: s.searchTimeMs,
        multiPv: s.multiPv,
        threads: s.threads,
        hashMb: s.hashMb,
        nnueModel: s.nnueModel,
      }),
      migrate: (persisted, version) => {
        if (version < 2 && persisted && typeof persisted === 'object') {
          const old = persisted as Partial<SettingsData>;
          return {
            ...DEFAULT_SETTINGS,
            sound: old.sound ?? DEFAULT_SETTINGS.sound,
            legalHints: old.legalHints ?? DEFAULT_SETTINGS.legalHints,
            animations: old.animations ?? DEFAULT_SETTINGS.animations,
            coordinates: old.coordinates ?? DEFAULT_SETTINGS.coordinates,
            autoReplyDelay: old.autoReplyDelay ?? DEFAULT_SETTINGS.autoReplyDelay,
            confirmPromotion: old.confirmPromotion ?? DEFAULT_SETTINGS.confirmPromotion,
          };
        }
        return persisted as SettingsData;
      },
    },
  ),
);

export function migrateLegacySettings(): void {
  if (typeof window === 'undefined') return;
  const legacy = window.localStorage.getItem(LEGACY_KEY);
  if (!legacy) return;
  try {
    const parsed = JSON.parse(legacy) as Partial<SettingsData>;
    const current = useSettingsStore.getState();
    useSettingsStore.setState({
      sound: parsed.sound ?? current.sound,
      legalHints: parsed.legalHints ?? current.legalHints,
      animations: parsed.animations ?? current.animations,
      coordinates: parsed.coordinates ?? current.coordinates,
      autoReplyDelay: parsed.autoReplyDelay ?? current.autoReplyDelay,
      confirmPromotion: parsed.confirmPromotion ?? current.confirmPromotion,
    });
  } catch {
    /* ignore */
  } finally {
    window.localStorage.removeItem(LEGACY_KEY);
  }
}