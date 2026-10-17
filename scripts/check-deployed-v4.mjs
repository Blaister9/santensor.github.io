import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const expected=process.argv[2];if(!/^[0-9a-f]{40}$/.test(expected??''))throw new Error('Pass the expected deployed commit SHA');
const base='https://santensor.com';
const manifestResponse=await fetch(`${base}/release.json?verify=${expected}`,{cache:'no-store'});assert.equal(manifestResponse.status,200);
const release=await manifestResponse.json();assert.equal(release.commit,expected);assert.equal(release.mode,'production');
const paths=['/','/es/','/css/cinematic.css','/js/cinematic.mjs','/js/contact.mjs','/js/vendor/cinematic-world.bundle.mjs'];
const hashes=await Promise.all(paths.map(async pathname=>{
 const response=await fetch(`${base}${pathname}?verify=${expected}`,{cache:'no-store'});assert.equal(response.status,200,pathname);
 const remote=(await response.text()).replaceAll('\r\n','\n'),file=`dist${pathname.endsWith('/')?pathname+'index.html':pathname}`;
 const local=(await readFile(file,'utf8')).replaceAll('\r\n','\n');assert.equal(remote,local,`${pathname} differs from the verified production build`);
 if(pathname.endsWith('/'))assert.ok(!/preview-label|DESIGN PREVIEW|PREVIEW PARA|trycloudflare|data-editorial-placeholder/.test(remote));
 return {path:pathname,status:response.status,sha256:createHash('sha256').update(remote).digest('hex'),matchesVerifiedBuild:true};
}));
const result={at:new Date().toISOString(),origin:base,release,hashes,tunnelRequired:false,limits:'HTTPS checked from the execution computer, not a physical mobile device or an independent field network.'};
await writeFile('evidence/v4-production/deployed-version.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
