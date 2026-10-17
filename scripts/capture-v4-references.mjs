import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
const directory='evidence/v4/references',results=[];
await mkdir(directory,{recursive:true});const browser=await chromium.launch();
for(const [name,url] of [['scrollytelling','https://scrollytelling.ai/'],['bruno-simon','https://bruno-simon.com/'],['approved-prototype','https://weekend-kick-characterization-guam.trycloudflare.com/es/']]){
 const context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage();
 try{
  const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:20000});
  await page.waitForTimeout(4000);await page.screenshot({path:`${directory}/${name}.png`});
  await page.mouse.wheel(0,850);await page.waitForTimeout(600);await page.screenshot({path:`${directory}/${name}-scroll.png`});
  results.push({name,url,status:response?.status(),title:await page.title(),capturedAt:new Date().toISOString(),use:'Reference inspection only. No assets copied into the experience.'});
 }catch(error){results.push({name,url,error:error.message,recoveredAssets:false});}
 await context.close();
}
await writeFile(`${directory}/sources.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(results));await browser.close();
