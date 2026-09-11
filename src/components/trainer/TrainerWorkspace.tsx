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
      onToggleEnabled={() => engine.setEnabled(!engine.enabled)}
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
        t.setSettings({ sound: !t.settings.sound });
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
      <div className="mx-auto flex min-h-0 w-full flex-1 flex-col gap-4 overflow-y-auto p-4 sm:p-5 lg:h-full lg:min-h-0 lg:flex-row lg:items-stretch lg:gap-5">
        
        {/* მარცხენა მხარე: ჭადრაკის დაფა */}
        <section className="min-w-0 flex-1 lg:overflow-y-auto">
          <BoardWrapper />
        </section>

        {/* მარჯვენა სვეტი: აერთიანებს aside-ს და HudActionButtons-ს */}
        <div className="flex w-full shrink-0 flex-col gap-3 lg:h-full lg:min-h-0 lg:w-[min(100%,400px)]">
          <aside className="flex min-h-0 flex-1 flex-col gap-3 lg:overflow-hidden">
            <div className="shrink-0">
              <ModeToggle />
            </div>
            <div className="shrink-0">
              <TrainerEnginePanel />
            </div>
              <TrainerHud />
          </aside>

          <div className="shrink-0">
            <HudActionButtons />
          </div>
          <div className="shrink-0">
            <ActionToolbar />
          </div>
        </div>

      </div>
    </StockfishProvider>
  );
}