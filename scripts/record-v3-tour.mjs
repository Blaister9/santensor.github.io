import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';

const version = process.argv[2] ?? 'v3';
const base = version === 'v3' ? 'http://127.0.0.1:4173' : 'http://127.0.0.1:4174';
const directory = `evidence/v3/${version}`;
const browser = await chromium.launch();
for (const viewport of [{width:1440,height:900},{width:390,height:844}]) {
 const context = await browser.newContext({viewport,recordVideo:{dir:`${directory}/recordings`,size:viewport}});
 const page = await context.newPage();
 const started = Date.now();
 const events = [];
 const mark = name => events.push({seconds:Number(((Date.now()-started)/1000).toFixed(2)),name});
 await page.goto(`${base}/es/`);
 await page.evaluate(() => document.fonts.ready);
 mark('Portada');
 await page.waitForTimeout(1200);
 if (version === 'v3') {
  const story = page.locator('[data-v3-story]');
  const start = await story.evaluate(element => element.getBoundingClientRect().top + scrollY);
  const end = viewport.width === 1440 ? await story.evaluate(element => element.getBoundingClientRect().bottom + scrollY - innerHeight) : start;
  let previous = '0';
  while (await page.evaluate(() => scrollY) < end) {
   await page.mouse.wheel(0,100);
   await page.waitForTimeout(130);
   const act = await story.getAttribute('data-act');
   if (act !== previous) {mark(`Capítulo ${Number(act)+1}`);await page.waitForTimeout(1200);previous=act;}
  }
  if (viewport.width === 390) for (const act of [1,2]) {
   await page.locator(`[data-chapter-link="${act}"]`).click();
   await story.scrollIntoViewIfNeeded();
   mark(`Capítulo táctil ${act+1}`);
   await page.waitForTimeout(1400);
  }
  await page.locator('.narrative-top a').click();
  await page.locator('[data-run]').click();
  mark('Simulación ejecutándose');
  await page.locator('[data-review]').waitFor({state:'visible'});
  await page.locator('[data-review]').scrollIntoViewIfNeeded();
  mark('Revisión humana');
  await page.waitForTimeout(1200);
  await page.locator('[data-approve]').click();
  await page.locator('[data-inspector] summary').click();
  await page.waitForTimeout(900);
 }
 const height = await page.evaluate(() => document.documentElement.scrollHeight);
 for (let offset = await page.evaluate(() => scrollY); offset < height; offset += 200) {
  await page.mouse.wheel(0,200);
  await page.waitForTimeout(120);
 }
 mark('Secciones y contacto de Home');
 await page.waitForTimeout(700);
 for (const route of ['labs','cases','contact']) {
  await page.locator('.site-header').scrollIntoViewIfNeeded();
  if (viewport.width === 390) await page.locator('.menu-toggle').click();
  await page.locator(`#main-navigation a[href="/es/${route}/"]`).click();
  mark(`Navegación: ${route}`);
  await page.waitForTimeout(700);
  if (route === 'labs') {
   await page.locator('[data-scenario]').selectOption('failure');
   for (let step = 0; step < 3; step++) {await page.locator('[data-step]').click();await page.waitForTimeout(250);}
   mark('Fallo 503');
   await page.waitForTimeout(1000);
   await page.locator('[data-retry]').click();
   await page.locator('[data-step]').click();
   mark('Recuperación y revisión');
   await page.waitForTimeout(1000);
   await page.locator('[data-approve]').click();
   await page.locator('[data-evidence]').scrollIntoViewIfNeeded();
   await page.waitForTimeout(900);
  }
  if (route === 'contact' && version === 'v3') {
   await page.locator('#name').fill('Visitante sintético');
   await page.locator('#email').fill('visitante@example.invalid');
   await page.locator('#message').fill('Consulta ficticia sobre solicitudes, integraciones y revisión de permisos.');
   await page.locator('input[name=consent]').check();
   await page.locator('button[type=submit]').click();
   await page.locator('[data-draft-panel]').scrollIntoViewIfNeeded();
   mark('Borrador local; no enviado');
  }
  await page.waitForTimeout(1000);
 }
 if (version === 'v3') {
  await page.locator('.preview-ribbon a').scrollIntoViewIfNeeded();
  await page.locator('.preview-ribbon a').click();
  await page.waitForTimeout(900);
  await page.locator('a.concept-b').click();
  mark('Concepto B');
  await page.waitForTimeout(1000);
  for (const index of [1,2]) {await page.locator(`[data-bench-doc="${index}"]`).click();await page.waitForTimeout(800);}
  await page.locator('[data-bench-run]').click();
  await page.locator('[data-bench-status]').scrollIntoViewIfNeeded();
  mark('B: revisión humana requerida');
  await page.waitForTimeout(1300);
 }
 const video = page.video();
 await context.close();
 await video.saveAs(`${directory}/tour-${viewport.width}.webm`);
 await video.delete();
 await mkdir(directory,{recursive:true});
 await writeFile(`${directory}/tour-timeline-${viewport.width}.json`,JSON.stringify(events,null,2));
}
await browser.close();
