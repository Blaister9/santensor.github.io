import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';

const browser = await chromium.launch();
const context = await browser.newContext({viewport:{width:1440,height:900}});
const page = await context.newPage();
const directory = 'evidence/v3/references';
await mkdir(directory,{recursive:true});
const results = [];
for (const [name,url] of [['makemepulse','https://www.makemepulse.com/'],['instrument','https://www.instrument.com/work'],['linear','https://linear.app/now/how-we-redesigned-the-linear-ui'],['active-theory','https://activetheory.net/']]) {
 try {
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:20000});
  await page.waitForTimeout(2500);
  await page.screenshot({path:`${directory}/${name}.png`});
  await page.mouse.wheel(0,650);
  await page.waitForTimeout(800);
  await page.screenshot({path:`${directory}/${name}-detail.png`});
  results.push({name,url,title:await page.title(),status:'captured'});
 } catch(error) {results.push({name,url,error:error.message});}
}
await writeFile(`${directory}/sources.json`,JSON.stringify(results,null,2));
console.log(JSON.stringify(results));
await browser.close();
