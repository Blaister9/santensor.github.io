import {test, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdir, writeFile} from 'node:fs/promises';
const prefix = process.env.SITE_PATH_PREFIX ?? '';
const visit = (page, path) => page.goto(prefix + path);
const evidence = process.env.SITE_EVIDENCE_DIR ?? 'evidence/v3/tests';

for (const viewport of [{width:1440,height:900},{width:390,height:844}]) {
 for (const language of ['en', 'es']) test(`routes, visual evidence and axe ${language} ${viewport.width}`, async ({browser}) => {
  const context = await browser.newContext({viewport, reducedMotion:'reduce'});
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const reports = [];
  for (const route of ['', 'labs/', 'cases/', 'contact/', 'privacy/']) {
   const path = `/${language === 'es' ? 'es/' : ''}${route}`;
   expect((await visit(page, path)).status()).toBe(200);
   await expect(page.locator('html')).toHaveAttribute('lang', language);
   await expect(page.locator('h1')).toHaveCount(1);
   await page.evaluate(() => document.fonts.ready);
   expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
   const report = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
   reports.push({path, violations:report.violations, passes:report.passes.length, incomplete:report.incomplete.map(item => ({id:item.id,impact:item.impact}))});
   await mkdir(evidence, {recursive:true});
   const name = `${route ? route.slice(0,-1) : 'home'}-${language}-${viewport.width}`;
   await page.screenshot({path:`${evidence}/${name}.png`,fullPage:false});
   if (!route) await page.screenshot({path:`${evidence}/${name}-full.png`,fullPage:true});
   expect(report.violations).toEqual([]);
   const links = await page.locator('a[href^="/"]').evaluateAll(elements => [...new Set(elements.map(element => element.getAttribute('href').split('#')[0]).filter(Boolean))]);
   for (const link of links) expect((await context.request.get(link)).status(), link).toBe(200);
  }
  await writeFile(`${evidence}/axe-${language}-${viewport.width}.json`, JSON.stringify(reports,null,2));
  expect(errors).toEqual([]);
  await context.close();
 });
}
test('language selector preserves routes, hashes, reload and direct-link priority', async ({page}) => {
 for (const route of ['', 'labs/', 'cases/', 'contact/', 'privacy/']) {
  await visit(page, `/${route}${route === 'cases/' ? '#study-2' : ''}`);
  await page.locator('.nav-language').click();
  await expect(page).toHaveURL(new RegExp(`${prefix}/es/${route}${route === 'cases/' ? '#study-2' : ''}$`));
  expect(await page.evaluate(() => localStorage.getItem('santensor-language'))).toBe('es');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang','es');
  await page.locator('.nav-language').click();
  await expect(page.locator('html')).toHaveAttribute('lang','en');
 }
 await page.evaluate(() => localStorage.setItem('santensor-language','es'));
 await visit(page,'/labs/');
 await expect(page.locator('html')).toHaveAttribute('lang','en');
});
test('mobile menu, language control, escape and focus work at 390px', async ({page}) => {
 await page.setViewportSize({width:390,height:844});
 await visit(page,'/');
 await page.getByRole('button',{name:'Menu',exact:true}).click();
 await expect(page.locator('#main-navigation')).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(page.locator('.menu-toggle')).toBeFocused();
 await expect(page.locator('#main-navigation')).not.toBeVisible();
 await page.locator('.mobile-language').click();
 await expect(page.locator('html')).toHaveAttribute('lang','es');
 await page.getByRole('button',{name:'Menú',exact:true}).click();
 await page.getByRole('link',{name:'Laboratorio',exact:true}).click();
 await expect(page).toHaveURL(new RegExp(`${prefix}/es/labs/$`));
 await expect(page.locator('#main-navigation')).not.toBeVisible();
});
for (const language of ['en','es']) test(`lab pauses, inspects, requires review and recovers ${language}`, async ({page}) => {
 await visit(page, `/${language === 'es' ? 'es/' : ''}labs/`);
 await page.locator('[data-run]').click();
 await page.locator('[data-pause]').click();
 const pausedStage = await page.locator('[data-orchestrator]').getAttribute('data-stage');
 await page.waitForTimeout(1200);
 await expect(page.locator('[data-orchestrator]')).toHaveAttribute('data-stage',pausedStage);
 for (let index=0;index<4;index++) await page.locator('[data-step]').click();
 await expect(page.locator('[data-review]')).toBeVisible();
 await expect(page.locator('[data-step]')).toBeDisabled();
 await page.locator('[data-approve]').click();
 await expect(page.locator('[data-evidence]')).toContainText('SYN-001');
 await page.locator('[data-timeline] [data-node="0"]').click();
 await expect(page.locator('[data-evidence]')).not.toContainText('SYN-001');
 await page.locator('[data-timeline] [data-node="0"]').press('End');
 await expect(page.locator('[data-timeline] [data-node="5"]')).toBeFocused();
 await page.locator('[data-scenario]').selectOption('ambiguous');
 for (let index=0;index<4;index++) await page.locator('[data-step]').click();
 await expect(page.locator('[data-approve]')).toBeDisabled();
 await page.locator('[data-correct]').click();
 await expect(page.locator('[data-evidence]')).toContainText(language==='en'?'manual triage':'revisión manual');
 await page.locator('[data-scenario]').selectOption('failure');
 for (let index=0;index<3;index++) await page.locator('[data-step]').click();
 await expect(page.locator('[data-evidence]')).toContainText('503');
 await expect(page.locator('[data-step]')).toBeDisabled();
 await page.screenshot({path:`${evidence}/lab-failure-${language}.png`,fullPage:true});
 await page.locator('[data-retry]').click();
 await page.locator('[data-step]').click();
 await page.locator('[data-reject]').click();
 await expect(page.locator('[data-evidence]')).toContainText(language==='en'?'Rejected':'Rechazada');
 await page.locator('[data-reset]').click();
 await expect(page.locator('[data-orchestrator]')).toHaveAttribute('data-stage','0');
 await page.locator('[data-run]').click();
 await page.locator('[data-request]').fill('short');
 await page.locator('[data-load]').click();
 await expect(page.locator('[data-error]')).toContainText(language==='en'?'fictional text':'texto ficticio');
 await expect(page.locator('[data-orchestrator]')).toHaveAttribute('data-running','false');
 await expect(page.locator('[data-run]')).toBeEnabled();
 await page.locator('[data-request]').fill('<img src=x onerror="window.pwned=true"> unknown request NS-999 access');
 await page.locator('[data-load]').click();
 expect(await page.evaluate(() => window.pwned)).toBeUndefined();
 await expect(page.locator('[data-evidence]')).toContainText('<img');
});
test('hero is a working system; reduced motion disables animations', async ({page}) => {
 await page.emulateMedia({reducedMotion:'reduce'});
 await visit(page,'/');
 await page.locator('[data-run]').click();
 await expect(page.locator('[data-orchestrator]')).toHaveAttribute('data-stage','4',{timeout:7000});
 await page.locator('[data-approve]').click();
 await page.locator('[data-inspector] summary').click();
 await expect(page.locator('[data-evidence]')).toContainText('Approved');
 if (await page.locator('[data-v3-story]').count()) {
  await expect(page.locator('[data-v3-story]')).not.toHaveClass(/is-scroll-story/);
  expect(await page.locator('.artifact').first().evaluate(element => getComputedStyle(element).transitionDuration)).toBe('0s');
 } else expect(await page.locator('.orbital').evaluate(element => getComputedStyle(element).animationName)).toBe('none');
});
for (const language of ['en','es']) test(`contact validates and prepares mailto without sending ${language}`, async ({page}) => {
 const externalWrites = [];
 page.on('request', request => {if(request.method()==='POST') externalWrites.push(request.url());});
 await visit(page,`/${language==='es'?'es/':''}contact/`);
 await page.locator('[data-contact-form] button[type=submit]').click();
 await expect(page.locator('[data-contact-status]')).toContainText(language==='en'?'Complete your name':'Completa tu nombre');
 await page.getByLabel(language==='en'?'Name':'Nombre',{exact:true}).fill('Synthetic Visitor');
 await page.locator('#email').fill('visitor@example.invalid');
 await page.locator('#message').fill('This is a synthetic inquiry to inspect the contact preview.');
 await page.locator('input[name=consent]').check();
 await page.locator('[data-contact-form] button[type=submit]').click();
 await expect(page.locator('[data-open-draft]')).toHaveAttribute('href',/^mailto:santiagopazbedoya@gmail.com\?/);
 await expect(page.locator('[data-contact-status]')).toContainText(language==='en'?'Nothing has been sent':'no ha enviado nada');
 await page.locator('#message').fill('This edited request must invalidate the stale draft.');
 await expect(page.locator('[data-draft-panel]')).not.toBeVisible();
 expect(externalWrites).toEqual([]);
});
test('content and navigation remain usable without JavaScript', async ({browser}) => {
 const context = await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
 const page = await context.newPage();
 await visit(page,'/');
 await expect(page.locator('h1')).toContainText('intelligent systems');
 await page.locator('.nav-language').click();
 await expect(page.locator('html')).toHaveAttribute('lang','es');
 await page.getByRole('link',{name:'Laboratorio',exact:true}).click();
 await expect(page.locator('h1')).toContainText('Orquestador');
 await context.close();
});
