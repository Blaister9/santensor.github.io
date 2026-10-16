import {test, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdir, rename, writeFile} from 'node:fs/promises';

const evidence = process.env.SITE_EVIDENCE_DIR ?? 'evidence/v2.1/local';
const prefix = process.env.SITE_PATH_PREFIX ?? '';
const route = language => `${prefix}/${language === 'es' ? 'es/' : ''}`;

async function scrollStory(page, progress) {
 await expect(page.locator('[data-story]')).toHaveAttribute('data-scroll-end', /\d/);
 const bounds = await page.locator('[data-story]').evaluate(element => ({start: Number(element.dataset.scrollStart), end: Number(element.dataset.scrollEnd)}));
 const target = bounds.start + (bounds.end - bounds.start) * progress;
 const current = await page.evaluate(() => scrollY);
 const steps = Math.max(1, Math.ceil(Math.abs(target - current) / 180));
 for (let step = 0; step < steps; step++) {
  await page.mouse.wheel(0, (target - current) / steps);
  await page.waitForTimeout(40);
 }
 await page.mouse.wheel(0, target - await page.evaluate(() => scrollY));
 await expect.poll(async () => Number(await page.locator('[data-story]').getAttribute('data-progress'))).toBeCloseTo(progress, 2);
 await page.waitForTimeout(260);
}

