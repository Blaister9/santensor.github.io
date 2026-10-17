import {chromium,expect} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const base=process.env.SITE_TEST_URL;if(!base?.startsWith('https://'))throw new Error('SITE_TEST_URL must be the isolated HTTPS preview.');
const browser=await chromium.launch(),results=[];
for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
 const context=await browser.newContext({viewport}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const path of ['/','/es/','/labs/','/es/labs/','/cases/','/contact/','/review/']){const response=await page.goto(base+path,{waitUntil:'networkidle'});expect(response.status()).toBe(200);results.push({viewport:viewport.width,path,status:response.status(),title:await page.title()});}console.log(JSON.stringify({stage:'routes',width:viewport.width}));
 await page.goto(base+'/#scene-3');await expect(page.locator('[data-run]')).toBeVisible();await page.locator('[data-run]').click();await expect(page.locator('[data-review]')).toBeVisible();await page.locator('[data-approve]').click();expect((await page.evaluate(()=>globalThis.santensorExperience.operation.run.result.externalWrites))).toBe(0);
 await page.goto(base+'/review/');
 for(let i=0;i<3;i++){const video=page.locator('video').nth(i);await video.scrollIntoViewIfNeeded();await video.focus();await page.keyboard.press('Space');await expect.poll(()=>video.evaluate(v=>v.currentTime)).toBeGreaterThan(.1);await page.keyboard.press('Space');results.push({viewport:viewport.width,video:i,played:true});}console.log(JSON.stringify({stage:'native-video-playback',width:viewport.width}));
 const sources=await page.locator('a[href],img[src],video[src]').evaluateAll(els=>[...new Set(els.map(e=>e.href||e.src))].filter(u=>new URL(u).origin===location.origin));
 await Promise.all(sources.map(async url=>{const response=await context.request.head(url,{timeout:10000});expect(response.status(),new URL(url).pathname).toBe(200);}));console.log(JSON.stringify({stage:'gallery-resources',width:viewport.width,count:sources.length}));
 expect(errors).toEqual([]);results.push({viewport:viewport.width,errors});await context.close();
}
const request=await browser.newContext();for(const path of ['/CNAME','/.git/config','/.env','/.local/v4-tunnel.log']){const response=await request.request.get(base+path);expect(response.status()).toBe(404);results.push({path,status:response.status()});}
const version=await (await request.request.get(base+'/version.json')).json();await request.close();await browser.close();await writeFile('evidence/v4/https-verification.json',JSON.stringify({base,verifiedAt:new Date().toISOString(),version,results,scope:'Chromium and HTTP from this computer; not an independent network or physical phone.'},null,2));console.log(JSON.stringify({base,version,checks:results.length}));
