"use client";

import { AppShell } from "@/components/layout/AppShell";
import { PuzzleBoard } from "@/components/puzzles/PuzzleBoard";
import { GeneratePanel } from "@/components/puzzles/GeneratePanel";
import { StatusPanel } from "@/components/puzzles/StatusPanel";
import { MoveList } from "@/components/puzzles/MoveList";

export default function PuzzlesPage() {
  return (
    <AppShell activeKey="puzzles">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-3 pb-6 xl:overflow-hidden xl:p-4">
        <div className="mx-auto grid min-h-0 w-full max-w-[1400px] flex-1 grid-cols-1 gap-4 xl:grid-cols-12 xl:items-stretch xl:gap-5 xl:overflow-hidden">
          <section
            className="flex min-h-0 min-w-0 flex-col items-center justify-center xl:col-span-7 xl:h-full"
            style={{ containerType: "inline-size" }}
          >
            <div className="flex w-full max-w-[min(100%,calc(100dvh-9rem))] flex-col xl:max-h-full xl:max-w-none">
              <div className="relative mx-auto aspect-square w-full max-w-[min(100%,640px)] xl:h-[min(100cqw,calc(100dvh-10rem))] xl:w-[min(100cqw,calc(100dvh-10rem))] xl:max-w-none">
                <PuzzleBoard />
              </div>
            </div>
          </section>

          <aside className="flex min-h-0 flex-col gap-3 xl:col-span-5 xl:h-full xl:overflow-y-auto">
            <GeneratePanel />
            <StatusPanel />
            <MoveList />
          </aside>
        </div>
      </div>
    </AppShell>
  );
}