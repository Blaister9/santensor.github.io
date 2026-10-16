import {execFileSync,spawn} from 'node:child_process';import {mkdir,readFile,writeFile} from 'node:fs/promises';import path from 'node:path';import {createHash} from 'node:crypto';import {setTimeout as delay} from 'node:timers/promises';
const baseline='22e06ba3aaaad1f54f99384a806f9925a3b35b21';const target=path.resolve('.local/rollback-baseline');
if(!target.startsWith(path.resolve('.')+path.sep))throw new Error('Snapshot must stay inside site workspace');
await mkdir(target,{recursive:true});execFileSync('git',['archive','--format=tar','-o','.local/rollback-baseline.tar',baseline]);execFileSync('tar',['-xf','.local/rollback-baseline.tar','-C',target]);
const expected=execFileSync('git',['show',`${baseline}:index.html`]);const actual=await readFile(path.join(target,'index.html'));
// Git for Windows applies core.autocrlf to archived files; compare canonical LF content.
const sha=b=>createHash('sha256').update(String(b).replaceAll('\r\n','\n')).digest('hex');if(sha(expected)!==sha(actual))throw new Error('Rollback source hash mismatch');
const server=spawn(process.execPath,['scripts/serve.mjs'],{env:{...process.env,SITE_STATIC_ROOT:target,SITE_STATIC_PORT:'4174'},stdio:'ignore'});
const proof={timestamp:new Date().toISOString(),baseline,rollbackSourceSha256:sha(actual),lineEndingsNormalized:'LF',restoredWithoutHistoryRewrite:true,productionModified:false,checks:[],passed:false};
try{for(let i=0;i<30;i++){try{if((await fetch('http://127.0.0.1:4174')).ok)break;}catch{}await delay(200);}
for(const route of ['/','/CNAME','/css/main.css','/js/main.js','/components/hero.html','/components/contact.html']){const r=await fetch(`http://127.0.0.1:4174${route}`);proof.checks.push({route,status:r.status});if(!r.ok)throw new Error(`Rollback ${route} failed`);}
const live=await fetch('https://santensor.com/');proof.liveBaselineStatus=live.status;proof.liveBaselineSha256=sha(Buffer.from(await live.arrayBuffer()));proof.liveMatchesRestoredBaseline=proof.liveBaselineSha256===proof.rollbackSourceSha256;
proof.cname=(await readFile(path.join(target,'CNAME'),'utf8')).trim();proof.passed=proof.cname==='santensor.com'&&proof.liveBaselineStatus===200&&proof.liveMatchesRestoredBaseline;
}finally{server.kill();await writeFile('evidence/rollback-drill.json',JSON.stringify(proof,null,2));console.log(JSON.stringify(proof));if(!proof.passed)process.exitCode=1;}
