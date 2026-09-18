import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';

const TOKEN = process.env.LICHESS_TOKEN;
const USERNAME = process.env.LICHESS_USERNAME;

// ✅ throw იმუშავებს TypeScript-ის type narrowing-თან
if (!TOKEN || !USERNAME) {
  console.error('❌ Missing LICHESS_TOKEN or LICHESS_USERNAME in .env.local');
  throw new Error('LICHESS_TOKEN and LICHESS_USERNAME are required');
}

// ამის შემდეგ TOKEN და USERNAME ორივე "string" ტიპისაა
// — ვეღარ იქნებიან undefined, TypeScript-მა იცის

const fetchGames = async () => {
  console.log(`📥 Fetching games for ${USERNAME}...`);

  const url =
    `https://lichess.org/api/games/user/${encodeURIComponent(USERNAME)}` +
    `?max=1000&opening=true&clocks=false&evals=false&pgnInJson=false`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/x-chess-pgn',
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Lichess returned ${res.status}: ${body.slice(0, 200)}`);
  }

  const pgn = await res.text();

  const dataDir = path.resolve('data');
  await fs.mkdir(dataDir, { recursive: true });

  const outFile = path.join(dataDir, 'lichess-games.pgn');
  await fs.writeFile(outFile, pgn, 'utf-8');

  const gameCount = (pgn.match(/\[Event /g) ?? []).length;

  console.log(
    `✅ Saved ${gameCount} games (${(pgn.length / 1024).toFixed(1)} KB) to ${outFile}`,
  );
};

fetchGames().catch((e) => {
  console.error('❌', e instanceof Error ? e.message : e);
  process.exit(1);
});