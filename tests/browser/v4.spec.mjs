import {test,expect} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
const evidence=process.env.SITE_EVIDENCE_DIR??'evidence/v4';
const go=async(page,n)=>{await page.locator(`.scene-nav [data-go="${n}"]`).click();await expect.poll(()=>page.evaluate(()=>globalThis.santensorExperience.progress)).toBeCloseTo(n,2);};

for(const viewport of [{width:1440,height:900},{width:390,height:844}])test(`executable operation, failure recovery, historical evidence ${viewport.width}`,async({browser})=>{
 const context=await browser.newContext({viewport});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await go(page,3);
 await mkdir(evidence,{recursive:true});
 await page.screenshot({path:`${evidence}/operation-${viewport.width}.png`});
 await page.locator('[data-request]').fill('SYNTHETIC: Account NS-204 requests 12 developer accounts for a fictional laboratory.');
 await page.locator('[data-run]').click();await expect(page.locator('[data-review]')).toBeVisible();
 await page.locator('[data-approve]').click();
 await expect.poll(()=>page.evaluate(()=>globalThis.santensorExperience.operation.run.result.outcome)).toBe('approved');
 await expect(page.locator('[data-evidence-values]')).toContainText('SYN-001');
 if(viewport.width<700)await page.locator('[data-panel-tab="0"]').click();
 await page.locator('[data-break]').click();await expect(page.locator('[data-retry]')).toBeVisible();
 await expect.poll(()=>page.evaluate(()=>globalThis.santensorExperience.operation.run.tool.status)).toBe(503);
 await page.screenshot({path:`${evidence}/failure-${viewport.width}.png`});
 await page.locator('[data-retry]').click();await page.locator('[data-step]').click();await page.locator('[data-approve]').click();
 const run=await page.evaluate(()=>globalThis.santensorExperience.operation.run);
 expect(run.result.externalWrites).toBe(0);expect(run.events.map(e=>e.code)).toContain('retry');expect(run.events.map(e=>e.code)).toContain('toolError');
 await page.locator('[data-event="3"]').click();await expect(page.locator('[data-evidence-values]')).toContainText('503');
 await page.screenshot({path:`${evidence}/recovered-${viewport.width}.png`});
 if(viewport.width<700)await page.locator('[data-panel-tab="0"]').click();
 await page.locator('[data-reset]').click();await page.locator('[data-request]').fill('short');await page.locator('[data-run]').click();await expect(page.locator('[data-error]')).toContainText('20–600');
 await page.locator('[data-request]').fill('SYNTHETIC: Unknown account requests access to an unidentified resource.');await page.locator('[data-run]').click();await expect(page.locator('[data-review]')).toBeVisible();await expect(page.locator('[data-approve]')).toBeDisabled();await page.locator('[data-correct]').click();
 expect((await page.evaluate(()=>globalThis.santensorExperience.operation.run)).result.outcome).toBe('corrected');
 await go(page,4);await expect(page.locator('.result-summary')).toContainText('SYN-001');
 for(const i of [0,1,2]){await page.locator(`[data-area="${i}"]`).click();await expect(page.locator(`[data-area="${i}"]`)).toHaveAttribute('aria-pressed','true');}
 await page.screenshot({path:`${evidence}/results-${viewport.width}.png`});
 await page.locator('[data-result-inspect]').click();await expect.poll(()=>page.evaluate(()=>globalThis.santensorExperience.progress)).toBeCloseTo(3,2);await expect(page.locator('[data-evidence-values]')).toContainText('SYN-001');
 await writeFile(`${evidence}/operation-trace-${viewport.width}.json`,JSON.stringify({errors,run},null,2));
 expect(errors).toEqual([]);await context.close();
});

test('commercial routes, independent laboratory and contact draft',async({page})=>{
 await page.goto('/');await page.locator('header [data-route="labs"]').click();await expect(page.locator('[data-standalone-lab]')).toBeVisible();
 await page.locator('[data-run]').click();await expect(page.locator('[data-review]')).toBeVisible();await page.locator('[data-reject]').click();expect((await page.evaluate(()=>globalThis.santensorExperience.operation.run)).result.outcome).toBe('rejected');
 await page.locator('header [data-route="cases"]').click();await expect(page.locator('.study')).toHaveCount(3);await expect(page.locator('.case-kind').first()).toContainText('Experimental');
 await page.locator('header [data-route="contact"]').click();await page.locator('#name').fill('Synthetic Visitor');await page.locator('#email').fill('visitor@example.invalid');await page.locator('#message').fill('A fictional inquiry about an inspectable software system.');await page.locator('[name="consent"]').check();await page.locator('[type="submit"]').click();await expect(page.locator('[data-draft-panel]')).toBeVisible();await expect(page.locator('[data-open-draft]')).toHaveAttribute('href',/^mailto:/);
});
