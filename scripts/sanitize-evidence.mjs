import {readdir,readFile,writeFile} from 'node:fs/promises';import path from 'node:path';
const workspace=path.resolve('..');
const replace=s=>s.replaceAll(workspace,'<workspace>').replaceAll(workspace.replaceAll('\\','/'),'<workspace>').replaceAll(workspace.replaceAll('\\','\\\\'),'<workspace>');
function sanitize(x){if(typeof x==='string')return replace(x);if(Array.isArray(x))return x.map(sanitize);if(x&&typeof x==='object')return Object.fromEntries(Object.entries(x).map(([k,v])=>[k,sanitize(v)]));return x;}
for(const dir of ['evidence','../trainer/santensor-interview-v1/evidence'])for(const entry of await readdir(dir)){if(entry.endsWith('.json')){const f=path.join(dir,entry);await writeFile(f,JSON.stringify(sanitize(JSON.parse(await readFile(f,'utf8'))),null,2));}}
console.log('Evidence retains outcomes; local user paths replaced with <workspace>.');
