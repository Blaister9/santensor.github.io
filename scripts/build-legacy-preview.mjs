import {mkdir,cp,writeFile} from 'node:fs/promises';
import {renderLegacyPage} from './render-pages.mjs';
import {routeFor} from '../js/i18n.mjs';

const root = '.local/v2-reconstructed';
await mkdir(root,{recursive:true});
for (const folder of ['assets','css','js']) await cp(folder,`${root}/${folder}`,{recursive:true});
for (const language of ['en','es']) {
 for (const page of ['', 'labs', 'cases', 'contact', 'privacy']) {
  const directory = `${root}${routeFor(language,page)}`;
  await mkdir(directory,{recursive:true});
  await writeFile(`${directory}/index.html`,renderLegacyPage(language,page));
 }
 await writeFile(`${root}/${language === 'es' ? 'es/' : ''}404.html`,renderLegacyPage(language,'notfound'));
}
await cp('favicon.svg',`${root}/favicon.svg`);
console.log(`Legacy visual reconstruction: ${root}. The original capture used the untouched 4b94f81 build.`);
