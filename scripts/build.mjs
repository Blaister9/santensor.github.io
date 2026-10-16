import {mkdir,copyFile,cp,readFile} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
for(const f of ['index.html','CNAME','robots.txt','sitemap.xml','favicon.svg','404.html'])await copyFile(f,`dist/${f}`);
for(const d of ['css','js','labs','cases','privacy','assets'])await cp(d,`dist/${d}`,{recursive:true});
if((await readFile('dist/CNAME','utf8')).trim()!=='santensor.com')throw new Error('CNAME must remain santensor.com');
console.log('Static build verified; CNAME preserved. No runtime server needed on GitHub Pages.');
