import { useTrainerValue, type TrainerContextValue } from './useTrainer';

export function useTrainerOptional(): TrainerContextValue | null {
  return useTrainerValue();
}
