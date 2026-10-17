import {test,expect} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
const evidence=process.env.SITE_EVIDENCE_DIR??'evidence/v4.1/after';
await mkdir(evidence,{recursive:true});
for(const language of ['en','es']) {
 const root=language==='es'?'/es/':'/';
 test(`standalone result preserves actual decision and request ${language}`,async({page})=>{
  await page.goto(root+'labs/');
  const input='SYNTHETIC: Account NS-204 requests 17 developer accounts for a fictional test.';
  await page.locator('[data-request]').fill(input);await page.locator('[data-run]').click();await page.locator('[data-approve]').click();
  await page.locator('[data-event="0"]').click();await expect(page.locator('[data-evidence-values]')).toContainText(input);
  await page.locator('[data-view-result]').click();
  await expect(page).toHaveURL(/\/labs\/#lab-result$/);await expect(page.locator('#lab-result')).toBeFocused();
  await expect(page.locator('#lab-result')).toContainText('SYN-001');await expect(page.locator('[data-request]')).toHaveValue(input);
  const download=page.waitForEvent('download');await page.locator('[data-export]').click();expect((await download).suggestedFilename()).toBe('santensor-synthetic-trace.json');
  await page.screenshot({path:`${evidence}/lab-result-${language}.png`,fullPage:true});
 });
 test(`skip link Tab Enter Tab ${language}`,async({page})=>{
  await page.goto(root);await page.keyboard.press('Tab');await expect(page.locator('.skip')).toBeFocused();await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');await expect(page.locator('[data-request]')).toBeFocused();
  await page.goto(root+'contact/');await page.keyboard.press('Tab');await page.keyboard.press('Enter');await expect(page.locator('#main')).toBeFocused();await page.keyboard.press('Tab');
  expect(await page.evaluate(()=>!!document.activeElement.closest('main'))).toBe(true);
 });
 for(const javaScriptEnabled of [true,false])test(`single Pages 404 recovery ${language} JS=${javaScriptEnabled}`,async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled});const page=await context.newPage();
  expect((await page.goto(root+'missing-v41-page/')).status()).toBe(404);
  const active=page.locator(`[data-error-language="${language}"]`);await expect(active).toBeVisible();
  await expect(page.locator(`[data-error-language="${language==='es'?'en':'es'}"]`))[javaScriptEnabled?'toBeHidden':'toBeVisible']();
  if(javaScriptEnabled)await expect(page.locator('html')).toHaveAttribute('lang',language);
  if(javaScriptEnabled){const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(axe.violations).toEqual([]);}
  await page.screenshot({path:`${evidence}/404-${language}-js-${javaScriptEnabled}.png`,fullPage:true});
  await active.locator('[data-error-home]').click();await expect(page).toHaveURL(new RegExp(root==='/'?'/\u0024':'/es/\u0024'));
  await context.close();
 });
}

