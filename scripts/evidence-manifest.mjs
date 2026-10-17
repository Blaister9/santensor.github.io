import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const version=JSON.parse(await readFile('evidence/v2/preview-version.json','utf8'));
const screenshots=[];
for(const language of ['en','es'])for(const [width,height] of [[1440,900],[390,844]]){
 const file=`preview/home-${language}-${width}.png`;
 const bytes=await readFile(`evidence/v2/${file}`);
 const measured={width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20)};
 if(measured.width!==width||measured.height!==height)throw new Error(`Unexpected image size: ${file}`);
 screenshots.push({file,url:`https://trainer-web-production-f2e9.up.railway.app/commercial-preview/${language==='es'?'es/':''}`,viewport:measured,sha256:createHash('sha256').update(bytes).digest('hex')});
}
await writeFile('evidence/v2/manifest.json',JSON.stringify({generatedAt:new Date().toISOString(),tool:'Playwright Chromium',siteCommit:version.siteCommit,screenshots},null,2));
console.log('Verified four preview screenshots: EN/ES, 1440×900 and 390×844.');
