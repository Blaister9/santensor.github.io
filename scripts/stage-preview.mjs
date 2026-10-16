import {readFile,writeFile,mkdir,cp,readdir} from 'node:fs/promises';
import path from 'node:path';
// Publish the public static candidate inside the already-authorized isolated trainer staging service.
// No additional Railway service, DNS or live GitHub Pages configuration is changed.
const target=path.resolve('../trainer/santensor-interview-v1/public/commercial-preview');
await mkdir(target,{recursive:true});
for(const f of ['index.html','404.html','favicon.svg','robots.txt','sitemap.xml'])await cp(`dist/${f}`,`${target}/${f}`);
for(const d of ['css','js','labs','cases','privacy','assets'])await cp(`dist/${d}`,`${target}/${d}`,{recursive:true});
async function rewrite(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const f=path.join(dir,entry.name);if(entry.isDirectory())await rewrite(f);else if(entry.name.endsWith('.html')){let html=await readFile(f,'utf8');html=html.replaceAll('href="/','href="/commercial-preview/').replaceAll('src="/','src="/commercial-preview/');await writeFile(f,html);}}}
await rewrite(target);await writeFile(`${target}/PREVIEW.txt`,'Public static marketing candidate only. Original santensor.com deployment unchanged. Generated from site/dist.\n');
console.log('Preview copied to the existing isolated trainer service; production CNAME and DNS untouched.');
