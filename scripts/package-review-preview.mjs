import {cp,mkdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';

const target = path.resolve('.local/v3-share');
await mkdir(target,{recursive:true});
await cp('dist',target,{recursive:true,filter:source => path.basename(source) !== 'CNAME'});
const manifest = JSON.parse(await readFile('evidence/v3/manifest.json','utf8'));
for (const entry of [...manifest.files,{path:'manifest.json'}]) {
 const destination = path.join(target,'review',entry.path);
 await mkdir(path.dirname(destination),{recursive:true});
 await cp(path.join('evidence/v3',entry.path),destination);
}
const gallery = path.join(target,'review/index.html');
await writeFile(gallery,(await readFile(gallery,'utf8')).replaceAll('http://127.0.0.1:4173',''));
await writeFile(path.join(target,'robots.txt'),'User-agent: *\nDisallow: /\n');
console.log(`Isolated static review package: ${target}`);
