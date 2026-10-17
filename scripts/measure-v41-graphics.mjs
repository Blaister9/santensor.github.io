import{chromium}from'@playwright/test';import{writeFile}from'node:fs/promises';
const browser=await chromium.launch();const results=[];
for(const mode of ['css-fallback','webgl']){
 const context=await browser.newContext({viewport:{width:1440,height:900}});const page=await context.newPage();
 await page.addInitScript(()=>{window.measuredLCP=0;new PerformanceObserver(list=>{for(const e of list.getEntries())window.measuredLCP=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});});
 await page.goto(`${process.env.SITE_TEST_URL??'http://127.0.0.1:4182'}/?${mode==='webgl'?'quality=webgl':'graphics-off'}`,{waitUntil:'networkidle'});
 await page.waitForFunction(expected=>globalThis.santensorExperience?.stats().mode===expected,mode);
 const initial=await page.evaluate(()=>({lcpMs:window.measuredLCP,bytes:performance.getEntriesByType('resource').reduce((n,r)=>n+r.transferSize,0),stats:globalThis.santensorExperience.stats()}));
 const scenes=[];
 for(const scene of [0,1,2,3,4]){const start=performance.now();await page.locator(`.scene-nav [data-go="${scene}"]`).click();await page.waitForFunction(n=>Math.abs(globalThis.santensorExperience.progress-n)<.01,scene);scenes.push({scene,automationNavigationMs:performance.now()-start,stats:await page.evaluate(()=>globalThis.santensorExperience.stats())});}
 let backend=null;if(mode==='webgl')backend=await page.evaluate(()=>{const g=document.createElement('canvas').getContext('webgl2');const i=g.getExtension('WEBGL_debug_renderer_info');const r=i?g.getParameter(i.UNMASKED_RENDERER_WEBGL):'unavailable';g.getExtension('WEBGL_lose_context')?.loseContext();return r;});
 results.push({requestedMode:mode,observedMode:initial.stats.mode,viewport:{width:1440,height:900},initial,scenes,backend,physicalGPU:false,notes:'Local Chromium; navigation timings include automation and are not render-frame benchmarks. CSS fallback metrics are not WebGL metrics.'});await context.close();
}
await browser.close();await writeFile('evidence/v4.1/graphics.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results.map(r=>({mode:r.observedMode,initial:r.initial,backend:r.backend}))));
