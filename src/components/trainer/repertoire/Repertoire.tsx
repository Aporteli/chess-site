'use client';

import { useRef, useState } from 'react';
import { ChevronDown, BookMarked, Upload, Trash2, X, Download } from 'lucide-react';
import type { OpeningStore, Repertoire as RepertoireType } from '@/lib/chess';
import type { Side } from '@/lib/types';
import { PgnDialog } from '@/components/trainer/PgnDialog';

export function Repertoire({
  store,
  repertoire,
  selectRepertoire,
  setRepertoireSide,
  onClearAll,
  onDelete,
}: {
  store: OpeningStore;
  repertoire: RepertoireType;
  selectRepertoire: (id: string) => void;
  setRepertoireSide: (id: string, side: Side) => void;
  onClearAll?: () => void;
  onDelete?: (ids: string[]) => void | Promise<void>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [pgnOpen, setPgnOpen] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const holdTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectModeRef = useRef(false);
  const suppressClickRef = useRef(false);
  const [pgn, setPgn] = useState<'import' | 'export' | null>(null);

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
    selectRepertoire(id);
    setIsOpen(false);
  };

  const handleDelete = () => {
    if (checkedIds.length === 0 || !onDelete) return;
    const ids = [...checkedIds];
    onDelete(ids);
    exitSelectMode();
  };

  const isEmpty = store.repertoires.length === 0;

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
        <BookMarked className="size-3.5 text-[#769656]" />
        <span className="max-w-[140px] truncate font-semibold">{repertoire.name}</span>
        <ChevronDown
          className={`size-3 shrink-0 text-[#A0A0A0] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-white' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 w-72 pt-1 animate-in fade-in-0 slide-in-from-top-1 duration-100">
          <div className="flex flex-col overflow-hidden rounded-lg border border-[#383838] bg-[#1E1E1E] shadow-2xl">
            {/* ── Header: Import ან Select-mode actions ── */}
            <div className="flex flex-col gap-1.5 border-b border-[#383838] bg-[#2A2A2A] p-2">
              {selectMode ? (
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={exitSelectMode}
                    className="flex h-7 flex-1 items-center justify-center gap-1.5 rounded bg-[#3A3A3A] font-mono text-3xs font-medium text-white hover:bg-[#4A4A4A] transition-colors">
                    <X className="size-3" />
                    <span>Cancel</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={checkedIds.length === 0}
                    className="flex h-7 flex-1 items-center justify-center gap-1.5 rounded bg-[#E63946] font-mono text-3xs font-medium text-white hover:bg-[#F04A57] disabled:opacity-40 transition-colors">
                    <Trash2 className="size-3" />
                    <span>Delete ({checkedIds.length})</span>
                  </button>
                </div>
              ) : (
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPgn('import')}
                    className="flex h-7 flex-1 items-center justify-center gap-1.5 rounded bg-[#769656] font-mono text-3xs font-medium text-white hover:bg-[#81B64C] disabled:opacity-50 transition-colors">
                    <Upload className="size-3" />
                    <span>Import</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPgn('export')}
                    className="flex h-7 flex-1 items-center justify-center gap-1.5 rounded bg-[#769656] font-mono text-3xs font-medium text-white hover:bg-[#81B64C] disabled:opacity-50 transition-colors">
                    <Download className="size-3" />
                    <span>Export</span>
                  </button>
                </div>
              )}
            </div>

            {/* ── List ── */}
            <div className="thin-scrollbar max-h-64 overflow-y-auto p-1">
              {isEmpty ? (
                <div className="py-6 text-center font-mono text-3xs text-[#A0A0A0]">No repertoires yet</div>
              ) : (
                store.repertoires.map((rep) => {
                  const active = rep.id === repertoire.id;
                  const checked = checkedIds.includes(rep.id);

                  return (
                    <div
                      key={rep.id}
                      className={`group flex h-8 select-none items-center justify-between gap-2 rounded px-2 font-mono text-xs transition-colors ${
                        active ? 'bg-[#4A7C59] text-white font-semibold' : 'text-white hover:bg-[#2A2A2A]'
                      }`}
                      onPointerDown={(e) => handleHoldStart(e, rep.id)}
                      onPointerUp={clearHold}
                      onPointerCancel={clearHold}
                      onClick={() => handleItemClick(rep.id)}
                      onContextMenu={(e) => e.preventDefault()}>
                      {selectMode ? (
                        <input
                          type="checkbox"
                          className="accent-[#4A7C59] shrink-0"
                          checked={checked}
                          onChange={() => toggleChecked(rep.id)}
                          onClick={(e) => e.stopPropagation()}
                          style={{ minWidth: 14, minHeight: 14 }}
                        />
                      ) : null}

                      <span className="min-w-0 flex-1 truncate text-left">{rep.name}</span>

                      <div
                        className="flex shrink-0 gap-0.5"
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          title="You start first (White)"
                          onClick={() => setRepertoireSide(rep.id, 'white')}
                          className={`rounded px-1 py-0.5 text-[10px] font-medium ${
                            rep.side === 'white'
                              ? active
                                ? 'bg-white/20 text-white'
                                : 'bg-[#4A7C59] text-white'
                              : active
                                ? 'text-white/60 hover:text-white'
                                : 'text-[#A0A0A0] hover:text-white'
                          }`}>
                          Me
                        </button>
                        <button
                          type="button"
                          title="Opponent starts first (you are Black)"
                          onClick={() => setRepertoireSide(rep.id, 'black')}
                          className={`rounded px-1 py-0.5 text-[10px] font-medium ${
                            rep.side === 'black'
                              ? active
                                ? 'bg-white/20 text-white'
                                : 'bg-[#4A7C59] text-white'
                              : active
                                ? 'text-white/60 hover:text-white'
                                : 'text-[#A0A0A0] hover:text-white'
                          }`}>
                          Opp
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* ── Footer ── */}
            <div className="flex items-center justify-between border-t border-[#383838] bg-[#2A2A2A] px-2 py-1">
              <span className="font-mono text-3xs text-[#A0A0A0]">
                {store.repertoires.length} {store.repertoires.length === 1 ? 'repertoire' : 'repertoires'}
              </span>

              <button
                type="button"
                disabled={isEmpty}
                onClick={onClearAll}
                className="flex items-center gap-1 font-mono text-3xs text-[#A0A0A0] hover:text-[#E63946] disabled:opacity-30 transition-colors">
                <Trash2 className="size-2.5" />
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
      <PgnDialog open={pgn !== null} mode={pgn ?? 'import'} onClose={() => setPgn(null)} />
    </div>
  );
}
