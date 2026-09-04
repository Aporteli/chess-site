import { uid } from "./ids";
import { newSrsCard, reviewCard } from "./srs";
import { addSanMove, emptyChapter } from "./tree";
import type { Chapter, OpeningStore, Repertoire } from "./types";
import type { EvalLabel } from "./nags";

interface LineMove {
  san: string;
  nags?: number[];
  comment?: string;
  annotation?: string;
  eval?: EvalLabel;
  weight?: number;
  /** Offset due date in days (negative = overdue). */
  dueDays?: number;
  grade?: "again" | "hard" | "good" | "easy";
  children?: LineMove[];
}

function applyLine(chapter: Chapter, parentId: string, moves: LineMove[]): Chapter {
  let current = chapter;
  for (const move of moves) {
    const added = addSanMove(current, parentId, move.san, {
      nags: move.nags,
      comment: move.comment,
      annotation: move.annotation,
      eval: move.eval,
      weight: move.weight,
    });
    current = added.chapter;
    if (move.dueDays !== undefined || move.grade) {
      let srs = newSrsCard(Date.now());
      if (move.grade) srs = reviewCard(srs, move.grade);
      if (move.dueDays !== undefined) {
        srs = { ...srs, dueAt: Date.now() + move.dueDays * 86_400_000 };
      }
      current = {
        ...current,
        nodes: { ...current.nodes, [added.node.id]: { ...current.nodes[added.node.id]!, srs } },
      };
    }
    if (move.children?.length) {
      current = applyLine(current, added.node.id, move.children);
    }
  }
  return current;
}

function chapterFromLines(
  name: string,
  eco: string,
  variation: string,
  lines: LineMove[],
  rootComment = "",
): Chapter {
  let ch = emptyChapter(name, { eco, variation });
  if (rootComment) {
    ch = {
      ...ch,
      nodes: {
        ...ch.nodes,
        [ch.rootId]: { ...ch.nodes[ch.rootId]!, comment: rootComment },
      },
    };
  }
  return applyLine(ch, ch.rootId, lines);
}

