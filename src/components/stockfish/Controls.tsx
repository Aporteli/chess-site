"use client";

type ControlsProps = {
  isAnalyzing: boolean;
  onStart: () => void;
  onStop: () => void;
};

export default function Controls({ isAnalyzing, onStart, onStop }: ControlsProps) {
  return (
    <button
      type="button"
      onClick={isAnalyzing ? onStop : onStart}
      className={[
        "w-full rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors",
        isAnalyzing
          ? "border-accent-garnet bg-accent-garnet-dim text-accent-garnet-bright hover:border-accent-garnet-bright"
          : "border-accent-gold bg-accent-gold-dim text-accent-gold-bright hover:bg-accent-gold hover:text-bg-deepest",
      ].join(" ")}
    >
      {isAnalyzing ? "Stop engine" : "Start analysis"}
    </button>
  );
}
