import {chromium,expect} from '@playwright/test';
import {writeFile} from 'node:fs/promises';

const origin = process.env.SITE_TEST_URL;
if (!origin?.startsWith('https://')) throw new Error('Set SITE_TEST_URL to the real HTTPS preview origin');
const browser = await chromium.launch();
const report = {origin,checkedAt:new Date().toISOString(),routes:[],gallery:[],videos:[],errors:[]};
try {
 for (const viewport of [{width:1440,height:900},{width:390,height:844}]) {
  const context = await browser.newContext({viewport});
  const page = await context.newPage();
  page.on('pageerror',error => report.errors.push(error.message));
  page.on('response',response => {if(response.status() >= 400) report.errors.push(`${response.status()} ${response.url()}`);});
  page.on('requestfailed',request => {if(request.failure()?.errorText !== 'net::ERR_ABORTED') report.errors.push(`${request.failure()?.errorText} ${request.url()}`);});
  for (const route of ['/','/es/','/concept-b/','/es/concept-b/']) {
   const response = await page.goto(origin+route);
   await page.evaluate(() => document.fonts.ready);
   await expect(page.locator('h1')).toBeVisible();
   expect(response.status()).toBe(200);
   expect(await page.evaluate(() => [...document.images].every(image => image.complete && image.naturalWidth > 0))).toBe(true);
   report.routes.push({route,viewport,status:response.status(),title:await page.title(),fonts:await page.evaluate(() => document.fonts.status)});
  }
  await context.close();
 }
 const context = await browser.newContext({viewport:{width:1440,height:900}});
 const page = await context.newPage();
 await page.goto(origin+'/review/');
 const urls = await page.locator('a[href],img[src],video[src]').evaluateAll(elements => [...new Set(elements.map(element => element.href || element.src))]);
 for (const url of urls) {
  expect(url.startsWith(origin+'/')).toBe(true);
  const response = await context.request.head(url);
  report.gallery.push({url,status:response.status()});
  expect(response.status()).toBe(200);
 }
 for (const video of await page.locator('video').all()) {
  await video.scrollIntoViewIfNeeded();
  await expect(video).toHaveAttribute('controls','');
  await expect.poll(() => video.evaluate(element => element.readyState),{timeout:60000}).toBeGreaterThanOrEqual(2);
  await video.press('Space');
  await expect.poll(() => video.evaluate(element => element.currentTime),{timeout:20000}).toBeGreaterThan(.3);
  report.videos.push(await video.evaluate(element => ({url:element.currentSrc,duration:element.duration,currentTime:element.currentTime,paused:element.paused,error:element.error?.message??null})));
  await video.press('Space');
 }
 for (const route of ['/CNAME','/.git/config','/.env']) {
  const response = await context.request.get(origin+route);
  expect(response.status()).toBe(404);
 }
 await context.close();
 expect(report.errors).toEqual([]);
 report.passed = true;
} catch (error) {
 report.passed = false;
 report.failure = error.message;
 process.exitCode = 1;
} finally {
 await browser.close();
 await writeFile('evidence/v3/access-check.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));
}
