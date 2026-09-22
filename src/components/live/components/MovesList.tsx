interface MovesListProps {
    moves: string[];
    moveIndex: number;
    onMoveClick: (index: number) => void;
  }
  
  export function MovesList({ moves, moveIndex, onMoveClick }: MovesListProps) {
    return (
      <div className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-lg border border-[#383838] bg-[#2A2A2A] shadow-lg">
        <div className="shrink-0 border-b border-[#383838] bg-[#1E1E1E] px-2.5 py-1.5">
          <h2 className="text-[10px] font-semibold uppercase tracking-wider text-[#A0A0A0]">Moves</h2>
        </div>
  
        <div className="thin-scrollbar min-h-0 flex-1 overflow-y-auto">
          {moves.length === 0 ? (
            <div className="p-3 text-center text-xs italic text-[#A0A0A0]">No moves yet</div>
          ) : (
            Array.from({
              length: Math.ceil(moves.length / 2),
            }).map((_, rowIndex) => {
              const whiteIndex = rowIndex * 2;
              const blackIndex = whiteIndex + 1;
  
              const whiteMove = moves[whiteIndex];
              const blackMove = moves[blackIndex];
  
              const whiteCurrent = whiteIndex === moveIndex;
              const blackCurrent = blackIndex === moveIndex;
  
              return (
                <div
                  key={rowIndex}
                  className="grid grid-cols-[24px_1fr_1fr] items-stretch border-b border-[#383838]/40 last:border-b-0">
                  <span className="flex items-center justify-end pr-1 text-[10px] tabular-nums text-[#A0A0A0]">
                    {rowIndex + 1}.
                  </span>
  
                  <button
                    type="button"
                    onClick={() => onMoveClick(whiteIndex)}
                    className={`px-1.5 py-0.5 text-left text-xs transition-colors ${
                      whiteCurrent
                        ? 'bg-[#4A7C59] font-semibold text-white'
                        : 'text-[#A0A0A0] hover:bg-[#383838] hover:text-white'
                    }`}>
                    {whiteMove}
                  </button>
  
                  {blackMove ? (
                    <button
                      type="button"
                      onClick={() => onMoveClick(blackIndex)}
                      className={`px-1.5 py-0.5 text-left text-xs transition-colors ${
                        blackCurrent
                          ? 'bg-[#4A7C59] font-semibold text-white'
                          : 'text-[#A0A0A0] hover:bg-[#383838] hover:text-white'
                      }`}>
                      {blackMove}
                    </button>
                  ) : (
                    <span />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }