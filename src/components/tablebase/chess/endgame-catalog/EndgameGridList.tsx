//CUT: შესამცირებელი ფაილი

'use client';

import { useState } from 'react';
import { Trash2, ChevronDown, Layers, Plus, Search, Check } from 'lucide-react';
import { useTablebaseStore } from '@/stores/tablebase-store';
import { Button } from '@/components/tablebase/ui/button';

interface EndgameItem {
  id: string;
  icons: string;
}

interface FilteredItem {
  eg: EndgameItem;
  i: number;
}

interface EndgameGridListProps {
  filtered: FilteredItem[];
  currentIndex: number;
  building: boolean;
  hasCatalog?: boolean;
  onLoad: (index: number) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onDeleteAll: () => void;
}

export function EndgameGridList({
  filtered,
  currentIndex,
  building,
  hasCatalog = true,
  onLoad,
  onDelete,
  onAdd,
  onDeleteAll,
}: EndgameGridListProps) {
  const query = useTablebaseStore((s) => s.endgameQuery);
  const setQuery = useTablebaseStore((s) => s.setQuery);
  const [isOpen, setIsOpen] = useState(false);

  const selectedItem = filtered.find(({ i }) => i === currentIndex)?.eg;

  return (
    <div className="relative inline-block" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      {/* 1. კომპაქტური Pill-Style Trigger ღილაკი */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex h-8 items-center gap-2 rounded-md border px-2.5 text-xs font-mono transition-all duration-150 ${
          isOpen
            ? 'border-accent/50 bg-accent/10 text-fg shadow-sm'
            : 'border-border-subtle bg-surface text-muted hover:border-fg/20 hover:text-fg'
        }`}>
        <Layers className="size-3.5 text-accent/80" />
        <span className="font-semibold">{selectedItem ? selectedItem.icons : 'Endgame Types'}</span>
        <ChevronDown
          className={`size-3 transition-transform duration-200 ${isOpen ? 'rotate-180 text-fg' : 'text-subtle'}`}
        />
      </button>

      {/* 2. Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-0 top-full z-50 pt-1 w-72 animate-in fade-in-0 slide-in-from-top-1 duration-100">
          <div className="flex flex-col overflow-hidden rounded-lg border border-border-subtle bg-bg-surface shadow-2xl">
            {/* Header: Search + Add */}
            <div className="flex items-center justify-between gap-1.5 border-b border-border-subtle bg-surface/50 p-1.5">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-subtle" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter..."
                  className="h-7 w-full rounded bg-transparent pl-7 pr-2 font-mono text-xs text-fg placeholder:text-subtle focus:outline-none"
                  autoFocus
                />
              </div>
              <button
                type="button"
                disabled={building}
                onClick={onAdd}
                className="flex h-7 items-center gap-1 rounded bg-accent/15 px-2 text-3xs font-medium text-accent hover:bg-accent/25 disabled:opacity-50 transition-colors">
                <Plus className="size-3" />
                Add
              </button>
            </div>

            {/* List */}
            <div className="max-h-60 overflow-y-auto p-1 space-y-0.5">
              {filtered.length === 0 ? (
                <div className="py-4 text-center font-mono text-3xs text-subtle">No matching endgames</div>
              ) : (
                filtered.map(({ eg, i }) => {
                  const isSelected = i === currentIndex;
                  return (
                    <div
                      key={eg.id}
                      className={`group flex h-8 items-center justify-between rounded px-2 font-mono text-xs transition-colors ${
                        isSelected
                          ? 'bg-accent/15 text-accent font-semibold'
                          : 'text-fg/70 hover:bg-elevated hover:text-fg'
                      }`}>
                      <button
                        type="button"
                        onClick={() => {
                          onLoad(i);
                          setIsOpen(false);
                        }}
                        disabled={building}
                        className="flex flex-1 items-center gap-2 text-left disabled:opacity-50">
                        {isSelected && <Check className="size-3 shrink-0 text-accent" />}
                        <span className={isSelected ? '' : 'ml-5'}>{eg.icons}</span>
                      </button>

                      <button
                        type="button"
                        aria-label={`Delete ${eg.id}`}
                        disabled={building}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(eg.id);
                        }}
                        className="opacity-0 transition-opacity hover:text-danger group-hover:opacity-100 disabled:opacity-30">
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Compact Footer */}
            {hasCatalog && (
              <div className="flex items-center justify-between border-t border-border-subtle bg-surface/30 px-2 py-1">
                <span className="font-mono text-3xs text-subtle">{filtered.length} types</span>
                <button
                  type="button"
                  disabled={building}
                  onClick={onDeleteAll}
                  className="flex items-center gap-1 text-3xs text-subtle hover:text-danger disabled:opacity-30 transition-colors">
                  <Trash2 className="size-2.5" />
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
