import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdir,writeFile} from 'node:fs/promises';

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();
await mkdir('evidence/v3/inspection',{recursive:true});
const reports = [];
for (const width of [1440,390]) {
 await page.setViewportSize({width,height:width === 390 ? 844 : 900});
 for (const [name,route] of [['a','/es/'],['b','/es/concept-b/'],['labs','/es/labs/'],['cases','/es/cases/'],['contact','/es/contact/']]) {
  await page.goto(`http://127.0.0.1:4173${route}`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  await page.screenshot({path:`evidence/v3/inspection/${name}-${width}.png`});
  const axe = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  reports.push({route,width,overflow:await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),violations:axe.violations.map(item => ({id:item.id,nodes:item.nodes.map(node => ({html:node.html,summary:node.failureSummary}))}))});
 }
}
await writeFile('evidence/v3/inspection/axe.json',JSON.stringify(reports,null,2));
console.log(JSON.stringify(reports));
await browser.close();
