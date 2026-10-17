import {cp,mkdir,readFile,readdir,rm,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
// Reuse the already authorized V4 preview server/tunnel; never serve the checkout.
const target=path.resolve('.local/v4-share');
if(path.dirname(target)!==path.resolve('.local')||path.basename(target)!=='v4-share')throw Error('Unexpected preview target');
await rm(target,{recursive:true,force:true});await mkdir(target,{recursive:true});
await cp('dist',target,{recursive:true,filter:p=>path.basename(p)!=='CNAME'});
async function noindex(dir){for(const e of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())await noindex(p);else if(p.endsWith('.html')){const html=(await readFile(p,'utf8')).replace(/<meta name="robots"[^>]*>/g,'');await writeFile(p,html.replace('</head>','<meta name="robots" content="noindex,nofollow"></head>'));}}}
await noindex(target);await writeFile(path.join(target,'robots.txt'),'User-agent: *\nDisallow: /\n');
await mkdir(path.join(target,'review'),{recursive:true});
const files=[
 ['before/home-en.png','Before / EN'],['before/home-es.png','Antes / ES'],
 ...['en','es'].flatMap(l=>['home-1440','home-390','cases-1440','contact-390','review-1440','review-360'].map(n=>[`production/${l}-${n}.png`,`${l.toUpperCase()} / ${n}`])),
 ['production/lab-result-en.png','Laboratory result / EN'],['production/lab-result-es.png','Resultado del laboratorio / ES'],
 ['tour/video/desktop.webm','Desktop recording'],['tour/video/mobile.webm','Mobile emulation recording']
];
for(const [file]of files){await mkdir(path.dirname(path.join(target,'review',file)),{recursive:true});await cp('evidence/v4.1/'+file,path.join(target,'review',file));}
await writeFile(path.join(target,'review/index.html'),`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Santensor V4.1 review</title><link rel="stylesheet" href="/css/cinematic.css"></head><body><main class="route-content"><h1>V4.1 / Review</h1><p>Before and after, real browser captures and recordings. Mobile sizes and touch are emulated; physical hardware, virtual keyboards and screen readers remain pending. Professional identity is pending confirmation. Production has not changed.</p><nav class="recovery-languages"><a href="/">English preview</a><a href="/es/" lang="es">Preview en español</a><a href="/version.json">Commit</a></nav>${files.map(([file,label])=>`<section><h2 style="font-size:28px">${label}</h2>${file.endsWith('.webm')?`<video controls preload="metadata" style="max-width:100%;max-height:80vh" src="${file}"></video>`:`<a href="${file}"><img loading="lazy" style="width:100%;max-width:1000px;height:auto" src="${file}" alt="${label}"></a>`}</section>`).join('')}</main></body></html>`);
await writeFile(path.join(target,'version.json'),JSON.stringify({branch:'feat/santensor-v4-ux-hardening',commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),purpose:'V4.1 editorial and functional review',production:false},null,2));
console.log('Isolated V4.1 review ready at existing preview root.');
