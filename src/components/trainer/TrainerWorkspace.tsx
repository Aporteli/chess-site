//CUT: შესამცირებელი ფაილი

'use client';

import { useEffect } from 'react';
import { BoardWrapper } from '@/components/board/BoardWrapper';
import { TrainerHud } from '@/components/trainer/trainer-hud/TrainerHud';
import { ModeToggle } from '@/components/trainer/ModeToggle';
import { MOVE_NAGS } from '@/lib/chess';
import { useTrainer } from '@/lib/trainer/context';
import { StockfishProvider, useStockfishEngine } from '@/components/stockfish/StockfishContext';
import StockfishDashboard from '@/components/stockfish/stockfish-dashboard/StockfishDashboard';
import { HudActionButtons } from './trainer-hud/HudActionButtons';
import { ActionToolbar } from './action-toolbar/ActionToolbar';
import { useSettingsStore } from '@/stores/settings-store';

function TrainerEnginePanel() {
  const t = useTrainer();
  const engine = useStockfishEngine();
  const turn = (t.fen.split(' ')[1] || 'w') as 'w' | 'b';
  const moveNumber = Number(t.fen.split(' ')[5] || 1);

  return (
    <StockfishDashboard
      evalScore={engine.evaluation}
      isAnalyzing={engine.isThinking}
      onStart={() => engine.evaluatePosition(t.fen)}
      onStop={engine.stop}
      settings={engine.settings}
      limits={engine.limits}
      depth={engine.depth}
      nps={engine.nps}
      onSettingsChange={engine.commitSettings}
      analysisLines={engine.lines}
      turn={turn}
      moveNumber={moveNumber}
      fen={t.fen}
      enabled={engine.enabled}
      onToggleEnabled={() =>
        useSettingsStore.getState().setEngineEnabled(!engine.enabled)
      }
      onPlayMove={(ucis) => {
        for (const uci of ucis) {
          const ok = t.playUserMove(uci.slice(0, 2), uci.slice(2, 4), uci[4]);
          if (!ok) break;
        }
      }}
    />
  );
}

export function TrainerWorkspace() {
  const t = useTrainer();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        t.goBack();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        t.goForward();
      } else if (e.key === 'Home') {
        e.preventDefault();
        t.goStart();
      } else if (e.key === 'End') {
        e.preventDefault();
        t.goEnd();
      } else if (e.key === 'f' || e.key === 'F') {
        t.flipBoard();
      } else if (e.key === 'h' || e.key === 'H') {
        t.requestHint();
      } else if (e.key === 's' || e.key === 'S') {
        useSettingsStore.getState().toggleSound();
      } else if (e.key === 'Escape') {
        t.clearMarks();
      } else if (e.key === 'Enter') {
        if (t.mode === 'drill') {
          if (t.drill?.lineComplete || t.drill?.sessionOver) t.startPractice();
          else t.revealSolution();
        }
      } else if (t.mode === 'study' && /^[1-6]$/.test(e.key)) {
        const nag = MOVE_NAGS[Number(e.key) - 1];
        if (!nag) return;
        const nags = t.node.nags.includes(nag.code)
          ? t.node.nags.filter((n) => n !== nag.code)
          : [...t.node.nags, nag.code];
        t.updateCurrent({ nags });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [t]);

  return (
    <StockfishProvider fen={t.fen}>
      <div className="flex h-full min-h-0 w-full flex-1 flex-col p-2">
        <div className="board-workspace w-full [--eval-gutter:1.375rem]">
          <section className="board-column">
            <BoardWrapper />
          </section>

          <div className="board-panel thin-scrollbar overflow-hidden!">
            <div className="shrink-0">
              <ModeToggle />
            </div>

            <div className="shrink-0">
              <TrainerEnginePanel />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto thin-scrollbar">
              <TrainerHud />
            </div>

            <div className="shrink-0 space-y-2">
              <HudActionButtons />
              <ActionToolbar />
            </div>
          </div>
        </div>
      </div>
    </StockfishProvider>
  );
}