for(const viewport of [{width:1440,height:900},{width:1363,height:936},{width:768,height:1024},{width:390,height:844},{width:360,height:740}])
 test(`commercial clarity, actual typography, links and screenshots ${viewport.width}`,async({browser,request})=>{
  const context=await browser.newContext({viewport,reducedMotion:'reduce'}),page=await context.newPage();
  const reports=[],errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error'&&!m.location().url.startsWith('chrome-extension:'))errors.push(m.text());});
  for(const root of ['/','/es/']) {
   for(const route of ['','labs/','cases/','contact/','privacy/']) {
    await page.goto(root+route);
    if(!route){
     await expect(page.locator('.capability-lines li')).toHaveCount(3);
     for(const link of await page.locator('.hero-commercial a').all()) {
      const box=await link.boundingBox();expect(box.y+box.height).toBeLessThanOrEqual(viewport.height);
      expect(await link.evaluate(el=>getComputedStyle(el).pointerEvents)).toBe('auto');
     }
     await page.locator('.hero-commercial a').first().click();await expect(page).toHaveURL(/\/cases\/$/);await page.goBack();
    }
    const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    expect(axe.violations).toEqual([]);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    const sizes=await page.locator('.standalone-surface button,.standalone-surface textarea,.standalone-surface select,.standalone-surface .field-label').evaluateAll(els=>els.filter(el=>el.getClientRects().length).map(el=>({tag:el.tagName,text:el.textContent.slice(0,55),font:parseFloat(getComputedStyle(el).fontSize),height:el.getBoundingClientRect().height})));
    for(const size of sizes){expect(size.font).toBeGreaterThanOrEqual(14);if(size.tag==='BUTTON')expect(size.height).toBeGreaterThanOrEqual(44);}
    for(const href of await page.locator('a[href^="/"],link[rel="stylesheet"],script[src^="/"],img[src^="/"]').evaluateAll(els=>els.map(el=>el.getAttribute('href')??el.getAttribute('src'))))expect((await request.get(href.split('#')[0])).status(),href).toBe(200);
    await page.screenshot({path:`${evidence}/${root==='/es/'?'es':'en'}-${route.replace('/','')||'home'}-${viewport.width}.png`,fullPage:!!route});
    reports.push({root,route,sizes,axeViolations:axe.violations});
   }
   await page.goto(root+'#scene-3');
   await page.locator('[data-run]').click();await expect(page.locator('[data-review]')).toBeVisible();
   for(const selector of ['[data-approve]','[data-reject]']){
    const box=await page.locator(selector).boundingBox();expect(box.y).toBeGreaterThan(100);expect(box.y+box.height).toBeLessThan(viewport.height-30);
   }
   await page.screenshot({path:`${evidence}/${root==='/es/'?'es':'en'}-review-${viewport.width}.png`});
   await page.locator('[data-reject]').click();
   if(viewport.width<1000)await page.locator('[data-panel-tab="0"]').click();
   await page.locator('[data-break]').click();await expect(page.locator('[data-retry]')).toBeVisible();
   const retry=await page.locator('[data-retry]').boundingBox();expect(retry.y+retry.height).toBeLessThan(viewport.height-30);
   await page.locator('[data-retry]').click();await page.locator('[data-step]').click();await page.locator('[data-reject]').click();
   if(viewport.width<1000)await page.locator('[data-panel-tab="0"]').click();
   await page.locator('[data-scenario]').selectOption('ambiguous');await page.locator('[data-run]').click();await expect(page.locator('[data-review]')).toBeVisible();
   await expect(page.locator('[data-approve]')).toBeDisabled();await page.locator('[data-correct]').click();await expect(page.locator('[data-evidence-values]')).toContainText('SYN-001');
  }
  expect(errors).toEqual([]);await writeFile(`${evidence}/commercial-${viewport.width}.json`,JSON.stringify({viewport,emulation:true,physicalTouch:false,virtualKeyboard:false,reports,errors},null,2));await context.close();
 });

test('generated social metadata, evidence notes and direct contact',async({page,request,context})=>{
 for(const root of ['/','/es/'])for(const route of ['','labs/','cases/','contact/','privacy/']){
  const html=await (await request.get(root+route)).text();
  expect(html).toContain('name="twitter:card" content="summary_large_image"');
  await page.goto(root+route);
  for(const selector of ['meta[property="og:title"]','meta[property="og:description"]','meta[property="og:image"]','meta[name="twitter:image"]'])expect(await page.locator(selector).getAttribute('content')).toBeTruthy();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://santensor.com'+root+route);
  for(const lang of ['en','es','x-default'])await expect(page.locator(`link[hreflang="${lang}"]`)).toHaveCount(1);
 }
 const social=await (await request.get('/assets/social/santensor-v41.png')).body();expect(social.readUInt32BE(16)).toBe(1200);expect(social.readUInt32BE(20)).toBe(630);
 for(const key of ['workflow','portfolio','trainer']){
  await page.goto(`/assets/projects/${key}.html`);const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(axe.violations).toEqual([]);
  await page.screenshot({path:`${evidence}/evidence-${key}.png`,fullPage:true});
 }
 await context.grantPermissions(['clipboard-read','clipboard-write']);await page.goto('/es/contact/');await page.locator('[data-copy-email]').click();
 await expect(page.locator('[data-email-status]')).toContainText('copiada');expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe('santiagopazbedoya@gmail.com');
});
