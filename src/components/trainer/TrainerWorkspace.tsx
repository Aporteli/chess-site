"use client";

import { useEffect } from "react";
import { BoardWrapper } from "@/components/board/BoardWrapper";
import { TrainerHud } from "@/components/trainer/TrainerHud";
import { MOVE_NAGS } from "@/lib/chess";
import { useTrainer } from "@/lib/trainer/context";
import { StockfishProvider } from "@/lib/chess/use-stockfish";

export function TrainerWorkspace() {
  const t = useTrainer();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        t.goBack();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        t.goForward();
      } else if (e.key === "Home") {
        e.preventDefault();
        t.goStart();
      } else if (e.key === "End") {
        e.preventDefault();
        t.goEnd();
      } else if (e.key === "f" || e.key === "F") {
        t.flipBoard();
      } else if (e.key === "h" || e.key === "H") {
        t.requestHint();
      } else if (e.key === "s" || e.key === "S") {
        t.setSettings({ sound: !t.settings.sound });
      } else if (e.key === "Escape") {
        t.clearMarks();
      } else if (e.key === "Enter") {
        if (t.mode === "drill") {
          if (t.drill?.lineComplete || t.drill?.sessionOver) t.startPractice();
          else t.revealSolution();
        }
      } else if (t.mode === "study" && /^[1-6]$/.test(e.key)) {
        const nag = MOVE_NAGS[Number(e.key) - 1];
        if (!nag) return;
        const nags = t.node.nags.includes(nag.code)
          ? t.node.nags.filter((n) => n !== nag.code)
          : [...t.node.nags, nag.code];
        t.updateCurrent({ nags });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [t]);

  return (
    <StockfishProvider fen={t.fen}>
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 p-4 sm:p-6 lg:flex-row lg:items-start lg:gap-6">
        <section className="flex-1 lg:sticky lg:top-[88px]">
          <BoardWrapper />
          <p className="mx-auto mt-3 hidden max-w-[620px] text-center text-[11px] text-text-muted lg:block">
            {t.mode === "study"
              ? "Study — play moves to author the tree. Right-drag arrows, right-click squares. Press ? via the keyboard icon."
              : "Practice — play your book moves. The opponent answers automatically, picking a random branch when there are several replies."}
          </p>
        </section>

        <aside className="w-full shrink-0 lg:w-[360px] xl:w-[400px]">
          <TrainerHud />
        </aside>
      </div>
    </StockfishProvider>
  );
}
