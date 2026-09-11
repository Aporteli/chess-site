'use client';

import { Swords, Puzzle, ScanSearch, Library, Settings, UserRound, TableIcon } from 'lucide-react';
import type { NavKey, NavItem } from '@/lib/types';
import { SidebarBrand } from '@/components/layout/sidebar/SidebarBrand';
import { SidebarNavItem } from '@/components/layout/sidebar/SidebarNavItem';
import { SidebarCollapseToggle } from '@/components/layout/sidebar/SidebarCollapseToggle';

type NavEntry = {
  key: NavKey;
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  comingSoon?: boolean;
};

const allNavEntries: NavEntry[] = [
  {
    key: 'trainer',
    label: 'Openings / Trainer',
    href: '/trainer',
    icon: Swords,
  },
  {
    key: 'puzzles',
    label: 'Puzzles',
    href: '/puzzles',
    icon: Puzzle,
  },
  {
    key: 'analysis',
    label: 'Analysis Board',
    href: '/analysis',
    icon: ScanSearch,
  },
  {
    key: 'courses',
    label: 'Courses & Repertoire',
    href: '/courses',
    icon: Library,
  },
  {
    key: 'tablebase',
    label: 'Tablebase',
    href: '/tablebase',
    icon: TableIcon,
  },
  {
    key: 'profile',
    label: 'Profile',
    href: '/profile',
    icon: UserRound,
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: Settings,
  },
];

export const navItems: NavItem[] = allNavEntries.filter((entry) =>
  ['trainer', 'puzzles', 'analysis', 'courses', 'tablebase'].includes(entry.key),
);

export const secondaryNavItems: NavItem[] = allNavEntries.filter((entry) =>
  ['profile', 'settings'].includes(entry.key),
);

const HREF: Partial<Record<NavKey, string>> = Object.fromEntries(
  allNavEntries.filter((entry) => entry.href).map((entry) => [entry.key, entry.href!]),
);

const ICONS: Partial<Record<NavKey, React.ComponentType<{ className?: string; strokeWidth?: number }>>> =
  Object.fromEntries(allNavEntries.filter((entry) => entry.icon).map((entry) => [entry.key, entry.icon!]));

interface SidebarProps {
  activeKey: NavKey;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ activeKey, collapsed, onToggleCollapsed, mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      {/* Mobile scrim */}
      {mobileOpen && (
        <button
          aria-label="Close navigation"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border-subtle bg-bg-surface',
          'transition-[width,transform] duration-200 ease-out',
          collapsed ? 'lg:w-[76px]' : 'lg:w-[248px]',
          'w-[248px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}>
        <SidebarBrand collapsed={collapsed} onCloseMobile={onCloseMobile} />

        <nav className={['flex-1 space-y-1 overflow-y-auto px-3 py-4', collapsed ? 'no-scrollbar' : ''].join(' ')}>
          {navItems.map((item) => (
            <SidebarNavItem
              key={item.key}
              item={item}
              activeKey={activeKey}
              collapsed={collapsed}
              href={HREF[item.key]}
              icon={ICONS[item.key] as React.ComponentType<{ className?: string; strokeWidth?: number }>}
              onCloseMobile={onCloseMobile}
            />
          ))}
        </nav>

        <SidebarCollapseToggle collapsed={collapsed} onToggleCollapsed={onToggleCollapsed} />

        <div className="space-y-1 border-t border-border-subtle px-3 py-3">
          {secondaryNavItems.map((item) => (
            <SidebarNavItem
              key={item.key}
              item={item}
              activeKey={activeKey}
              collapsed={collapsed}
              href={HREF[item.key]}
              icon={ICONS[item.key] as React.ComponentType<{ className?: string; strokeWidth?: number }>}
              onCloseMobile={onCloseMobile}
            />
          ))}
        </div>
      </aside>
    </>
  );
}
