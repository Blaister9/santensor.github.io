import {readdir,readFile,writeFile} from 'node:fs/promises';import path from 'node:path';
const workspace=path.resolve('..');
const replace=s=>s.replaceAll(workspace,'<workspace>').replaceAll(workspace.replaceAll('\\','/'),'<workspace>').replaceAll(workspace.replaceAll('\\','\\\\'),'<workspace>');
function sanitize(x){if(typeof x==='string')return replace(x);if(Array.isArray(x))return x.map(sanitize);if(x&&typeof x==='object')return Object.fromEntries(Object.entries(x).map(([k,v])=>[k,sanitize(v)]));return x;}
async function clean(directory){for(const entry of await readdir(directory,{withFileTypes:true})){const filename=path.join(directory,entry.name);if(entry.isDirectory())await clean(filename);else if(entry.name.endsWith('.json')){const raw=(await readFile(filename,'utf8')).replace(/^\uFEFF/,'');await writeFile(filename,JSON.stringify(sanitize(JSON.parse(raw)),null,2));}}}
for(const directory of ['evidence/v2','../trainer/evidence/v2'])await clean(directory);
console.log('Evidence retains outcomes; local user paths replaced with <workspace>.');
