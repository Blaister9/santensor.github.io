import{chromium,expect}from'@playwright/test';import{writeFile}from'node:fs/promises';
const base=process.env.SITE_TEST_URL;if(!base)throw Error('Set SITE_TEST_URL to the isolated preview URL');
const browser=await chromium.launch();const checks=[];
for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
 const context=await browser.newContext({viewport,reducedMotion:'reduce'}),page=await context.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const root of ['/','/es/']){
  await page.goto(base+root);await page.keyboard.press('Tab');await page.keyboard.press('Enter');await page.keyboard.press('Tab');await expect(page.locator('[data-request]')).toBeFocused();
  await page.goto(base+root+'labs/');await page.locator('[data-run]').click();await page.locator('[data-approve]').click();await page.locator('[data-view-result]').click();await expect(page.locator('#lab-result')).toBeFocused();await expect(page.locator('#lab-result')).toContainText('SYN-001');
  await page.locator('header [data-route="cases"]').click();await expect(page.locator('.study')).toHaveCount(3);
  for(const href of await page.locator('.project-evidence a[href^="/"]').evaluateAll(els=>els.map(el=>el.getAttribute('href'))))expect((await context.request.get(base+href)).status(),href).toBe(200);
  await page.locator('header [data-route="contact"]').click();await expect(page.locator('.email-link')).toHaveAttribute('href','mailto:santiagopazbedoya@gmail.com');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 await page.goto(base+'/review/');for(const video of await page.locator('video').all()){await video.evaluate(el=>el.play());await expect.poll(()=>video.evaluate(el=>el.currentTime)).toBeGreaterThan(0);await video.evaluate(el=>el.pause());}
 for(const path of ['/CNAME','/.git/config','/.env','/scripts/build.mjs'])expect((await context.request.get(base+path)).status()).toBe(404);
 expect(errors).toEqual([]);checks.push({viewport,keyboard:true,labResult:true,projectEvidence:true,contact:true,nativeVideoPlayback:true,errors});await context.close();
}
for(const javaScriptEnabled of [true,false]){
 const context=await browser.newContext({javaScriptEnabled});const page=await context.newPage();
 for(const root of ['/','/es/']){expect((await page.goto(base+root+'missing-v41-preview/')).status()).toBe(404);const lang=root==='/es/'?'es':'en';await expect(page.locator(`[data-error-language="${lang}"]`)).toBeVisible();if(!javaScriptEnabled)await expect(page.locator('[data-error-home]')).toHaveCount(2);await page.locator(`[data-error-language="${lang}"] [data-error-home]`).click();await expect(page).toHaveURL(base+root);}
 await context.close();
}
const version=await(await fetch(base+'/version.json')).json();await browser.close();await writeFile('evidence/v4.1/https-preview.json',JSON.stringify({base,version,checks,localized404:{javascript:true,bilingualWithoutJavaScript:true},physicalHardware:false},null,2));console.log(JSON.stringify({base,version,checks:checks.length,passed:true}));
