import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:1440,height:900}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
await mkdir('evidence/v4/inspection',{recursive:true});
await page.goto(process.env.SITE_TEST_URL??'http://127.0.0.1:4180/',{waitUntil:'networkidle'});
await page.screenshot({path:'evidence/v4/inspection/archive.png'});
await page.evaluate(()=>globalThis.originalSurface=document.querySelector('[data-surface="0"]'));
const poses=[];
for(const i of [1,2,1,0]){
 await page.locator(`.scene-nav [data-go="${i}"]`).click();
 await page.waitForFunction(i=>Math.abs(globalThis.santensorExperience.progress-i)<.01,i);
 if(i){await page.locator('[data-context="0"]').click();assert.equal(await page.locator('.context-inspector').isVisible(),true);await page.locator('[data-context-close]').click();}
 assert.equal(await page.evaluate(()=>globalThis.originalSurface===document.querySelector('[data-surface="0"]')),true);
 poses.push(await page.locator('[data-surface="0"]').getAttribute('data-pose'));
 await page.screenshot({path:`evidence/v4/inspection/scene-${i}.png`});
}
assert.equal(poses[0],poses[2]);
console.log(JSON.stringify({errors,stats:await page.evaluate(()=>globalThis.santensorExperience?.stats())}));
await writeFile('evidence/v4/inspection/render.json',JSON.stringify({errors,poses,reversible:poses[0]===poses[2],persistentSurface:true,stats:await page.evaluate(()=>globalThis.santensorExperience?.stats())},null,2));
await browser.close();
