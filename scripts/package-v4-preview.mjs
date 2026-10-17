import {cp,mkdir,writeFile,readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
const target=path.resolve('.local/v4-share');
await mkdir(target,{recursive:true});await cp('dist',target,{recursive:true,filter:p=>path.basename(p)!=='CNAME'});
// Only public review artifacts enter the served copy. Git metadata, tools, tokens and local logs do not.
await cp('evidence/v4',path.join(target,'review'),{recursive:true,filter:p=>!p.endsWith('browser-results.json')});
await writeFile(path.join(target,'robots.txt'),'User-agent: *\nDisallow: /\n');
await writeFile(path.join(target,'version.json'),JSON.stringify({branch:'feat/santensor-v4-cinematic-continuous',commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),purpose:'V4 isolated visual review',production:false},null,2));
console.log(`Isolated review package: ${target}`);
