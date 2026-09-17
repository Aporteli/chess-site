"use client";

import { AppShell } from "@/components/layout/AppShell";
import { PuzzleBoard } from "@/components/puzzles/PuzzleBoard";
import { GeneratePanel } from "@/components/puzzles/GeneratePanel";
import { StatusPanel } from "@/components/puzzles/StatusPanel";
import { MoveList } from "@/components/puzzles/MoveList";

export default function PuzzlesPage() {
  return (
    <AppShell activeKey="puzzles">
      <div className="flex min-h-0 flex-1 flex-col p-3 pb-6 lg:p-4">
        <div className="board-workspace mx-auto w-full max-w-[1500px]">
          <section className="board-column justify-center">
            <div className="board-square relative">
              <PuzzleBoard />
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