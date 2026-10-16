import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();
for (const width of [1440,390]) {
 await page.setViewportSize({width:width*2,height:width === 390 ? 894 : 950});
 await page.goto(`http://127.0.0.1:4175/compare-${width}.html`);
 await page.locator('img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
 await page.screenshot({path:`evidence/v3/compare-${width}.png`,fullPage:true});
}
await page.setViewportSize({width:1440,height:900});
await page.goto('http://127.0.0.1:4175/');
const links = await page.locator('a').evaluateAll(elements => [...new Set(elements.map(element => element.href))]);
const failures = [];
for (const url of links) {
 const response = await context.request.get(url);
 if (response.status() !== 200) failures.push({url,status:response.status()});
}
const videos = await page.locator('video').evaluateAll(elements => Promise.all(elements.map(element => new Promise(resolve => {
 const report = () => resolve({src:element.getAttribute('src'),duration:element.duration,width:element.videoWidth,height:element.videoHeight});
 if (element.readyState >= 1) report();
 else {element.addEventListener('loadedmetadata',report,{once:true});element.addEventListener('error',() => resolve({src:element.src,error:true}),{once:true});}
}))));
await writeFile('evidence/v3/gallery-check.json',JSON.stringify({failures,videos},null,2));
console.log(JSON.stringify({failures,videos}));
await browser.close();
if (failures.length || videos.some(video => video.error)) process.exitCode=1;
