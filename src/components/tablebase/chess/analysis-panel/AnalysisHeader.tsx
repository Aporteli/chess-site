"use client";

import { Button } from "@/components/tablebase/ui/button";

interface AnalysisHeaderProps {
  enabled: boolean;
  onToggleEngine: () => void;
}

export function AnalysisHeader({ enabled, onToggleEngine }: AnalysisHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2 flex-shrink-0">
      <h2 className="font-display text-base text-fg">Analysis</h2>
      <Button size="tiny" variant={enabled ? "primary" : "secondary"} onClick={onToggleEngine}>
        {enabled ? "Auto on" : "Auto off"}
      </Button>
    </div>
  );
}