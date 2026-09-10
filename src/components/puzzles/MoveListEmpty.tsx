interface MoveListEmptyProps {
    message?: string;
  }
  
  export function MoveListEmpty({ 
    message = "Moves will appear here." 
  }: MoveListEmptyProps) {
    return (
      <div className="flex min-h-[10rem] flex-1 flex-col rounded-xl border border-border-subtle bg-bg-surface p-4 shadow-panel">
        <h2 className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
          Move list
        </h2>
        <div className="mt-2 flex-1">
          <span className="italic text-text-muted">
            {message}
          </span>
        </div>
      </div>
    );
  }