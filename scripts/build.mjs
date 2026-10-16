import {mkdir,copyFile,cp,readFile} from 'node:fs/promises';
import {renderPages} from './render-pages.mjs';
await mkdir('assets/fonts',{recursive:true});
for(const [family,weight] of [['space-grotesk',500],['inter',400],['ibm-plex-mono',400]]){
 await copyFile(`node_modules/@fontsource/${family}/files/${family}-latin-${weight}-normal.woff2`,`assets/fonts/${family}-latin-${weight}-normal.woff2`);
 await copyFile(`node_modules/@fontsource/${family}/LICENSE`,`assets/fonts/${family}-LICENSE.txt`);
}
await renderPages();
await mkdir('dist',{recursive:true});
for(const f of ['index.html','CNAME','robots.txt','sitemap.xml','favicon.svg','404.html'])await copyFile(f,`dist/${f}`);
for(const d of ['css','js','labs','cases','privacy','contact','es','assets'])await cp(d,`dist/${d}`,{recursive:true});
if((await readFile('dist/CNAME','utf8')).trim()!=='santensor.com')throw new Error('CNAME must remain santensor.com');
console.log('Static build verified; CNAME preserved. No runtime server needed on GitHub Pages.');
