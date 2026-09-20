'use client';

import { useRef, useState } from 'react';
import { ChevronDown, FileText, Upload, Trash2 } from 'lucide-react';
import type { Chapter as ChapterType, OpeningStore } from '@/lib/chess';
import { nodeCount } from '@/lib/chess';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export function Chapter({
  store,
  chapter,
  selectChapter,
  onImport,
  onClearAll,
  onDeleteChapter,
}: {
  store: OpeningStore;
  chapter: ChapterType;
  selectChapter: (id: string) => void;
  onImport?: () => void;
  onClearAll?: () => void;
  onDeleteChapter?: (id: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const holdTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectModeRef = useRef(false);
  const suppressClickRef = useRef(false);

  // დადასტურების state — ან მთლიანი clearAll, ან კონკრეტული chapter
  const [confirmKind, setConfirmKind] = useState<'delete' | 'clearAll' | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const repertoire = store.repertoires.find((r) => r.chapters.some((c) => c.id === chapter.id));
  const chapters = repertoire?.chapters ?? [];
  const isEmpty = chapters.length === 0;

  const clearHold = () => {
    if (holdTimeout.current) {
      clearTimeout(holdTimeout.current);
      holdTimeout.current = null;
    }
  };

  const exitSelectMode = () => {
    clearHold();
    selectModeRef.current = false;
    suppressClickRef.current = false;
    setSelectMode(false);
    setCheckedIds([]);
  };

  const closeDropdown = () => {
    setIsOpen(false);
    exitSelectMode();
  };

  const handleHoldStart = (e: React.PointerEvent, id: string) => {
    if (e.button !== 0 || selectModeRef.current) return;
    clearHold();
    holdTimeout.current = setTimeout(() => {
      selectModeRef.current = true;
      suppressClickRef.current = true;
      setSelectMode(true);
      setCheckedIds([id]);
    }, 500);
  };

  const toggleChecked = (id: string) => {
    setCheckedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      if (next.length === 0) {
        selectModeRef.current = false;
        setSelectMode(false);
      }
      return next;
    });
  };

  const handleItemClick = (id: string) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    if (selectModeRef.current) {
      toggleChecked(id);
      return;
    }
    selectChapter(id);
    setIsOpen(false);
  };

  // ── დადასტურების ლოგიკა ──
  const requestDeleteChapter = (id: string) => {
    setPendingDeleteId(id);
    setConfirmKind('delete');
  };

  const requestClearAll = () => {
    if (isEmpty || !onClearAll) return;
    setConfirmKind('clearAll');
  };

  const confirmAction = () => {
    if (confirmKind === 'delete' && pendingDeleteId) {
      onDeleteChapter?.(pendingDeleteId);
    } else if (confirmKind === 'clearAll') {
      onClearAll?.();
    }
    setConfirmKind(null);
    setPendingDeleteId(null);
  };

  const cancelConfirm = () => {
    setConfirmKind(null);
    setPendingDeleteId(null);
  };

  // დასახელება დიალოგისთვის — ვიპოვოთ chapter-ის სახელი id-ით
  const pendingChapter = pendingDeleteId
    ? chapters.find((c) => c.id === pendingDeleteId)
    : null;

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => {
        if (selectModeRef.current) return;
        closeDropdown();
      }}>
      <button
        type="button"
        onClick={() => {
          if (isOpen) closeDropdown();
          else setIsOpen(true);
        }}
        className={`flex h-8 items-center gap-2 rounded-md px-2.5 font-mono text-xs transition-all duration-150 ${
          isOpen ? 'bg-[#383838] text-white' : 'bg-[#2A2A2A] text-white hover:bg-[#383838]'
        }`}>
        <FileText className="size-3.5 text-[#769656]" />
        <span className="max-w-[160px] truncate font-semibold">{chapter.name}</span>
        <ChevronDown
          className={`size-3 shrink-0 text-[#A0A0A0] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-white' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 w-72 pt-1 animate-in fade-in-0 slide-in-from-top-1 duration-100">
          <div className="flex flex-col overflow-hidden rounded-lg border border-[#383838] bg-[#1E1E1E] shadow-2xl">
            <div className="thin-scrollbar max-h-64 overflow-y-auto p-1">
              {isEmpty ? (
                <div className="py-6 text-center font-mono text-3xs text-[#A0A0A0]">No chapters yet</div>
              ) : (
                chapters.map((ch) => {
                  const active = ch.id === chapter.id;
                  const checked = checkedIds.includes(ch.id);

                  return (
                    <div
                      key={ch.id}
                      className={`group flex h-8 select-none items-center justify-between rounded px-2 font-mono text-xs transition-colors ${
                        active ? 'bg-[#4A7C59] text-white' : 'text-white hover:bg-[#2A2A2A]'
                      }`}
                      onPointerDown={(e) => handleHoldStart(e, ch.id)}
                      onPointerUp={clearHold}
                      onPointerCancel={clearHold}
                      onClick={() => handleItemClick(ch.id)}
                      onContextMenu={(e) => e.preventDefault()}>
                      {selectMode ? (
                        <input
                          type="checkbox"
                          className="accent-[#4A7C59] mr-2 shrink-0"
                          checked={checked}
                          onChange={() => toggleChecked(ch.id)}
                          onClick={(e) => e.stopPropagation()}
                          style={{ minWidth: 14, minHeight: 14 }}
                        />
                      ) : null}

                      <span className="flex min-w-0 flex-1 items-center justify-between gap-2 pr-2 text-left">
                        <span className="flex min-w-0 flex-1 items-center gap-1.5">
                          <span className={`truncate ${active ? 'font-semibold' : ''}`}>{ch.name}</span>
                          {ch.eco && (
                            <span
                              className={`shrink-0 text-[10px] uppercase ${
                                active ? 'text-white/80' : 'text-[#A0A0A0]'
                              }`}>
                              {ch.eco}
                            </span>
                          )}
                        </span>
                        <span
                          className={`shrink-0 tabular-nums text-3xs font-medium ${
                            active ? 'text-white/90' : 'text-[#A0A0A0]'
                          }`}>
                          {nodeCount(ch)}
                        </span>
                      </span>

                      <span className="flex w-4 shrink-0 items-center justify-center">
                        {!selectMode && (
                          <button
                            type="button"
                            aria-label="Delete chapter"
                            onClick={(e) => {
                              e.stopPropagation();
                              requestDeleteChapter(ch.id);
                            }}
                            className="opacity-0 transition-opacity hover:text-[#E63946] group-hover:opacity-100">
                            <Trash2 className="size-3" />
                          </button>
                        )}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex items-center justify-between border-t border-[#383838] bg-[#2A2A2A] px-2 py-1">
              <span className="font-mono text-3xs text-[#A0A0A0]">
                {chapters.length} {chapters.length === 1 ? 'chapter' : 'chapters'}
              </span>

              <button
                type="button"
                disabled={isEmpty}
                onClick={requestClearAll}
                className="flex items-center gap-1 font-mono text-3xs text-[#A0A0A0] hover:text-[#E63946] disabled:opacity-30 transition-colors">
                <Trash2 className="size-2.5" />
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmKind !== null}
        title={
          confirmKind === 'clearAll'
            ? 'Clear all chapters?'
            : `Delete "${pendingChapter?.name ?? 'chapter'}"?`
        }
        body={
          confirmKind === 'clearAll'
            ? 'This will permanently delete every chapter in this repertoire. This action cannot be undone.'
            : 'This chapter and all its moves will be permanently deleted. This action cannot be undone.'
        }
        confirmLabel={confirmKind === 'clearAll' ? 'Clear All' : 'Delete'}
        cancelLabel="Cancel"
        onConfirm={confirmAction}
        onCancel={cancelConfirm}
      />
    </div>
  );
}