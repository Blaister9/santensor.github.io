import {chromium} from '@playwright/test';
import {mkdir, writeFile} from 'node:fs/promises';

const version = process.argv[2] ?? 'v3';
const base = process.env.CAPTURE_URL ?? 'http://127.0.0.1:4173';
const directory = `evidence/v3/${version}`;
await mkdir(directory, {recursive: true});
const browser = await chromium.launch({headless: true});
const errors = [];
for (const viewport of [{width: 1440, height: 900}, {width: 390, height: 844}]) {
 const context = await browser.newContext({viewport, recordVideo: {dir: `${directory}/video`, size: viewport}});
 const page = await context.newPage();
 page.on('pageerror', error => errors.push(error.message));
 await page.goto(`${base}/es/`);
 await page.evaluate(() => document.fonts.ready);
 await page.waitForTimeout(1100);
 await page.screenshot({path: `${directory}/home-${viewport.width}.png`});
 await page.screenshot({path: `${directory}/home-${viewport.width}-full.png`, fullPage: true});
 const height = await page.evaluate(() => document.documentElement.scrollHeight);
 let lastAct = '0';
 for (let offset = 0; offset < height; offset += 150) {
  await page.mouse.wheel(0, 150);
  await page.waitForTimeout(160);
  if (version === 'v3' && viewport.width === 1440) {
   const act = await page.locator('[data-v3-story]').getAttribute('data-act');
   if (act !== lastAct) {
    await page.waitForTimeout(1400);
    await page.screenshot({path:`${directory}/scroll-act-${act}-${viewport.width}.png`});
    lastAct = act;
   }
  }
 }
 await page.waitForTimeout(800);
 if (version === 'v3') {
  if (viewport.width === 390) {
   for (const act of [0,1,2]) {
    await page.locator(`[data-chapter-link="${act}"]`).click();
    await page.locator('[data-v3-story]').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({path:`${directory}/touch-act-${act}.png`});
   }
  }
  await page.locator('.narrative-top a').click();
  await page.locator('[data-run]').click();
  await page.locator('[data-review]').waitFor({state:'visible'});
  await page.waitForTimeout(1000);
  await page.locator('[data-approve]').click();
  await page.locator('[data-inspector] summary').click();
  await page.waitForTimeout(900);
  await page.screenshot({path:`${directory}/home-interaction-${viewport.width}.png`});
 }
 for (const route of ['labs', 'cases', 'contact']) {
  if (version === 'v3') {
   await page.locator('.site-header').scrollIntoViewIfNeeded();
   if (viewport.width === 390) await page.locator('.menu-toggle').click();
   await page.locator(`#main-navigation a[href="/es/${route}/"]`).click();
  } else await page.goto(`${base}/es/${route}/`);
  await page.waitForTimeout(600);
  if (route === 'labs') {
   await page.locator('[data-scenario]').selectOption('failure');
   for (let step = 0; step < 3; step++) await page.locator('[data-step]').click();
   await page.screenshot({path: `${directory}/lab-error-${viewport.width}.png`, fullPage: true});
   await page.waitForTimeout(1000);
   await page.locator('[data-retry]').click();
   await page.locator('[data-step]').click();
   await page.waitForTimeout(1000);
   await page.locator('[data-approve]').click();
  }
  if (route === 'contact' && version === 'v3') {
   await page.locator('#name').fill('Visitante sintético');
   await page.locator('#email').fill('visitante@example.invalid');
   await page.locator('#message').fill('Consulta ficticia: revisar un proceso de solicitudes y sus controles de aprobación.');
   await page.locator('input[name=consent]').check();
   await page.locator('button[type=submit]').click();
   await page.waitForTimeout(800);
  }
  await page.screenshot({path: `${directory}/${route}-${viewport.width}-full.png`, fullPage: true});
  await page.waitForTimeout(1000);
 }
 if (version === 'v3') {
  await page.locator('.preview-ribbon a').scrollIntoViewIfNeeded();
  await page.locator('.preview-ribbon a').click();
  await page.screenshot({path:`${directory}/concepts-${viewport.width}.png`,fullPage:true});
  await page.locator('a.concept-b').click();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({path:`${directory}/concept-b-${viewport.width}.png`});
  await page.screenshot({path:`${directory}/concept-b-${viewport.width}-full.png`,fullPage:true});
  await page.locator('[data-bench-doc="1"]').click();
  await page.waitForTimeout(800);
  await page.locator('[data-bench-doc="2"]').click();
  await page.waitForTimeout(800);
  await page.locator('[data-bench-run]').click();
  await page.screenshot({path:`${directory}/concept-b-interaction-${viewport.width}.png`});
  await page.waitForTimeout(1000);
 }
 const video = page.video();
 await context.close();
 await video.saveAs(`${directory}/tour-${viewport.width}.webm`);
 await video.delete();
}
await writeFile(`${directory}/capture.json`, JSON.stringify({version, base, errors, capturedAt: new Date().toISOString()}, null, 2));
await browser.close();
