"use client";

import { childNodes, formatNags, lookupMaster, masteryPct, type TreeNode } from "@/lib/chess";
import { useTrainer } from "@/lib/trainer/context";

function WinPip({ fen, san }: { fen: string; san: string }) {
  const stat = lookupMaster(fen)?.moves.find((m) => m.san === san);
  if (!stat) return null;
  return (
    <span
      title={`W: ${stat.whiteWinPct}% | D: ${stat.drawPct}% | B: ${stat.blackWinPct}%`}
      className="inline-flex h-1.5 w-8 shrink-0 overflow-hidden rounded-full bg-bg-deepest"
    >
      <span className="bg-accent-gold" style={{ width: `${stat.whiteWinPct}%` }} />
      <span className="bg-text-muted" style={{ width: `${stat.drawPct}%` }} />
      <span className="bg-accent-garnet" style={{ width: `${stat.blackWinPct}%` }} />
    </span>
  );
}

function MoveButton({
  node,
  parentFen,
  isActive,
  onJump,
}: {
  node: TreeNode;
  parentFen: string;
  isActive: boolean;
  onJump: (id: string) => void;
}) {
  const pct = masteryPct(node.srs);
  const dotColor =
    node.srs.attempts === 0
      ? "bg-border-strong"
      : pct > 0.75
        ? "bg-accent-gold"
        : pct > 0.4
          ? "bg-accent-teal"
          : "bg-accent-garnet";

  return (
    <button
      onClick={() => onJump(node.id)}
      className={[
        "inline-flex items-center gap-1.5 rounded px-2 py-0.5 font-mono text-[13px] transition-all",
        isActive
          ? "bg-accent-teal text-bg-deepest font-bold shadow-sm"
          : "text-text-primary hover:bg-bg-elevated hover:text-accent-teal-bright",
      ].join(" ")}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      <span>{node.move?.san}</span>
      {formatNags(node.nags) && (
        <span className="text-accent-gold font-sans text-xs">{formatNags(node.nags)}</span>
      )}
      <WinPip fen={parentFen} san={node.move?.san ?? ""} />
    </button>
  );
}

export function MoveTree() {
  const t = useTrainer();

  // 1. ვიღებთ წარსულ გზას (root-იდან მიმდინარე კვანძამდე)
  const fullLineIds: string[] = [...t.path];

  // 2. მიმდინარე კვანძიდან წინ მივყვებით ხეს ბოლომდე (Mainline-ით), რომ მთლიანი ისტორია გამოჩნდეს
  let cursor = t.chapter.nodes[fullLineIds[fullLineIds.length - 1] ?? t.chapter.rootId];
  while (cursor && cursor.children.length > 0) {
    const kids = childNodes(t.chapter, cursor.id);
    const nextChild = kids.find((k) => k.isMainline) ?? kids[0];
    if (!nextChild) break;
    fullLineIds.push(nextChild.id);
    cursor = nextChild;
  }

  // გადავყავართ რეალურ ობიექტებში
  const fullLineNodes = fullLineIds
    .map((id) => t.chapter.nodes[id])
    .filter((n): n is TreeNode => Boolean(n && n.move));

  // ვაჯგუფებთ სვლების ნომრებად (1. e4 e5, 2. Nf3 Nc6...)
  const turns: {
    turnNumber: number;
    white?: TreeNode;
    whiteParentFen?: string;
    whiteSiblings?: TreeNode[];
    black?: TreeNode;
    blackParentFen?: string;
    blackSiblings?: TreeNode[];
  }[] = [];

  for (const n of fullLineNodes) {
    const turnNumber = Math.ceil(n.ply / 2);
    const parent = t.chapter.nodes[n.parentId!];
    const siblings = parent ? childNodes(t.chapter, parent.id).filter((s) => s.id !== n.id) : [];

    let row = turns.find((r) => r.turnNumber === turnNumber);
    if (!row) {
      row = { turnNumber };
      turns.push(row);
    }

    if (n.ply % 2 === 1) {
      row.white = n;
      row.whiteParentFen = parent?.fen;
      row.whiteSiblings = siblings;
    } else {
      row.black = n;
      row.blackParentFen = parent?.fen;
      row.blackSiblings = siblings;
    }
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-border-subtle bg-bg-surface p-3 font-sans">
      <div className="mb-2.5 flex items-baseline justify-between border-b border-border-subtle pb-2">
        <h3 className="font-serif-display text-[15px] font-semibold text-text-primary">
          Repertoire Line
        </h3>
        <span className="font-mono text-[11px] text-text-muted">
          {Object.keys(t.chapter.nodes).length - 1} moves in tree
        </span>
      </div>

      <div className="max-h-[380px] overflow-y-auto space-y-2 pr-1 thin-scrollbar">
        {turns.length === 0 && (
          <p className="py-4 text-center text-xs text-text-muted">No moves yet. Make a move on the board.</p>
        )}

        {turns.map((row) => (
          <div key={row.turnNumber} className="rounded-lg bg-bg-elevated/40 p-1.5 border border-border-subtle/50">
            {/* ძირითადი ხაზის სვლები */}
            <div className="flex items-center gap-2">
              <span className="w-6 text-right font-mono text-xs font-semibold text-accent-gold/80">
                {row.turnNumber}.
              </span>

              {row.white && (
                <MoveButton
                  node={row.white}
                  parentFen={row.whiteParentFen ?? ""}
                  isActive={t.node.id === row.white.id}
                  onJump={t.goToNode}
                />
              )}

              {row.black && (
                <MoveButton
                  node={row.black}
                  parentFen={row.blackParentFen ?? ""}
                  isActive={t.node.id === row.black.id}
                  onJump={t.goToNode}
                />
              )}
            </div>

            {/* თეთრების ალტერნატივები */}
            {row.whiteSiblings && row.whiteSiblings.length > 0 && (
              <div className="mt-1 ml-8 flex flex-wrap items-center gap-1.5 border-t border-border-subtle/30 pt-1">
                <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                  or White:
                </span>
                {row.whiteSiblings.map((alt) => (
                  <button
                    key={alt.id}
                    onClick={() => t.goToNode(alt.id)}
                    className="rounded bg-bg-surface px-1.5 py-0.5 font-mono text-xs text-text-secondary hover:text-accent-teal hover:border-accent-teal/50 border border-border-subtle transition-colors"
                  >
                    {alt.move?.san}
                  </button>
                ))}
              </div>
            )}

            {/* შავების ალტერნატივები */}
            {row.blackSiblings && row.blackSiblings.length > 0 && (
              <div className="mt-1 ml-8 flex flex-wrap items-center gap-1.5 border-t border-border-subtle/30 pt-1">
                <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                  or Black:
                </span>
                {row.blackSiblings.map((alt) => (
                  <button
                    key={alt.id}
                    onClick={() => t.goToNode(alt.id)}
                    className="rounded bg-bg-surface px-1.5 py-0.5 font-mono text-xs text-text-secondary hover:text-accent-teal hover:border-accent-teal/50 border border-border-subtle transition-colors"
                  >
                    {alt.move?.san}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}