interface ErrorStateProps {
    message: string;
  }
  
  export function ErrorState({ message }: ErrorStateProps) {
    return (
      <div className="mb-2 rounded-lg border border-[#E63946]/40 bg-[#E63946]/10 p-3 shadow-lg">
        <h2 className="text-[10px] font-semibold uppercase tracking-wider text-[#E63946]">
          Broadcast error
        </h2>
  
        <p className="mt-1.5 whitespace-pre-wrap break-words text-xs text-[#E63946]/90">{message}</p>
      </div>
    );
  }