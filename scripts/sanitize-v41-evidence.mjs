import{readdir,readFile,writeFile}from'node:fs/promises';import path from'node:path';
const workspace=path.resolve('..');
function sanitize(value){if(typeof value==='string')return value.replaceAll(workspace,'<workspace>').replaceAll(workspace.replaceAll('\\','/'),'<workspace>').replaceAll(workspace.replaceAll('\\','\\\\'),'<workspace>');if(Array.isArray(value))return value.map(sanitize);if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,sanitize(item)]));return value;}
async function clean(directory){for(const entry of await readdir(directory,{withFileTypes:true})){const file=path.join(directory,entry.name);if(entry.isDirectory())await clean(file);else if(entry.name.endsWith('.json'))await writeFile(file,JSON.stringify(sanitize(JSON.parse(await readFile(file,'utf8'))),null,2));}}
await clean('evidence/v4.1');console.log('V4.1 evidence sanitized; local account paths removed.');
