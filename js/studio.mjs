import {studioCopy} from './v3-copy.mjs';
import {catalogs} from './i18n.mjs';
import {createRun, stepRun} from './workflow.mjs';

const language = document.documentElement.lang === 'es' ? 'es' : 'en';
const copy = studioCopy[language];
const story = document.querySelector('[data-v3-story]');
if (story) {
 const media = matchMedia('(min-width: 1100px) and (min-height: 740px) and (prefers-reduced-motion: no-preference)');
 const chapters = [...story.querySelectorAll('[data-v3-chapter]')];
 const links = [...story.querySelectorAll('[data-chapter-link]')];
 let frame;
 let suspended = false;
 function select(act) {
  story.dataset.act = String(act);
  chapters.forEach((chapter,index) => {chapter.hidden = index !== act;});
  links.forEach((link,index) => {
   if (index === act) link.setAttribute('aria-current','step');
   else link.removeAttribute('aria-current');
  });
  if (!media.matches) story.style.setProperty('--narrative-progress', (act + 1) / 3);
 }
 function update() {
  frame = undefined;
  if (!media.matches || suspended) return;
  const bounds = story.getBoundingClientRect();
  const distance = Math.max(1, bounds.height - innerHeight);
  const progress = Math.max(0, Math.min(1, -bounds.top / distance));
  story.style.setProperty('--narrative-progress', progress);
  story.dataset.progress = progress.toFixed(3);
  select(progress < .33 ? 0 : progress < .68 ? 1 : 2);
 }
 function schedule() {if (!frame) frame = requestAnimationFrame(update);}
 function mode() {story.classList.toggle('is-scroll-story',media.matches); suspended = false; schedule();}
 links.forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  const act = Number(link.dataset.chapterLink);
  select(act);
  if (media.matches) {
   suspended = true;
   const start = scrollY + story.getBoundingClientRect().top;
   const distance = story.offsetHeight - innerHeight;
   window.scrollTo({top: start + distance * [0,.5,.95][act], behavior: 'instant'});
   suspended = false;
   schedule();
  }
 }));
 story.querySelector('a[href="#lab-entry"]').addEventListener('click', event => {
  event.preventDefault();
  const lab = document.querySelector('#lab-entry');
  lab.scrollIntoView({behavior:'instant',block:'start'});
  lab.focus({preventScroll:true});
 });
 window.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('resize',schedule,{passive:true});
 media.addEventListener('change',mode);
 mode();
 document.fonts.ready.then(schedule);
}

const bench = document.querySelector('.workbench-desk');
if (bench) {
 const buttons = [...bench.querySelectorAll('[data-bench-doc]')];
 const documents = [
  [copy.inbox, copy.subject, copy.message],
  [copy.document, copy.attachment, `${copy.reference}: NS-204. ${copy.owner}.`],
  [copy.rules, copy.rule, copy.noteSub]
 ];
 const runButton = bench.querySelector('[data-bench-run]');
 buttons.forEach(button => button.addEventListener('click', () => {
  buttons.forEach(item => item.setAttribute('aria-pressed',String(item === button)));
  const selected = documents[Number(button.dataset.benchDoc)];
  for (const [index,key] of ['kind','title','body'].entries()) bench.querySelector(`[data-bench-${key}]`).textContent = selected[index];
 }));
 runButton.addEventListener('click', () => {
  let run = createRun(catalogs[language].lab.fixtures[0]);
  while (run.stage < 4) run = stepRun(run);
  bench.dataset.stage = String(run.stage);
  bench.querySelector('[data-bench-status]').textContent = copy.rule;
  runButton.textContent = `${copy.match} ✓`;
  runButton.disabled = true;
 });
}
