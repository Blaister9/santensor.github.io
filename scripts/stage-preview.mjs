import {readFile,writeFile,mkdir,cp,readdir} from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
// Publish the public static candidate inside the already-authorized isolated trainer staging service.
// No additional Railway service, DNS or live GitHub Pages configuration is changed.
const target=path.resolve('../trainer/public/commercial-preview');
await mkdir(target,{recursive:true});
for(const f of ['index.html','404.html','favicon.svg','robots.txt','sitemap.xml'])await cp(`dist/${f}`,`${target}/${f}`);
for(const d of ['css','js','labs','cases','privacy','contact','es','assets'])await cp(`dist/${d}`,`${target}/${d}`,{recursive:true});
async function rewrite(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const f=path.join(dir,entry.name);if(entry.isDirectory())await rewrite(f);else if(entry.name.endsWith('.html')){let html=await readFile(f,'utf8');html=html.replaceAll('href="/','href="/commercial-preview/').replaceAll('src="/','src="/commercial-preview/').replace('<head>','<head><meta name="robots" content="noindex,nofollow">');await writeFile(f,html);}else if(entry.name.endsWith('.css')){const css=await readFile(f,'utf8');await writeFile(f,css.replaceAll("url('/","url('/commercial-preview/"));}}}
await rewrite(target);await writeFile(`${target}/PREVIEW.txt`,'Public static marketing candidate only. Original santensor.com deployment unchanged. Generated from site/dist.\n');
await writeFile(`${target}/version.json`,JSON.stringify({siteCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),branch:'feat/santensor-v2-experience-i18n',mode:'simulation'},null,2));
console.log('Preview copied to the existing isolated trainer service; production CNAME and DNS untouched.');
