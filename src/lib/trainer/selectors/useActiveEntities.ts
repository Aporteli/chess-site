import { useMemo } from 'react';
import { useTrainerStore } from '../store';
import { deriveActive, type ActiveEntities } from '../store/deriveActive';

export function useActiveEntities(): ActiveEntities {
  const store = useTrainerStore((s) => s.store);
  const repId = useTrainerStore((s) => s.repId);
  const chapterId = useTrainerStore((s) => s.chapterId);
  const path = useTrainerStore((s) => s.path);

  return useMemo(() => deriveActive({ store, repId, chapterId, path }), [store, repId, chapterId, path]);
}