const italianMain: LineMove[] = [
  {
    san: "e4",
    nags: [1],
    comment: "The Open Game. We claim the center and free the bishop and queen.",
    annotation: "Always the first move of this White repertoire.",
    weight: 45,
    grade: "easy",
    dueDays: 4,
    children: [
      {
        san: "e5",
        comment: "Classical reply. Black mirrors and prepares ...Nc6 / ...Nf6.",
        weight: 26,
        children: [
          {
            san: "Nf3",
            nags: [1],
            comment: "Develop and attack e5. Almost automatic.",
            grade: "good",
            dueDays: 3,
            children: [
              {
                san: "Nc6",
                weight: 72,
                children: [
                  {
                    san: "Bc4",
                    nags: [1],
                    comment:
                      "The Italian Game. Eyes f7, develops the bishop before committing the d-pawn.",
                    annotation: "Main repertoire move. Bb5 (Ruy) is the sister chapter.",
                    grade: "hard",
                    dueDays: -1,
                    children: [
                      {
                        san: "Bc5",
                        comment: "Giuoco Piano — the quiet game. Black develops symmetrically.",
                        weight: 47,
                        children: [
                          {
                            san: "c3",
                            nags: [1],
                            comment:
                              "The classical try: prepare d4, build a broad center, and keep the queen's knight flexible.",
                            annotation:
                              "This is the tabiya. After 4...Nf6 5.d4 is the critical test.",
                            eval: "white-slight",
                            grade: "again",
                            dueDays: -2,
                            children: [
                              {
                                san: "Nf6",
                                nags: [1],
                                weight: 86,
                                children: [
                                  {
                                    san: "d4",
                                    nags: [1],
                                    comment: "Strike while Black has not yet castled. The center opens.",
                                    grade: "good",
                                    dueDays: -1,
                                    children: [
                                      {
                                        san: "exd4",
                                        children: [
                                          {
                                            san: "cxd4",
                                            children: [
                                              {
                                                san: "Bb4+",
                                                nags: [5],
                                                comment: "The Greco check. Black tries to disrupt.",
                                                children: [
                                                  {
                                                    san: "Bd2",
                                                    nags: [1],
                                                    comment:
                                                      "Simplest. 7.Nc3 Nxe4 is playable but messier for a working repertoire.",
                                                    grade: "easy",
                                                    dueDays: 6,
                                                    children: [
                                                      {
                                                        san: "Bxd2+",
                                                        children: [
                                                          {
                                                            san: "Nbxd2",
                                                            children: [
                                                              {
                                                                san: "d5",
                                                                comment: "Black challenges the center immediately.",
                                                                children: [
                                                                  {
                                                                    san: "exd5",
                                                                    nags: [1],
                                                                    comment:
                                                                      "Keep a healthy IQP structure. 8...Nxd5 9.Qb3 is the typical follow-up.",
                                                                    eval: "white-slight",
                                                                    grade: "hard",
                                                                    dueDays: 0,
                                                                    children: [
                                                                      {
                                                                        san: "Nxd5",
                                                                        children: [
                                                                          {
                                                                            san: "Qb3",
                                                                            nags: [1],
                                                                            comment:
                                                                              "Double attack on d5 and b7. The classical Italian squeeze.",
                                                                            annotation:
                                                                              "If 9...Na5 10.Qa4+ Nc6 11.Qb3 repeats or you play for more with 11.O-O.",
                                                                            grade: "again",
                                                                            dueDays: -3,
                                                                          },
                                                                        ],
                                                                      },
                                                                    ],
                                                                  },
                                                                ],
                                                              },
                                                            ],
                                                          },
                                                        ],
                                                      },
                                                    ],
                                                  },
                                                ],
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                ],
                              },
                              {
                                san: "d6",
                                nags: [6],
                                comment: "Passive. Black concedes the center fight.",
                                eval: "white-slight",
                                weight: 8,
                                children: [
                                  {
                                    san: "d4",
                                    nags: [1],
                                    comment: "Take the center for free. Do not play the slow d3 here.",
                                    grade: "good",
                                    dueDays: 1,
                                  },
                                ],
                              },
                            ],
                          },
                          {
                            san: "d3",
                            nags: [5],
                            comment: "Giuoco Pianissimo. A modern, maneuvering alternative to 4.c3.",
                            annotation: "Use this when you want a quieter day's work.",
                            weight: 32,
                            children: [
                              {
                                san: "Nf6",
                                children: [
                                  {
                                    san: "O-O",
                                    children: [
                                      {
                                        san: "d6",
                                        children: [
                                          {
                                            san: "c3",
                                            nags: [1],
                                            comment:
                                              "The typical Pianissimo setup: c3, Re1, Nbd2, a4. Don't rush d4.",
                                            grade: "good",
                                            dueDays: 2,
                                            children: [
                                              {
                                                san: "a6",
                                                children: [
                                                  {
                                                    san: "a4",
                                                    comment: "Clamp ...b5 and make a4-a5 a later hook.",
                                                  },
                                                ],
                                              },
                                              {
                                                san: "O-O",
                                                children: [
                                                  {
                                                    san: "Re1",
                                                    nags: [1],
                                                    comment: "Prepare Nbd2–f1–g3. The slow Italian plan.",
                                                    grade: "hard",
                                                    dueDays: -1,
                                                  },
                                                ],
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                          {
                            san: "b4",
                            nags: [5],
                            comment: "Evans Gambit. A weapon, not the daily driver — keep it sharp.",
                            annotation: "Train this as a surprise chapter, not the main SRS diet.",
                            weight: 7,
                            children: [
                              {
                                san: "Bxb4",
                                children: [
                                  {
                                    san: "c3",
                                    children: [
                                      {
                                        san: "Ba5",
                                        children: [
                                          {
                                            san: "d4",
                                            nags: [1],
                                            comment: "The point. Open the center while Black's king is still in the middle.",
                                            eval: "compensation",
                                            grade: "good",
                                            dueDays: 5,
                                          },
                                        ],
                                      },
                                      {
                                        san: "Bc5",
                                        nags: [6],
                                        children: [
                                          {
                                            san: "d4",
                                            nags: [1],
                                            comment: "Same idea — take the center with tempo.",
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                      {
                        san: "Nf6",
                        comment: "Two Knights Defence. Sharper — Black invites Ng5.",
                        weight: 36,
                        children: [
                          {
                            san: "d3",
                            nags: [1],
                            comment:
                              "The modern main line. We decline the Fried Liver complications unless we have studied them.",
                            annotation: "Quiet Italian vs Two Knights. Ng5 is the dedicated sideline.",
                            grade: "easy",
                            dueDays: 3,
                            children: [
                              {
                                san: "Be7",
                                children: [
                                  {
                                    san: "O-O",
                                    children: [
                                      {
                                        san: "O-O",
                                        children: [
                                          {
                                            san: "Re1",
                                            nags: [1],
                                            comment: "d3 / c3 / Nbd2 / Nf1 is the standard regroup.",
                                            grade: "good",
                                            dueDays: 0,
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                ],
                              },
                              {
                                san: "Bc5",
                                comment: "Transposes toward Giuoco Pianissimo structures.",
                                children: [
                                  {
                                    san: "O-O",
                                    comment: "Transposition into the 4.d3 Italian.",
                                  },
                                ],
                              },
                            ],
                          },
                          {
                            san: "Ng5",
                            nags: [5],
                            comment: "The old attacking try. Tactically rich — only play it prepared.",
                            weight: 35,
                            children: [
                              {
                                san: "d5",
                                nags: [1],
                                children: [
                                  {
                                    san: "exd5",
                                    children: [
                                      {
                                        san: "Na5",
                                        nags: [1],
                                        comment: "The main antidote. 5...Nxd5 6.Nxf7 is the Fried Liver.",
                                        children: [
                                          {
                                            san: "Bb5+",
                                            nags: [1],
                                            comment: "Keep the piece. 6.d3 is also playable.",
                                            grade: "hard",
                                            dueDays: -2,
                                            children: [
                                              {
                                                san: "c6",
                                                children: [
                                                  {
                                                    san: "dxc6",
                                                    children: [
                                                      {
                                                        san: "bxc6",
                                                        children: [
                                                          {
                                                            san: "Be2",
                                                            nags: [1],
                                                            comment:
                                                              "The modern retreat. h4 ideas remain, the bishop is safe.",
                                                            eval: "unclear",
                                                            grade: "again",
                                                            dueDays: -4,
                                                          },
                                                        ],
                                                      },
                                                    ],
                                                  },
                                                ],
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                      {
                                        san: "Nxd5",
                                        nags: [2],
                                        comment: "Invites the Fried Liver. We accept.",
                                        weight: 12,
                                        children: [
                                          {
                                            san: "Nxf7",
                                            nags: [3],
                                            comment:
                                              "Fried Liver. 6...Kxf7 7.Qf3+ Ke6 8.Nc3 is the theoretical minefield.",
                                            annotation: "Drill this until the king hunt is automatic.",
                                            eval: "white-clear",
                                            grade: "again",
                                            dueDays: -5,
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                      {
                        san: "Be7",
                        nags: [6],
                        comment: "Hungarian Defence. Solid, slightly passive.",
                        weight: 6,
                        children: [
                          {
                            san: "d4",
                            nags: [1],
                            comment: "Open the position. Black's bishop is not well placed for a closed game.",
                            grade: "good",
                            dueDays: 2,
                            children: [
                              {
                                san: "exd4",
                                children: [
                                  {
                                    san: "Nxd4",
                                    eval: "white-slight",
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                san: "Nf6",
                comment: "Petrov. Out of this Italian chapter — see a dedicated file later.",
                nags: [10],
                weight: 21,
                children: [
                  {
                    san: "Nxe5",
                    nags: [1],
                    comment: "The main line Petrov. We take on e5 and meet ...d6 with Nf3.",
                    grade: "good",
                    dueDays: 7,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        san: "c5",
        comment: "Sicilian. This White file does not cover it — switch to a dedicated Anti-Sicilian chapter.",
        nags: [10],
        weight: 33,
        children: [
          {
            san: "Nf3",
            comment: "Keep the option of an Open Sicilian or Bb5 systems.",
          },
        ],
      },
    ],
  },
];

const najdorf: LineMove[] = [
  {
    san: "e4",
    children: [
      {
        san: "c5",
        nags: [1],
        comment: "The Sicilian. We fight for the initiative from move one.",
        annotation: "Black repertoire starts here.",
        grade: "easy",
        dueDays: 2,
        children: [
          {
            san: "Nf3",
            weight: 78,
            children: [
              {
                san: "d6",
                nags: [1],
                comment: "Najdorf move-order. Avoids some Rossolimo lines vs ...Nc6.",
                grade: "good",
                dueDays: 1,
                children: [
                  {
                    san: "d4",
                    children: [
                      {
                        san: "cxd4",
                        children: [
                          {
                            san: "Nxd4",
                            children: [
                              {
                                san: "Nf6",
                                children: [
                                  {
                                    san: "Nc3",
                                    children: [
                                      {
                                        san: "a6",
                                        nags: [1],
                                        comment:
                                          "The Najdorf. Control b5, prepare ...e5 or ...e6, and keep every pawn break.",
                                        annotation: "Tabiya. Every White 6th move is its own chapter of homework.",
                                        grade: "hard",
                                        dueDays: -1,
                                        children: [
                                          {
                                            san: "Be3",
                                            comment: "English Attack. The most common modern try.",
                                            weight: 28,
                                            children: [
                                              {
                                                san: "e5",
                                                nags: [1],
                                                comment: "The Najdorf ...e5 complex. Occupy d4's retreat and seize space.",
                                                grade: "again",
                                                dueDays: -2,
                                                children: [
                                                  {
                                                    san: "Nb3",
                                                    children: [
                                                      {
                                                        san: "Be6",
                                                        nags: [1],
                                                        comment: "Develop and eye c4. ...Be7 / ...O-O / ...Nbd7 next.",
                                                        grade: "good",
                                                        dueDays: 0,
                                                        children: [
                                                          {
                                                            san: "f3",
                                                            children: [
                                                              {
                                                                san: "Be7",
                                                                children: [
                                                                  {
                                                                    san: "Qd2",
                                                                    children: [
                                                                      {
                                                                        san: "O-O",
                                                                        nags: [1],
                                                                        comment:
                                                                          "Castled. Meet O-O-O with ...Nbd7 / ...b5 / ...Qc7 and the typical pawn storm race.",
                                                                        eval: "unclear",
                                                                        grade: "hard",
                                                                        dueDays: -1,
                                                                      },
                                                                    ],
                                                                  },
                                                                ],
                                                              },
                                                            ],
                                                          },
                                                        ],
                                                      },
                                                    ],
                                                  },
                                                ],
                                              },
                                            ],
                                          },
                                          {
                                            san: "Bg5",
                                            comment: "The classical Najdorf. Poisoned Pawn and Browne systems live here.",
                                            weight: 22,
                                            children: [
                                              {
                                                san: "e6",
                                                nags: [1],
                                                comment: "Flexible. We can still choose Poisoned Pawn or ...Be7.",
                                                grade: "good",
                                                dueDays: -3,
                                                children: [
                                                  {
                                                    san: "f4",
                                                    children: [
                                                      {
                                                        san: "Qb6",
                                                        nags: [5],
                                                        comment: "Poisoned Pawn. Theoretical, but this is a GM-level repertoire.",
                                                        annotation:
                                                          "7...Be7 is the safer alternative if you have not memorized the PP tree.",
                                                        grade: "again",
                                                        dueDays: -6,
                                                        children: [
                                                          {
                                                            san: "Qd2",
                                                            children: [
                                                              {
                                                                san: "Qxb2",
                                                                nags: [1],
                                                                comment: "Take the pawn. The next ten moves are forced homework.",
                                                                eval: "unclear",
                                                              },
                                                            ],
                                                          },
                                                        ],
                                                      },
                                                      {
                                                        san: "Be7",
                                                        comment: "Solid classical. Less theory than the PP.",
                                                        weight: 40,
                                                        children: [
                                                          {
                                                            san: "Qf3",
                                                            children: [
                                                              {
                                                                san: "Qc7",
                                                                nags: [1],
                                                                grade: "good",
                                                                dueDays: 4,
                                                              },
                                                            ],
                                                          },
                                                        ],
                                                      },
                                                    ],
                                                  },
                                                ],
                                              },
                                            ],
                                          },
                                          {
                                            san: "Be2",
                                            comment: "Opocensky. Positional, less theory.",
                                            weight: 15,
                                            children: [
                                              {
                                                san: "e5",
                                                nags: [1],
                                                children: [
                                                  {
                                                    san: "Nb3",
                                                    children: [
                                                      {
                                                        san: "Be7",
                                                        children: [
                                                          {
                                                            san: "O-O",
                                                            children: [
                                                              {
                                                                san: "O-O",
                                                                nags: [1],
                                                                comment:
                                                                  "Equalish, but we have the typical Najdorf hooks: ...Be6, ...Nbd7, ...a5.",
                                                                eval: "equal",
                                                                grade: "easy",
                                                                dueDays: 5,
                                                              },
                                                            ],
                                                          },
                                                        ],
                                                      },
                                                    ],
                                                  },
                                                ],
                                              },
                                            ],
                                          },
                                          {
                                            san: "Bc4",
                                            comment: "Fischer-Sozin. Meet it with ...e6 and ...b5.",
                                            weight: 10,
                                            children: [
                                              {
                                                san: "e6",
                                                nags: [1],
                                                grade: "good",
                                                dueDays: 1,
                                                children: [
                                                  {
                                                    san: "Bb3",
                                                    children: [
                                                      {
                                                        san: "b5",
                                                        nags: [1],
                                                        comment: "The typical expansion. ...Nbd7 and ...Nc5 follow.",
                                                      },
                                                    ],
                                                  },
                                                ],
                                              },
                                            ],
                                          },
                                          {
                                            san: "h3",
                                            nags: [6],
                                            comment: "Adams Attack — rare at GM level. Treat it as a sideline.",
                                            weight: 3,
                                            children: [
                                              {
                                                san: "e5",
                                                nags: [1],
                                                comment: "Same structure as vs Be3. Don't overthink it.",
                                                grade: "good",
                                                dueDays: 8,
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            san: "Nc3",
            comment: "Closed Sicilian. We go ...Nc6 / ...g6 / ...Bg7.",
            weight: 9,
            children: [
              {
                san: "Nc6",
                nags: [1],
                grade: "good",
                dueDays: 3,
              },
            ],
          },
          {
            san: "c3",
            comment: "Alapin. Reliable answer is ...Nf6.",
            weight: 6,
            children: [
              {
                san: "Nf6",
                nags: [1],
                comment: "Hit e4 immediately. After e5 Nd5 we have a healthy Caro-like structure.",
                grade: "hard",
                dueDays: 0,
              },
            ],
          },
        ],
      },
    ],
  },
];

export function createSeedStore(): OpeningStore {
  const now = Date.now();
  const italian = chapterFromLines(
    "Italian Game",
    "C50",
    "Giuoco Piano & Two Knights",
    italianMain,
    "White working file: 1.e4 e5 2.Nf3 Nc6 3.Bc4. Main try 4.c3; 4.d3 and the Evans as weapons.",
  );
  italian.updatedAt = now;

  const najdorfChapter = chapterFromLines(
    "Sicilian Najdorf",
    "B90",
    "English Attack, Classical, Opocensky",
    najdorf,
    "Black working file against 1.e4. The Najdorf is the backbone; Alapin and Closed are covered as sidelines.",
  );

  const white: Repertoire = {
    id: uid("rep"),
    name: "White — Open Games",
    side: "white",
    description: "1.e4 working repertoire. Italian as the daily driver, with a sharp Evans and Two Knights file.",
    chapters: [italian],
    createdAt: now,
    updatedAt: now,
  };

  const black: Repertoire = {
    id: uid("rep"),
    name: "Black — Sicilian",
    side: "black",
    description: "Najdorf-based answer to 1.e4, with compact replies to the Alapin and Closed.",
    chapters: [najdorfChapter],
    createdAt: now,
    updatedAt: now,
  };

  return { version: 1, repertoires: [white, black] };
}
