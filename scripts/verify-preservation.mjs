import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';

const phase = process.argv[2];
if (!['before', 'after'].includes(phase)) throw new Error('Use before or after');
const response = await fetch('https://santensor.com/', {signal: AbortSignal.timeout(20000)});
if (!response.ok) throw new Error(`Production HTTP ${response.status}`);
const result = {
 checkedAt: new Date().toISOString(), phase,
 production: {url: response.url, status: response.status, sha256: createHash('sha256').update(await response.text()).digest('hex')},
 main: execFileSync('git', ['ls-remote', 'origin', 'refs/heads/main'], {encoding: 'utf8'}).trim().split(/\s/)[0],
 cname: (await readFile('CNAME', 'utf8')).trim()
};
if (phase === 'after') {
 const before = JSON.parse(await readFile('evidence/v2.1/preservation-before.json', 'utf8'));
 if (before.production.sha256 !== result.production.sha256 || before.main !== result.main || before.cname !== result.cname) throw new Error('Production changed; investigate before claiming preservation');
 result.unchanged = true;
}
await mkdir('evidence/v2.1', {recursive: true});
await writeFile(`evidence/v2.1/preservation-${phase}.json`, JSON.stringify(result, null, 2));
console.log(JSON.stringify(result));
