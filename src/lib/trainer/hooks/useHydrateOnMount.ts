import { useEffect } from 'react';
import { useTrainerStore } from '../store';

export function useHydrateOnMount(full = false) {
  const hydrate = useTrainerStore((s) => s.hydrate);
  const persist = useTrainerStore((s) => s.persist);
  const ready = useTrainerStore((s) => s.ready);
  const store = useTrainerStore((s) => s.store);
  const repId = useTrainerStore((s) => s.repId);
  const chapterId = useTrainerStore((s) => s.chapterId);

  // Load persisted data once on mount.
  useEffect(() => {
    hydrate({ full });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save whenever the persisted slice of state changes.
  useEffect(() => {
    if (!ready) return;
    persist();
  }, [store, ready, repId, chapterId, persist]);

  useEffect(() => {
    const flush = () => useTrainerStore.getState().persistNow();
    window.addEventListener('pagehide', flush);
    window.addEventListener('beforeunload', flush);
    return () => {
      window.removeEventListener('pagehide', flush);
      window.removeEventListener('beforeunload', flush);
    };
  }, []);
}
