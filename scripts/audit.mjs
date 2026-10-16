import lighthouse from 'lighthouse';import * as chromeLauncher from 'chrome-launcher';import {chromium} from '@playwright/test';import {spawn} from 'node:child_process';import {mkdir,writeFile} from 'node:fs/promises';import {setTimeout as delay} from 'node:timers/promises';
let server,chrome;
const url=process.env.SITE_AUDIT_URL??'http://127.0.0.1:4173/';
try{
 if(!process.env.SITE_AUDIT_URL){server=spawn(process.execPath,['scripts/serve.mjs'],{stdio:'ignore'});for(let i=0;i<30;i++){try{if((await fetch(url)).ok)break;}catch{}await delay(200);}}
 chrome=await chromeLauncher.launch({chromePath:chromium.executablePath(),chromeFlags:['--headless','--disable-gpu','--no-sandbox']});
 const result=await lighthouse(url,{port:chrome.port,logLevel:'error',output:'json',onlyCategories:['performance','accessibility','best-practices','seo']});
 const summary={timestamp:new Date().toISOString(),url,mode:'Lighthouse simulated mobile lab test; not field measurements',scores:Object.fromEntries(Object.entries(result.lhr.categories).map(([k,v])=>[k,Math.round(v.score*100)])),metrics:Object.fromEntries(['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index'].map(k=>[k,result.lhr.audits[k].displayValue])),runtimeError:result.lhr.runtimeError??null};
 await mkdir('evidence',{recursive:true});await writeFile('evidence/lighthouse-summary.json',JSON.stringify(summary,null,2));console.log(JSON.stringify(summary));
 if(summary.scores.performance<90||summary.scores.accessibility<95||summary.scores.seo<90)process.exitCode=1;
}finally{await chrome?.kill();server?.kill();}
