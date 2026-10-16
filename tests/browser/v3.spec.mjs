import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdir,writeFile} from 'node:fs/promises';

const evidence = process.env.SITE_EVIDENCE_DIR ?? 'evidence/v3/tests';
const route = language => language === 'es' ? '/es/' : '/';

for (const language of ['en','es']) test(`V3 scroll transforms, reverses, keyboard controls and releases ${language}`,async ({page}) => {
 await page.goto(route(language));
 const story = page.locator('[data-v3-story]');
 await expect(story).toHaveClass(/is-scroll-story/);
 const start = await story.evaluate(element => element.getBoundingClientRect().top + scrollY);
 const distance = await story.evaluate(element => element.offsetHeight - innerHeight);
 await mkdir(evidence,{recursive:true});
 for (const [progress,act] of [[.1,0],[.5,1],[.92,2],[.1,0]]) {
  await page.mouse.wheel(0,start + distance * progress - await page.evaluate(() => scrollY));
  await expect(story).toHaveAttribute('data-act',String(act));
  await expect(page.locator(`[data-v3-chapter="${act}"]`)).toBeVisible();
  await page.waitForTimeout(850);
  expect(Math.abs((await page.locator('.narrative-pin').boundingBox()).y)).toBeLessThan(2);
  const visual = page.locator(act === 0 ? '.artifact.mail' : act === 1 ? '.narrative-canvas .logic-surface' : '.product-surface');
  await expect(visual).toHaveCSS('opacity','1');
  await page.screenshot({path:`${evidence}/chapter-${act+1}-${language}.png`});
 }
 await page.locator('[data-chapter-link="2"]').focus();
 await page.keyboard.press('Enter');
 await expect(story).toHaveAttribute('data-act','2');
 await page.locator('.narrative-top a').press('Enter');
 await expect(page.locator('#lab-entry')).toBeFocused();
 await expect(page.locator('#lab-entry')).toBeInViewport();
 expect((await page.locator('.narrative-pin').boundingBox()).y).toBeLessThan(-100);
 await page.locator('[data-run]').click();
 await expect(page.locator('[data-orchestrator]')).toHaveAttribute('data-stage','4',{timeout:7000});
 await page.locator('[data-approve]').click();
 await page.locator('[data-inspector] summary').click();
 await expect(page.locator('[data-evidence]')).toContainText('SYN-001');
});

for (const width of [320,390,768]) for (const language of ['en','es']) test(`V3 touch chapters and concept B ${language} ${width}`,async ({page}) => {
 await page.setViewportSize({width,height:844});
 await page.goto(route(language));
 const story = page.locator('[data-v3-story]');
 await expect(story).not.toHaveClass(/is-scroll-story/);
 for (const act of [1,2,0]) {
  await page.locator(`[data-chapter-link="${act}"]`).click();
  await expect(story).toHaveAttribute('data-act',String(act));
  await expect(page.locator(`[data-v3-chapter="${act}"]`)).toBeVisible();
 }
 await page.locator('[data-chapter-link="2"]').click();
 await page.locator('.narrative-top a').click();
 await expect(page.locator('#lab-entry')).toBeFocused();
 for (const path of ['','labs/','cases/','contact/','concept-b/','concepts/']) {
  await page.goto(route(language)+path);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),path).toBe(true);
 }
 await page.goto(`${route(language)}concept-b/`);
 await page.locator('[data-bench-doc="2"]').click();
 await expect(page.locator('[data-bench-doc="2"]')).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('[data-bench-title]')).toHaveText(language === 'es' ? 'Requiere aprobación humana' : 'Human approval required');
 await page.locator('[data-bench-run]').click();
 await expect(page.locator('.workbench-desk')).toHaveAttribute('data-stage','4');
 const report = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
 expect(report.violations).toEqual([]);
});

test('V3 motion preference and viewport changes clean up sticky storytelling',async ({page}) => {
 await page.goto('/');
 await expect(page.locator('[data-v3-story]')).toHaveClass(/is-scroll-story/);
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(page.locator('[data-v3-story]')).not.toHaveClass(/is-scroll-story/);
 await page.locator('[data-chapter-link="2"]').click();
 await expect(page.locator('[data-v3-story]')).toHaveAttribute('data-act','2');
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.setViewportSize({width:390,height:844});
 await expect(page.locator('[data-v3-story]')).not.toHaveClass(/is-scroll-story/);
 await page.setViewportSize({width:1440,height:900});
 await expect(page.locator('[data-v3-story]')).toHaveClass(/is-scroll-story/);
});

test('V3 scene states and comparison routes pass accessibility in both locales',async ({page}) => {
 const reports = [];
 for (const language of ['en','es']) {
  await page.goto(route(language));
  for (const act of [0,1,2]) {
   await page.locator(`[data-chapter-link="${act}"]`).click();
   await page.waitForTimeout(850);
   const report = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
   reports.push({language,act,violations:report.violations,incomplete:report.incomplete.map(item => item.id)});
   expect(report.violations).toEqual([]);
  }
  for (const path of ['concepts/','concept-b/']) {
   await page.goto(route(language)+path);
   const report = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
   reports.push({language,path,violations:report.violations});
   expect(report.violations).toEqual([]);
  }
 }
 await writeFile(`${evidence}/axe-v3-scenes.json`,JSON.stringify(reports,null,2));
});

test('V3 custom request stays safe and updates its visible document',async ({page}) => {
 await page.goto('/es/labs/?scenario=failure');
 await expect(page.locator('[data-scenario]')).toHaveValue('failure');
 const text = '<img src=x onerror="window.pwned=true"> NS-999 acceso de prueba sintética';
 await page.locator('[data-request]').fill(text);
 await page.locator('[data-load]').click();
 await expect(page.locator('[data-ticket-text]')).toHaveText(text);
 await page.locator('[data-step]').click();
 await expect(page.locator('[data-ticket-reference]')).toHaveText('NS-999');
 expect(await page.evaluate(() => window.pwned)).toBeUndefined();
});
