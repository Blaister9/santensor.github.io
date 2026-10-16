import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const phase = process.argv[2];
if (!['before','after'].includes(phase)) throw new Error('Use before or after');
const production = await fetch('https://santensor.com/', {signal:AbortSignal.timeout(20000)});
if (!production.ok) throw new Error(`Production HTTP ${production.status}`);
const hash = createHash('sha256').update(await production.text()).digest('hex');
const result = {checkedAt:new Date().toISOString(),phase,production:{url:production.url,status:production.status,sha256:hash,cname:(await readFile('CNAME','utf8')).trim()}};
if (phase === 'after') {
 const before = JSON.parse(await readFile('evidence/v2/preservation-before.json','utf8'));
 result.production.unchanged = before.production.sha256 === hash;
 if (!result.production.unchanged) throw new Error('Published HTML changed during the iteration; investigate before claiming preservation');
 const base = process.env.SITE_TEST_URL;
 if (!base?.startsWith('https://')) throw new Error('SITE_TEST_URL must identify the HTTPS preview host');
 result.preview = [];
 for (const route of ['/commercial-preview/','/commercial-preview/es/','/commercial-preview/labs/','/commercial-preview/es/labs/','/commercial-preview/contact/','/commercial-preview/es/contact/','/api/health','/api/auth/status','/api/history']) {
  const response = await fetch(base + route, {signal:AbortSignal.timeout(20000)});
  const expected = route === '/api/history' ? 401 : 200;
  if (response.status !== expected) throw new Error(`${route}: HTTP ${response.status}`);
  result.preview.push({route,status:response.status,robots:response.headers.get('x-robots-tag')});
 }
}
await mkdir('evidence/v2',{recursive:true});
await writeFile(`evidence/v2/preservation-${phase}.json`,JSON.stringify(result,null,2));
console.log(JSON.stringify(result));
