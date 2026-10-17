import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdir} from 'node:fs/promises';
const evidence=process.env.SITE_EVIDENCE_DIR??'evidence/v4.1/final-release/candidate';
await mkdir(evidence,{recursive:true});

for(const language of ['en','es'])for(const javaScriptEnabled of [true,false])
 test(`technical evidence destination, native scroll and back ${language} JS=${javaScriptEnabled}`,async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled,reducedMotion:'reduce'}),page=await context.newPage();
  const root=language==='es'?'/es/':'/';
  await page.goto(root+'cases/');
  for(const key of ['workflow','portfolio','trainer']){
   const link=page.locator(`.study a[href="/assets/projects/${key}.html#${language}"]`);
   await expect(link).toHaveCount(1);await link.click();
   await expect(page).toHaveURL(new RegExp(`/assets/projects/${key}\\.html#${language}$`));
   const section=page.locator(`#${language}`),heading=section.getByRole('heading');
   await expect(section).toHaveAttribute('lang',language);await expect(heading).toBeInViewport();
   const box=await heading.boundingBox();expect(box.y).toBeGreaterThanOrEqual(0);expect(box.y).toBeLessThan(200);
   await expect(heading).toContainText(language==='es'?/Laboratorio|Portafolio|Entrenador/:/Workflow|Portfolio|Private trainer/);
   await expect(section.locator(`a[href="${root}cases/"]`)).toHaveCount(1);
   if(javaScriptEnabled){const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(axe.violations).toEqual([]);}
   await page.screenshot({path:`${evidence}/note-${key}-${language}-js-${javaScriptEnabled}.png`});
   await page.goBack();await expect(page).toHaveURL(new RegExp(`${root}cases/$`));await expect(link).toBeInViewport();
  }
  const contact=page.locator('.cases-contact a');await expect(contact).toHaveAttribute('href',root+'contact/');await contact.click();
  await expect(page).toHaveURL(new RegExp(`${root}contact/$`));await expect(page.locator('.email-link')).toHaveAttribute('href','mailto:santiagopazbedoya@gmail.com');
  await context.close();
 });

test('public evidence links use the documented immutable source snapshot',async({page,request})=>{
 const paths=new Set();
 for(const route of ['/cases/','/es/cases/','/assets/projects/workflow.html','/assets/projects/portfolio.html','/assets/projects/trainer.html']){
  const html=await (await request.get(route)).text();expect(html).not.toMatch(/github\.com[^"'<>\s]*\/(?:blob|tree)\/(?:feat|fix)\//);
  await page.goto(route);
  for(const href of await page.locator('a[href*="github.com/"]').evaluateAll(els=>els.map(el=>el.href))){
   if(href.includes('/blob/')){expect(href).toMatch(/\/blob\/[a-f0-9]{40}\//);paths.add(href.split('/').slice(7).join('/'));}
  }
 }
 for(const path of ['js/workflow.mjs','tests/workflow.test.mjs','scripts/render-v4.mjs','js/cinematic.mjs','tests/browser/production.spec.mjs','tests/browser/hardening.spec.mjs'])expect(paths.has(path),path).toBe(true);
});

test('commercial controls remain separate at 360, 390 and desktop',async({browser})=>{
 for(const viewport of [{width:360,height:740},{width:390,height:844},{width:1440,height:900}]){
  const context=await browser.newContext({viewport,reducedMotion:'reduce'}),page=await context.newPage();
  for(const root of ['/','/es/']){
   await page.goto(root);await page.evaluate(()=>document.fonts.ready);
   const archive=await page.locator('.scene-copy.active .text-link').boundingBox(),bottom=await page.locator('.journey-bottom').boundingBox();
   expect(archive.y+archive.height).toBeLessThan(bottom.y);
   const headerLinks=await page.locator('.site-header nav a,.site-header nav button').evaluateAll(els=>els.filter(el=>el.getClientRects().length).map(el=>el.getBoundingClientRect().toJSON()));
   for(let i=1;i<headerLinks.length;i++)expect(headerLinks[i-1].right).toBeLessThanOrEqual(headerLinks[i].left);
   await page.screenshot({path:`${evidence}/after-${root==='/es/'?'es':'en'}-${viewport.width}.png`});
   for(let n=0;n<5;n++){
    await page.locator(`.scene-nav [data-go="${n}"]`).click();
    await expect.poll(()=>page.locator('[data-journey]').getAttribute('data-progress').then(Number)).toBeCloseTo(n,2);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await page.screenshot({path:`${evidence}/scene-${root==='/es/'?'es':'en'}-${viewport.width}-${n+1}.png`});
   }
   await page.goto(root+'cases/');
   for(const image of await page.locator('.project-capture').all()){await image.scrollIntoViewIfNeeded();await expect(image).toHaveJSProperty('complete',true);expect(await image.evaluate(el=>el.naturalWidth)).toBeGreaterThan(0);}
   await page.locator('.cases-contact').scrollIntoViewIfNeeded();await page.screenshot({path:`${evidence}/cases-contact-${root==='/es/'?'es':'en'}-${viewport.width}.png`});
  }await context.close();
 }
});
