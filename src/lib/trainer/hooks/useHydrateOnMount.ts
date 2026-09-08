import { useEffect } from 'react';
import { useTrainerStore } from '../store';

export function useHydrateOnMount() {
  const hydrate = useTrainerStore((s) => s.hydrate);
  const persist = useTrainerStore((s) => s.persist);
  const ready = useTrainerStore((s) => s.ready);
  const store = useTrainerStore((s) => s.store);
  const repId = useTrainerStore((s) => s.repId);
  const chapterId = useTrainerStore((s) => s.chapterId);

  // Load persisted data once on mount.
  useEffect(() => {
    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save whenever the persisted slice of state changes.
  useEffect(() => {
    if (!ready) return;
    persist();
  }, [store, ready, repId, chapterId, persist]);
}
