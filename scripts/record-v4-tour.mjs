import {chromium,expect} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
const root=process.env.SITE_EVIDENCE_DIR??'evidence/v4',base=process.env.SITE_TEST_URL??'http://127.0.0.1:4180';
await mkdir(`${root}/video`,{recursive:true});await mkdir(`${root}/scenes`,{recursive:true});
const browser=await chromium.launch();
for(const [name,viewport,query] of [['desktop',{width:1440,height:900},''],['mobile',{width:390,height:844},''],['desktop-webgl',{width:1440,height:900},'?quality=webgl']]){
 if(process.argv[2]&&process.argv[2]!==name)continue;
 const context=await browser.newContext({viewport,recordVideo:{dir:'.local/v4-recordings',size:viewport}}),page=await context.newPage(),video=page.video(),timeline=[],errors=[];
 page.on('pageerror',e=>errors.push(e.message));const start=Date.now(),mobile=name==='mobile';
 const mark=(event)=>timeline.push({event,seconds:(Date.now()-start)/1000});
 async function scroll(scene){await page.mouse.move(viewport.width-4,viewport.height*.6);const target=scene*viewport.height*1.6;let current=await page.evaluate(()=>scrollY);for(let i=0;i<20;i++){const next=current+(target-current)/(20-i);await page.mouse.wheel(0,next-current);current=next;await page.waitForTimeout(name==='desktop-webgl'?130:75);}await expect.poll(()=>page.evaluate(()=>Number(document.querySelector("[data-journey]").dataset.progress))).toBeCloseTo(scene,2);mark(`scene-${scene}`);await page.waitForTimeout(550);}
 async function shot(nameSuffix){await page.screenshot({path:`${root}/scenes/${name}-${nameSuffix}.png`});}
 await page.goto(base+query,{waitUntil:'networkidle'});if(query)await page.waitForFunction(()=>document.body.classList.contains("graphics-ready"));await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(900);mark('archive');await shot('scene-1');
 await scroll(1);await shot('scene-2');await page.locator('[data-context="0"]').click();await page.waitForTimeout(850);await page.locator('[data-context-close]').click();
 await scroll(2);await shot('scene-3');await page.locator('[data-context="3"]').click();await page.waitForTimeout(900);await page.locator('[data-language]').click();await page.waitForTimeout(800);await shot('intelligence-es');await page.locator('[data-language]').click();await page.locator('[data-context-close]').click();
 await scroll(3);await shot('scene-4');await page.locator('[data-request]').fill('SYNTHETIC: Account NS-204 requests 12 developer accounts for a fictional engineering project.');await page.waitForTimeout(500);await page.locator('[data-run]').click();await expect(page.locator('[data-review]')).toBeVisible();mark('human-review');await page.waitForTimeout(850);await page.locator('[data-approve]').click();await page.waitForTimeout(700);
 if(mobile)await page.locator('[data-panel-tab="0"]').click();await page.locator('[data-break]').click();await expect(page.locator('[data-retry]')).toBeVisible();mark('controlled-503');await shot('failure');await page.waitForTimeout(950);await page.locator('[data-retry]').click();await page.waitForTimeout(600);await page.locator('[data-step]').click();await page.waitForTimeout(600);await page.locator('[data-approve]').click();mark('recovered-and-approved');await page.waitForTimeout(600);await shot('recovered');
 await page.locator('[data-event="3"]').click();await expect(page.locator('[data-evidence-values]')).toContainText('503');await page.waitForTimeout(600);await page.locator('[data-event]').last().click();
 await scroll(4);await shot('scene-5');for(const area of [1,2,0]){await page.locator(`[data-area="${area}"]`).click();await page.waitForTimeout(700);}await page.locator('[data-language]').click();await page.waitForTimeout(600);await shot('results-es');await page.locator('[data-language]').click();
 await scroll(2);mark('reverse-to-intelligence');await scroll(4);mark('return-with-result-preserved');expect(await page.locator('.result-summary').textContent()).toContain('SYN-001');
 const renderMode=await page.evaluate(()=>globalThis.santensorExperience?.stats()??({mode:document.body.classList.contains("graphics-ready")?"webgl":"css-fallback"}));await page.locator('header [data-route="cases"]').click();await page.waitForTimeout(700);await shot('work');await page.locator('header [data-route="contact"]').click();await page.waitForTimeout(700);await shot('contact');mark('commercial-navigation');
 const metadata={name,viewport,source:base,query,renderMode,timeline,errors,physicalDevice:false,recording:'Real Playwright Chromium capture; no fabricated video frames.'};
 await context.close();await video.saveAs(`${root}/video/${name}.webm`);await writeFile(`${root}/video/${name}.json`,JSON.stringify(metadata,null,2));console.log(JSON.stringify({name,errors,duration:timeline.at(-1)?.seconds}));
}
await browser.close();