async function noOverflow(page) {
 expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

for (const language of ['en', 'es']) test(`three scroll acts, recovery, reversal and release ${language}`, async ({browser}) => {
 test.setTimeout(60000);
 await mkdir(evidence, {recursive: true});
 const context = await browser.newContext({viewport: {width: 1440, height: 900}, recordVideo: {dir: `${evidence}/video`, size: {width: 1440, height: 900}}});
 await context.tracing.start({screenshots: true, snapshots: true});
 const page = await context.newPage();
 const errors = [];
 page.on('pageerror', error => errors.push(error.message));
 page.on('console', message => {if (message.type() === 'error') errors.push(message.text());});
 await page.goto(route(language));
 const story = page.locator('[data-story]');
 await expect(story).toHaveClass(/is-pinned-story/);
 await expect(story).toHaveAttribute('data-scroll-end', /\d/);
 const snapshots = [];
 for (const [progress, act, state, name] of [[.08, 0, 'waiting', 'act-1'], [.48, 1, 'policy', 'act-2'], [.71, 2, 'error', 'act-3-error'], [.78, 2, 'recovered', 'act-3-recovered'], [.86, 2, 'review', 'act-3-review'], [.97, 2, 'recorded', 'act-3']]) {
  await scrollStory(page, progress);
  await expect(story).toHaveAttribute('data-act', String(act));
  await expect(story).toHaveAttribute('data-story-state', state);
  await expect(page.locator(`[data-chapter="${act}"]`)).toBeVisible();
  const geometry = await page.locator('.story-pin').boundingBox();
  expect(Math.abs(geometry.y)).toBeLessThan(2);
  const overlap = await page.locator('.story-layout').evaluate(element => {
   const copy = element.querySelector('.story-copy').getBoundingClientRect();
   const visual = element.querySelector('.story-visual').getBoundingClientRect();
   return copy.right > visual.left;
  });
  expect(overlap).toBe(false);
  if (act > 0) {
   const documents = await page.locator('.story-document').evaluateAll(elements => elements.map(element => {const bounds = element.getBoundingClientRect(); return {top: bounds.top, bottom: bounds.bottom};}));
   expect(documents[0].bottom).toBeLessThan(documents[1].top);
   expect(documents[1].bottom).toBeLessThan(documents[2].top);
  }
  await noOverflow(page);
  snapshots.push({progress, act, state, wires: await page.locator('[data-story-wire]').evaluateAll(elements => elements.map(element => getComputedStyle(element).strokeDashoffset)), packet: await page.locator('.story-packet').getAttribute('transform')});
  await page.screenshot({path: `${evidence}/${name}-${language}-1440.png`});
 }
 expect(snapshots[0].wires).not.toEqual(snapshots[5].wires);
 await scrollStory(page, .48);
 await expect(story).toHaveAttribute('data-story-state', 'policy');
 expect(await page.locator('[data-story-wire]').evaluateAll(elements => elements.map(element => getComputedStyle(element).strokeDashoffset))).toEqual(snapshots[1].wires);
 await scrollStory(page, .08);
 await expect(story).toHaveAttribute('data-story-state', 'waiting');
 expect(await page.locator('[data-story-wire]').evaluateAll(elements => elements.map(element => getComputedStyle(element).strokeDashoffset))).toEqual(snapshots[0].wires);
 await scrollStory(page, .97);
 await page.mouse.wheel(0, 1100);
 await expect(page.locator('#lab-entry')).toBeInViewport();
 expect((await page.locator('.story-pin').boundingBox()).y).toBeLessThan(-100);
 await page.screenshot({path: `${evidence}/handoff-${language}-1440.png`});
 await scrollStory(page, .48);
 await page.locator('.story-top a').focus();
 await page.keyboard.press('Enter');
 await expect(page.locator('#lab-entry')).toBeFocused();
 await expect(page.locator('#lab-entry')).toBeInViewport();
 await page.locator('#lab-entry a').press('Enter');
 await expect(page).toHaveURL(new RegExp(`${route(language)}labs/$`));
 await page.locator('[data-scenario]').selectOption('failure');
 for (let index = 0; index < 3; index++) await page.locator('[data-step]').click();
 await expect(page.locator('.system-node[data-node="3"]')).toHaveAttribute('data-node-state', 'error');
 await page.screenshot({path: `${evidence}/lab-error-${language}-1440.png`, fullPage: true});
 await page.locator('[data-retry]').click();
 await page.locator('[data-step]').click();
 await expect(page.locator('.system-node[data-node="4"]')).toHaveAttribute('data-node-state', 'review');
 await page.locator('[data-approve]').click();
 await expect(page.locator('.system-node[data-node="5"]')).toHaveAttribute('data-node-state', 'complete');
 await page.waitForTimeout(350);
 await page.screenshot({path: `${evidence}/lab-complete-${language}-1440.png`, fullPage: true});
 await noOverflow(page);
 expect(errors).toEqual([]);
 await writeFile(`${evidence}/scroll-states-${language}.json`, JSON.stringify(snapshots, null, 2));
 await context.tracing.stop({path: `${evidence}/story-${language}.zip`});
 const video = page.video();
 await context.close();
 await rename(await video.path(), `${evidence}/video/story-${language}.webm`);
});

for (const viewport of [{width: 768, height: 1024}, {width: 390, height: 844}]) for (const language of ['en', 'es']) test(`vertical story and page composition ${language} ${viewport.width}`, async ({page}) => {
 await page.setViewportSize(viewport);
 await page.goto(route(language));
 await expect(page.locator('[data-story]')).not.toHaveClass(/is-pinned-story/);
 await expect(page.locator('.pin-spacer')).toHaveCount(0);
 for (let act = 0; act < 3; act++) {
  await page.locator(`[data-chapter="${act}"]`).scrollIntoViewIfNeeded();
  await expect(page.locator(`[data-chapter="${act}"]`)).toBeVisible();
  await noOverflow(page);
  await page.screenshot({path: `${evidence}/act-${act + 1}-${language}-${viewport.width}.png`});
 }
 for (const path of ['', 'labs/', 'cases/', 'contact/']) {
  await page.goto(route(language) + path);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(900);
  await noOverflow(page);
  const report = await new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(report.violations).toEqual([]);
  await page.screenshot({path: `${evidence}/${path.replace('/', '') || 'home'}-${language}-${viewport.width}-composition.png`, fullPage: true});
 }
});

test('reduced motion, missing scripts and responsive cleanup preserve all acts', async ({browser, page}) => {
 await page.emulateMedia({reducedMotion: 'reduce'});
 await page.goto(route('es'));
 await expect(page.locator('.pin-spacer')).toHaveCount(0);
 for (let act = 0; act < 3; act++) await expect(page.locator(`[data-chapter="${act}"]`)).toBeVisible();
 await page.emulateMedia({reducedMotion: 'no-preference'});
 await expect(page.locator('[data-story]')).toHaveClass(/is-pinned-story/);
 await scrollStory(page, .48);
 await page.setViewportSize({width: 768, height: 1024});
 await expect(page.locator('.pin-spacer')).toHaveCount(0);
 for (let act = 0; act < 3; act++) await expect(page.locator(`[data-chapter="${act}"]`)).not.toHaveAttribute('aria-hidden');
 await page.setViewportSize({width: 1440, height: 900});
 await expect(page.locator('.pin-spacer')).toHaveCount(1);
 await scrollStory(page, .97);
 await expect(page.locator('[data-story]')).toHaveAttribute('data-story-state', 'recorded');
 const context = await browser.newContext({javaScriptEnabled: false});
 const staticPage = await context.newPage();
 for (const language of ['en', 'es']) {
  await staticPage.goto(route(language));
  for (let act = 0; act < 3; act++) await expect(staticPage.locator(`[data-chapter="${act}"]`)).toBeVisible();
  await staticPage.locator('.story-top a').click();
  await expect(staticPage.locator('#lab-entry')).toBeInViewport();
 }
 await context.close();
 await page.route('**/vendor/*.js', request => request.abort());
 await page.reload();
 await expect(page.locator('.pin-spacer')).toHaveCount(0);
 for (let act = 0; act < 3; act++) await expect(page.locator(`[data-chapter="${act}"]`)).toBeVisible();
});

test('story keyboard navigation, language equivalents and desktop accessibility', async ({page}) => {
 await page.goto(route('en'));
 await page.keyboard.press('Tab');
 await expect(page.locator('.skip')).toBeFocused();
 await page.keyboard.press('Enter');
 await scrollStory(page, .48);
 const report = await new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
 expect(report.violations).toEqual([]);
 await page.goto(`${route('en')}#system-story`);
 await page.locator('.nav-language').click();
 await expect(page).toHaveURL(new RegExp(`${route('es')}#system-story$`));
 await expect(page.locator('html')).toHaveAttribute('lang', 'es');
 await expect(page.locator('[data-story]')).toHaveClass(/is-pinned-story/);
});
