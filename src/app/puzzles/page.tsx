"use client";

import { AppShell } from "@/components/layout/AppShell";
import { PuzzleBoard } from "@/components/puzzles/PuzzleBoard";
import { GeneratePanel } from "@/components/puzzles/GeneratePanel";
import { StatusPanel } from "@/components/puzzles/StatusPanel";
import { MoveList } from "@/components/puzzles/MoveList";

export default function PuzzlesPage() {
  return (
    <AppShell activeKey="puzzles">
      <div className="flex h-full min-h-0 flex-1 flex-col p-2">
        <div className="board-workspace w-full">
          <section className="board-column">
            <div className="board-stage">
              <div className="wood-frame relative min-h-0 min-w-0 rounded-xl p-2 sm:rounded-2xl sm:p-2.5">
                <PuzzleBoard />
              </div>
            </div>
          </section>

          <aside className="board-panel thin-scrollbar">
            <GeneratePanel />
            <StatusPanel />
            <MoveList />
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
