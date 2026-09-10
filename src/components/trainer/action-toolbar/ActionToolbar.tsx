"use client";

import { useTrainer } from "@/lib/trainer/context";
import { ToolbarButtons } from "./ToolbarButtons";
import { ToolbarNavigation } from "./ToolbarNavigation";

export function ActionToolbar() {
  const t = useTrainer();
  const drilling = t.mode === "drill";
  const inLine = drilling && t.drill && !t.drill.lineComplete;

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface p-3">
      <ToolbarButtons
        inLine={inLine}
        onRequestHint={t.requestHint}
        onRevealSolution={t.revealSolution}
        onStartPractice={() => t.startPractice()}
      />

      <ToolbarNavigation
        onGoStart={t.goStart}
        onGoBack={t.goBack}
        onGoForward={t.goForward}
        onGoEnd={t.goEnd}
      />
    </div>
  );
}