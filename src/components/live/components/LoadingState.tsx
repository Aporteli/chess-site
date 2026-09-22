interface LoadingStateProps {
    message: string;
  }
  
  export function LoadingState({ message }: LoadingStateProps) {
    return (
      <div className="mb-2 rounded-lg border border-[#383838] bg-[#2A2A2A] p-3 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="size-3.5 animate-spin rounded-full border-2 border-[#383838] border-t-[#769656]" />
  
          <span className="text-xs text-[#A0A0A0]">{message}</span>
        </div>
      </div>
    );
  }