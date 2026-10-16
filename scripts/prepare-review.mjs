import {readdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import './build.mjs';

async function markReview(directory) {
 for (const entry of await readdir(directory, {withFileTypes: true})) {
  const filename = path.join(directory, entry.name);
  if (entry.isDirectory()) await markReview(filename);
  else if (entry.name.endsWith('.html')) {
   const html = await readFile(filename, 'utf8');
   await writeFile(filename, html.replace('<head>', '<head><meta name="robots" content="noindex,nofollow">'));
  }
 }
}

await markReview('dist');
await writeFile('dist/robots.txt', 'User-agent: *\nDisallow: /\n');
await writeFile('dist/version.json', JSON.stringify({sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], {encoding: 'utf8'}).trim(), branch: 'feat/santensor-v2-experience-i18n', purpose: 'V2.1 visual review', mode: 'local deterministic simulation'}, null, 2));
console.log('Isolated static review prepared. No trainer, Railway, DNS or Pages writes.');
