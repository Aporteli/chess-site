import { MoveButton } from "./MoveButton";
import { SiblingRow } from "./SiblingRow";
import type { TurnRow } from "./types";

/**
 * One complete turn row: turn number, mainline white/black moves
 * and the alternative siblings for each side.
 */
export function TurnRowView({
  row,
  activeNodeId,
  onJump,
}: {
  row: TurnRow;
  activeNodeId: string;
  onJump: (id: string) => void;
}) {
  return (
    <div className="rounded-lg bg-bg-elevated/40 p-1.5 border border-border-subtle/50">
      {/* ძირითადი ხაზის სვლები */}
      <div className="flex items-center gap-2">
        <span className="w-6 text-right font-mono text-xs font-semibold text-accent-gold/80">
          {row.turnNumber}.
        </span>

        {row.white && (
          <MoveButton
            node={row.white}
            parentFen={row.whiteParentFen ?? ""}
            isActive={activeNodeId === row.white.id}
            onJump={onJump}
          />
        )}

        {row.black && (
          <MoveButton
            node={row.black}
            parentFen={row.blackParentFen ?? ""}
            isActive={activeNodeId === row.black.id}
            onJump={onJump}
          />
        )}
      </div>

      {/* თეთრების ალტერნატივები */}
      <SiblingRow label="or White" siblings={row.whiteSiblings ?? []} onJump={onJump} />

      {/* შავების ალტერნატივები */}
      <SiblingRow label="or Black" siblings={row.blackSiblings ?? []} onJump={onJump} />
    </div>
  );
}