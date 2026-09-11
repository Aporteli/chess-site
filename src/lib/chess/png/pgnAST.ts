import { tokenize, type Token } from './pgn-lexer';

export interface ParsedMove {
  san: string;
  nags: number[];
  comment: string;
  variations: ParsedMove[][];
}

export interface ParsedGame {
  headers: Record<string, string>;
  moves: ParsedMove[];
}

function parseSequence(tokens: Token[], start: number): { moves: ParsedMove[]; next: number } {
  const moves: ParsedMove[] = [];
  let i = start;
  const last = () => moves[moves.length - 1];

  while (i < tokens.length) {
    const tok = tokens[i]!;
    if (tok.kind === 'rparen' || tok.kind === 'result' || tok.kind === 'header') break;

    if (tok.kind === 'lparen') {
      const inner = parseSequence(tokens, i + 1);
      if (last()) last()!.variations.push(inner.moves);
      i = inner.next;
      if (tokens[i]?.kind === 'rparen') i += 1;
      continue;
    }

    if (tok.kind === 'move') {
      moves.push({ san: tok.san, nags: [], comment: '', variations: [] });
      i += 1;
      continue;
    }

    if (tok.kind === 'nag' && last()) {
      last()!.nags.push(tok.code);
      i += 1;
      continue;
    }

    if (tok.kind === 'comment') {
      if (last()) {
        last()!.comment = last()!.comment ? `${last()!.comment} ${tok.text}` : tok.text;
      }
      i += 1;
      continue;
    }

    i += 1;
  }

  return { moves, next: i };
}

export function parsePgn(pgn: string): ParsedGame[] {
  const tokens = tokenize(pgn);
  const games: ParsedGame[] = [];
  let i = 0;

  while (i < tokens.length) {
    const headers: Record<string, string> = {};
    while (tokens[i]?.kind === 'header') {
      const h = tokens[i] as Extract<Token, { kind: 'header' }>;
      headers[h.key] = h.value;
      i += 1;
    }
    const { moves, next } = parseSequence(tokens, i);
    i = next;
    if (tokens[i]?.kind === 'result') i += 1;
    if (Object.keys(headers).length || moves.length) {
      games.push({ headers, moves });
    }
    while (i < tokens.length && tokens[i]?.kind !== 'header' && tokens[i]?.kind !== 'move') {
      i += 1;
    }
  }

  return games;
}
