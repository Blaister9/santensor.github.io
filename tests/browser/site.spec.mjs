import {test,expect} from '@playwright/test';import AxeBuilder from '@axe-core/playwright';
for(const width of [1440,768,390])test(`responsive routes, links and accessibility at ${width}px`,async({browser})=>{
 const context=await browser.newContext({viewport:{width,height:980}});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const route of ['/','/labs/','/cases/','/privacy/']){
 const r=await page.goto((process.env.SITE_PATH_PREFIX??'')+route);expect(r.status()).toBe(200);await expect(page.locator('h1')).toHaveCount(1);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const a11y=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(a11y.violations).toEqual([]);
 const links=await page.locator('a[href^="/"]').evaluateAll(els=>[...new Set(els.map(e=>e.getAttribute('href').split('#')[0]).filter(Boolean))]);for(const href of links)expect((await context.request.get(href)).status()).toBe(200);
 if(width!==768)await page.screenshot({path:`evidence/${route==='/'?'home':route.split('/')[1]}-${width}.png`,fullPage:true});
 }expect(errors).toEqual([]);await context.close();
});
test('live DOM workflow pauses for a human, validates known accounts and blocks unknown ones',async({page})=>{
 await page.goto((process.env.SITE_PATH_PREFIX??'')+'/labs/');for(let i=0;i<7;i++)await page.getByRole('button',{name:'Run next step'}).click();
 await expect(page.getByRole('button',{name:'Run next step'})).toBeDisabled();await page.getByRole('button',{name:'Approve draft'}).click();await expect(page.getByRole('status')).toContainText('Validated');
 await page.getByLabel('Synthetic scenario').selectOption('unknown');for(let i=0;i<7;i++)await page.getByRole('button',{name:'Run next step'}).click();await expect(page.getByRole('button',{name:'Approve draft'})).toBeDisabled();await page.getByRole('button',{name:'Reject draft'}).click();await expect(page.getByRole('status')).toContainText('Rejected');
 await page.getByLabel('Request text').fill('SYNTHETIC: <img src=x onerror="window.pwned=true"> unknown request');await page.getByRole('button',{name:'Load / reset'}).click();expect(await page.evaluate(()=>window.pwned)).toBeUndefined();
});
