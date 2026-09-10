interface AnnotationEvalsProps {
    evalLabels: readonly any[];
    currentEval: string | null;
    onSelectEval: (evId: string) => void;
  }
  
  export function AnnotationEvals({ evalLabels, currentEval, onSelectEval }: AnnotationEvalsProps) {
    return (
      <div className="mb-2 flex flex-wrap gap-1">
        {evalLabels.map((ev) => (
          <button
            key={ev.id}
            title={ev.label}
            onClick={() => onSelectEval(ev.id)} // ev.id არის string
            className={[
              "rounded-md border px-1.5 py-0.5 font-mono text-[10.5px] transition-colors",
              currentEval === ev.id
                ? "border-accent-teal/40 bg-accent-teal-dim text-accent-teal-bright"
                : "border-border-default bg-bg-elevated text-text-muted hover:text-text-secondary",
            ].join(" ")}
          >
            {ev.glyph}
          </button>
        ))}
      </div>
    );
  }