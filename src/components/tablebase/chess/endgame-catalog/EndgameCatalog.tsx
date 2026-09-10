'use client';

import { loadEndgame } from '@/lib/tablebase/chess/card-nav';
import { deleteAllKinds, deleteKind } from '@/lib/tablebase/chess/catalog-actions';
import { useTablebaseStore } from '@/stores/tablebase-store';
import { EndgameCatalogHeader } from './EndgameCatalogHeader';
import { EndgameGridList } from './EndgameGridList';

export function EndgameCatalog() {
  const catalog = useTablebaseStore((s) => s.catalog);
  const query = useTablebaseStore((s) => s.endgameQuery);
  const index = useTablebaseStore((s) => s.endgameIndex);
  const building = useTablebaseStore((s) => s.pipeline !== 'idle');
  const setQuery = useTablebaseStore((s) => s.setQuery);
  const setUploadOpen = useTablebaseStore((s) => s.setUploadOpen);

  const q = query.trim().toLowerCase();
  const filtered = catalog.flatMap((eg, i) =>
    !q || eg.id.toLowerCase().includes(q) || eg.icons.includes(q) ? [{ eg, i }] : [],
  );

  return (
    <section
      aria-label="Endgame catalog"
      className="flex shrink-0 flex-col gap-2 rounded-xl bg-surface p-3 shadow-[var(--shadow-border)]">
      <EndgameCatalogHeader
        currentIcons={catalog[index]?.icons}
        filteredCount={filtered.length}
        totalCount={catalog.length}
        building={building}
        hasCatalog={catalog.length > 0}
        onAdd={() => setUploadOpen(true)}
        onDeleteAll={() => deleteAllKinds()}
      />

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter types…"
        className="h-11 w-full rounded-sm bg-elevated px-3 font-mono text-xs text-fg outline-none shadow-[var(--shadow-border)] placeholder:text-subtle focus:shadow-[var(--shadow-border-hover)]"
      />

      <EndgameGridList
        filtered={filtered}
        currentIndex={index}
        building={building}
        onLoad={loadEndgame}
        onDelete={deleteKind}
      />
    </section>
  );
}
