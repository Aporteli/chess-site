import React from 'react';
import { usePathname } from 'next/navigation';
import { openingMeta as fallbackMeta } from '@/lib/mock-data';
import { useTrainerOptional } from '@/lib/trainer/context';

const PAGE_TITLES: Record<string, string> = {
  '/trainer': 'Trainer',
  '/puzzles': 'Puzzles',
  '/analysis': 'Analysis',
  '/tablebase': 'Tablebase',
  '/courses': 'Courses',
  '/profile': 'Profile',
};

function getPageTitle(pathname: string): string {
  return (
    PAGE_TITLES[pathname] ??
    Object.entries(PAGE_TITLES).find(([href]) => pathname.startsWith(href))?.[1] ??
    'MoveTrainer'
  );
}

export function NavBreadcrumbs() {
  const trainer = useTrainerOptional();
  const pathname = usePathname();
  const meta = trainer?.openingMeta ?? fallbackMeta;

  const crumbs = trainer
    ? [
        meta.repertoireLabel.split(' / ')[0],
        meta.side === 'white' ? 'White' : 'Black',
        meta.variation ? `${meta.name}: ${meta.variation}` : meta.name,
      ]
    : [getPageTitle(pathname)];

  return (
    <nav aria-label="Breadcrumb" className="hidden min-w-0 flex-1 items-center gap-1.5 text-[13px] md:flex">
      {crumbs.map((crumb, i) => (
        <span key={`${crumb}-${i}`} className="flex min-w-0 items-center gap-1.5">
          {i > 0 && (
            <span className="shrink-0 text-text-muted" aria-hidden>
              /
            </span>
          )}
          <span className={i === crumbs.length - 1 ? 'truncate text-text-primary' : 'truncate text-text-muted'}>
            {crumb}
          </span>
        </span>
      ))}
    </nav>
  );
}
