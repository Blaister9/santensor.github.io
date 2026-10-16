import {mkdir,copyFile,cp,readFile} from 'node:fs/promises';
import {renderPages} from './render-pages.mjs';
import {renderPage} from './render-pages.mjs';
import {assertPublishable} from './editorial-gate.mjs';
const preview = process.argv.includes('--preview') && process.env.NODE_ENV !== 'production';
if (!preview) assertPublishable(['en','es'].flatMap(language => ['', 'labs', 'cases', 'contact', 'privacy', 'concepts', 'concept-b'].map(page => ({path:`/${language}/${page}`,html:renderPage(language,page)}))));
await mkdir('assets/fonts',{recursive:true});
await mkdir('js/vendor', {recursive:true});
for (const filename of ['gsap.min.js', 'ScrollTrigger.min.js']) await copyFile(`node_modules/gsap/dist/${filename}`, `js/vendor/${filename}`);
await copyFile('node_modules/gsap/README.md', 'js/vendor/GSAP-NOTICE.md');
for(const [family,weight] of [['space-grotesk',500],['inter',400],['ibm-plex-mono',400]]){
 await copyFile(`node_modules/@fontsource/${family}/files/${family}-latin-${weight}-normal.woff2`,`assets/fonts/${family}-latin-${weight}-normal.woff2`);
 await copyFile(`node_modules/@fontsource/${family}/LICENSE`,`assets/fonts/${family}-LICENSE.txt`);
}
await renderPages();
await mkdir('dist',{recursive:true});
for(const f of ['index.html','CNAME','robots.txt','sitemap.xml','favicon.svg','404.html'])await copyFile(f,`dist/${f}`);
for(const d of ['css','js','labs','cases','privacy','contact','es','assets','concepts','concept-b'])await cp(d,`dist/${d}`,{recursive:true});
if((await readFile('dist/CNAME','utf8')).trim()!=='santensor.com')throw new Error('CNAME must remain santensor.com');
console.log('Static build verified; CNAME preserved. No runtime server needed on GitHub Pages.');
