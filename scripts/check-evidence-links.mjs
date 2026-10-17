import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {commercialCopy} from '../js/commercial-copy.mjs';
import {evidenceRevision} from '../js/evidence-links.mjs';
const links=new Set();
for(const language of ['en','es'])for(const item of commercialCopy[language].items)
 for(const [,href] of item.links)if(href.startsWith('https://github.com/'))links.add(href);
for(const key of ['workflow','portfolio','trainer']){
 const html=await readFile(`dist/assets/projects/${key}.html`,'utf8');
 for(const [,href] of html.matchAll(/href="(https:\/\/github\.com\/[^" ]+)"/g))links.add(href);
}
async function get(url){
 for(let attempt=0;attempt<3;attempt++){
  const response=await fetch(url,{signal:AbortSignal.timeout(30000)});
  if(response.status===429||response.status>=500){if(attempt<2){await new Promise(r=>setTimeout(r,2000*(attempt+1)));continue;}}
  if(!response.ok)throw new Error(`${response.status} ${url}`);
  return response;
 }
}
const results=[];
for(const url of links){
 const response=await get(url);const html=await response.text();
 if(url.includes('/blob/')){
  if(!url.includes(`/blob/${evidenceRevision}/`))throw new Error(`Non-permanent source: ${url}`);
  const path=url.split(`/blob/${evidenceRevision}/`)[1];
  if(!html.includes(path.split('/').at(-1)))throw new Error(`Wrong GitHub destination: ${url}`);
  const raw=`https://raw.githubusercontent.com/Blaister9/santensor.github.io/${evidenceRevision}/${path}`;
  const source=await (await get(raw)).text();
  if(source.length<100||!/(?:import |export |test\()/m.test(source))throw new Error(`Missing source: ${raw}`);
  results.push({url,status:response.status,path,raw,sourceBytes:Buffer.byteLength(source)});
 }else results.push({url,status:response.status});
}
const directory=process.env.SITE_EVIDENCE_DIR??'.local';await mkdir(directory,{recursive:true});
await writeFile(`${directory}/external-links.json`,JSON.stringify({date:new Date().toISOString(),evidenceRevision,results},null,2));
console.log(`Verified ${results.length} public GitHub destinations and their immutable source contents.`);
