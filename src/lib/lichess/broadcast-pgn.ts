export type BroadcastMove = {
    san: string;
    clock?: string;
  };
  
  export type BroadcastGame = {
    id: string;
    event: string;
    site: string;
    date: string;
    round: string;
    white: string;
    black: string;
    result: string;
    whiteElo?: string;
    blackElo?: string;
    whiteTeam?: string;
    blackTeam?: string;
    whiteFideId?: string;
    blackFideId?: string;
    gameUrl?: string;
    broadcastUrl?: string;
    moves: string[];
    clocks: Array<string | undefined>;
    pgn: string;
  };
  
  function parseTags(
    pgn: string
  ): Record<string, string> {
    const tags: Record<string, string> = {};
  
    for (const line of pgn.split('\n')) {
      const match = line.match(
        /^\[([A-Za-z0-9_]+)\s+"(.*)"\]$/
      );
  
      if (!match) {
        continue;
      }
  
      tags[match[1]] = match[2];
    }
  
    return tags;
  }
  
  function removeComments(text: string): string {
    let result = '';
    let depth = 0;
  
    for (const char of text) {
      if (char === '{') {
        depth += 1;
        continue;
      }
  
      if (char === '}') {
        if (depth > 0) {
          depth -= 1;
        }
  
        continue;
      }
  
      if (depth === 0) {
        result += char;
      }
    }
  
    return result;
  }
  
  function removeVariations(text: string): string {
    let result = '';
    let depth = 0;
  
    for (const char of text) {
      if (char === '(') {
        depth += 1;
        continue;
      }
  
      if (char === ')') {
        if (depth > 0) {
          depth -= 1;
        }
  
        continue;
      }
  
      if (depth === 0) {
        result += char;
      }
    }
  
    return result;
  }
  
  function isMoveNumber(token: string): boolean {
    return /^\d+\.(\.\.)?$/.test(token);
  }
  
  function isGameResult(token: string): boolean {
    return /^(1-0|0-1|1\/2-1\/2|\*)$/.test(
      token
    );
  }
  
  function cleanSan(token: string): string {
    return token
      .replace(/[!?]+$/g, '')
      .trim();
  }
  
  function isValidSan(token: string): boolean {
    if (!token) {
      return false;
    }
  
    if (isMoveNumber(token)) {
      return false;
    }
  
    if (isGameResult(token)) {
      return false;
    }
  
    if (token.startsWith('$')) {
      return false;
    }
  
    /*
     * Valid SAN examples:
     *
     * e4
     * Nf3
     * Bb5
     * Qxd5
     * O-O
     * O-O-O
     * exd5
     * e8=Q
     * Raxd1
     * Qh7+
     * Qh7#
     */
  
    return /^(?:[KQRBN]?[a-h]?[1-8]?x?[a-h][1-8](?:=[QRBN])?[+#]?|O-O(?:-O)?[+#]?)$/.test(
      token
    );
  }
  
  function extractMovesAndClocks(
    pgn: string
  ): BroadcastMove[] {
    /*
     * First extract clocks from the original PGN.
     *
     * Example:
     *
     * e4 { [%clk 1:29:58] }
     *
     * becomes:
     *
     * e4 + 1:29:58
     */
  
    const clockMatches = [
      ...pgn.matchAll(
        /\[%clk\s+([0-9]+:[0-9]{2}:[0-9]{2})\]/g
      ),
    ];
  
    const clocks = clockMatches.map(
      (match) => match[1]
    );
  
    /*
     * Remove comments and variations before
     * extracting actual chess moves.
     */
  
    let moveText = pgn;
  
    moveText = removeComments(moveText);
    moveText = removeVariations(moveText);
  
    /*
     * Remove PGN tags.
     */
  
    moveText = moveText.replace(
      /^\[[^\n]*\]\s*$/gm,
      ''
    );
  
    /*
     * Remove NAG annotations such as $1.
     */
  
    moveText = moveText.replace(
      /\$\d+/g,
      ' '
    );
  
    /*
     * Tokenize remaining movetext.
     */
  
    const tokens = moveText
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(Boolean);
  
    const result: BroadcastMove[] = [];
  
    let clockIndex = 0;
  
    for (const rawToken of tokens) {
      if (isMoveNumber(rawToken)) {
        continue;
      }
  
      if (isGameResult(rawToken)) {
        continue;
      }
  
      const token = cleanSan(rawToken);
  
      if (!isValidSan(token)) {
        continue;
      }
  
      result.push({
        san: token,
        clock: clocks[clockIndex],
      });
  
      clockIndex += 1;
    }
  
    return result;
  }
  
  export function parseBroadcastPgn(
    pgn: string
  ): BroadcastGame[] {
    const normalized = pgn
      .replace(/\r\n/g, '\n')
      .trim();
  
    if (!normalized) {
      return [];
    }
  
    const gameBlocks = normalized
      .split(/\n(?=\[Event\s+")/)
      .map((block) => block.trim())
      .filter(Boolean);
  
    return gameBlocks.map((gamePgn, index) => {
      const tags = parseTags(gamePgn);
  
      const parsedMoves =
        extractMovesAndClocks(gamePgn);
  
      const gameUrl = tags.GameURL;
  
      const gameId =
        gameUrl
          ?.split('/')
          .filter(Boolean)
          .pop() ??
        `broadcast-game-${index + 1}`;
  
      return {
        id: gameId,
  
        event: tags.Event ?? '',
  
        site: tags.Site ?? '',
  
        date: tags.Date ?? '',
  
        round: tags.Round ?? '',
  
        white: tags.White ?? '',
  
        black: tags.Black ?? '',
  
        result: tags.Result ?? '*',
  
        whiteElo: tags.WhiteElo,
  
        blackElo: tags.BlackElo,
  
        whiteTeam: tags.WhiteTeam,
  
        blackTeam: tags.BlackTeam,
  
        whiteFideId: tags.WhiteFideId,
  
        blackFideId: tags.BlackFideId,
  
        gameUrl,
  
        broadcastUrl: tags.BroadcastURL,
  
        moves: parsedMoves.map(
          (move) => move.san
        ),
  
        clocks: parsedMoves.map(
          (move) => move.clock
        ),
  
        pgn: gamePgn,
      };
    });
  }