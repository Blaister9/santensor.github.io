import {test,expect} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
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
  await expect(page.locator('[data-scenario]')).toBeFocused();await page.keyboard.press('Tab');await expect(page.locator('[data-request]')).toBeFocused();
  await page.goto(root+'contact/');await page.keyboard.press('Tab');await page.keyboard.press('Enter');await expect(page.locator('#main')).toBeFocused();await page.keyboard.press('Tab');
  expect(await page.evaluate(()=>!!document.activeElement.closest('main'))).toBe(true);
 });
 for(const javaScriptEnabled of [true,false])test(`single Pages 404 recovery ${language} JS=${javaScriptEnabled}`,async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled});const page=await context.newPage();
  expect((await page.goto(root+'missing-v41-page/')).status()).toBe(404);
  const active=page.locator(`[data-error-language="${language}"]`);await expect(active).toBeVisible();
  await expect(page.locator(`[data-error-language="${language==='es'?'en':'es'}"]`))[javaScriptEnabled?'toBeHidden':'toBeVisible']();
  if(javaScriptEnabled)await expect(page.locator('html')).toHaveAttribute('lang',language);
  await active.locator('[data-error-home]').click();await expect(page).toHaveURL(new RegExp(root==='/'?'/\u0024':'/es/\u0024'));
  await context.close();
 });
}
