import {gsap, loadScrollTrigger} from './animation.mjs';
import {storyCopy} from './story-copy.mjs';

const ScrollTrigger = await loadScrollTrigger();
gsap.registerPlugin(ScrollTrigger);
const root = document.querySelector('[data-story]');
const copy = storyCopy[document.documentElement.lang === 'es' ? 'es' : 'en'];
const chapters = [...root.querySelectorAll('[data-chapter]')];
const states = ['waiting', 'interpret', 'policy', 'validate', 'error', 'recovered', 'review', 'recorded'];
const media = gsap.matchMedia();

function activate(act, state) {
 root.dataset.act = String(act);
 root.dataset.storyState = states[state];
 root.querySelector('[data-act-number]').textContent = `0${act + 1}`;
 root.querySelector('[data-story-status]').textContent = copy.states[state];
 root.querySelectorAll('[data-component]').forEach((node, index) => {
  const reached = [1, 2, 3, 6, 7][index];
  node.dataset.state = state === 4 && index === 2 ? 'error' : state > reached ? 'complete' : state === reached ? 'active' : 'waiting';
 });
 root.querySelectorAll('[data-trace]').forEach((entry,index) => entry.classList.toggle('is-recorded', index <= (state === 4 ? 2 : state > 4 ? state - 1 : state)));
}

media.add({desktop: '(min-width: 1100px) and (min-height: 700px)', motion: '(prefers-reduced-motion: no-preference)'}, context => {
 if (!context.conditions.desktop || !context.conditions.motion) {
  const observer = new IntersectionObserver(entries => {
   for (const entry of entries) if (entry.isIntersecting) activate(Number(entry.target.dataset.chapter), [0, 3, 7][Number(entry.target.dataset.chapter)]);
  }, {rootMargin: '-20% 0px -35% 0px'});
  chapters.forEach(chapter => observer.observe(chapter));
  return () => observer.disconnect();
 }
 root.classList.add('is-pinned-story');
 const select = gsap.utils.selector(root);
 const wires = select('[data-story-wire]');
 gsap.set(wires, {strokeDasharray: 1, strokeDashoffset: 1});
 gsap.set(select('.story-component'), {opacity: .16});
 gsap.set(select('.story-orbit'), {opacity: .1});
 gsap.set(select('.document-0'), {x: 65, y: 110, rotation: -12, transformOrigin: '50% 50%'});
 gsap.set(select('.document-1'), {x: 460, y: 40, rotation: 9, transformOrigin: '50% 50%'});
 gsap.set(select('.document-2'), {x: 190, y: 410, rotation: -7, transformOrigin: '50% 50%'});
 gsap.set(select('.story-packet'), {opacity: 0});
 let previousState = -1;
 const clock = {progress: 0};
 const timeline = gsap.timeline({defaults: {ease: 'none'}, scrollTrigger: {
  id: 'santensor-story', trigger: root, start: 'top top', end: () => `+=${Math.round(innerHeight * 3.3)}`, pin: root.querySelector('.story-pin'), scrub: true, invalidateOnRefresh: true,
  onRefresh: trigger => {root.dataset.scrollStart = String(trigger.start); root.dataset.scrollEnd = String(trigger.end);}
 }});
 timeline.to(clock, {progress: 1, duration: 10, onUpdate() {
  const progress = clock.progress;
  const act = progress < .32 ? 0 : progress < .68 ? 1 : 2;
  const state = progress < .22 ? 0 : progress < .40 ? 1 : progress < .52 ? 2 : progress < .68 ? 3 : progress < .75 ? 4 : progress < .81 ? 5 : progress < .91 ? 6 : 7;
  root.style.setProperty('--story-progress', progress);
  root.dataset.progress = progress.toFixed(3);
  chapters.forEach((chapter,index) => {chapter.inert = index !== act; chapter.setAttribute('aria-hidden', String(index !== act));});
  if (state !== previousState) {activate(act, state); previousState = state;}
  else root.dataset.act = String(act);
  root.querySelector('[data-act-number]').textContent = `0${act + 1}`;
 }}, 0);
 timeline.to(select('.story-document'), {x: 24, y: index => 110 + index * 150, rotation: 0, duration: 2, stagger: .18}, .5)
  .to(select('.story-orbit'), {opacity: 1, duration: 4}, 2)
  .to(select('.component-0'), {opacity: 1, duration: .5}, 2.2)
  .to(wires.slice(0,3), {strokeDashoffset: 0, duration: 1.2, stagger: .15}, 2.4)
  .to(select('.component-1'), {opacity: 1, duration: .5}, 4)
  .to(wires[3], {strokeDashoffset: 0, duration: 1}, 3.9)
  .to(select('.component-2'), {opacity: 1, duration: .5}, 5.2)
  .to(wires[4], {strokeDashoffset: 0, duration: 1.1}, 5.1)
  .to(select('.story-document'), {opacity: .45, duration: 1}, 5.5)
  .to(select('.component-3'), {opacity: 1, duration: .4}, 8.1)
  .to(wires[5], {strokeDashoffset: 0, duration: .8}, 8.1)
  .to(select('.component-4'), {opacity: 1, duration: .4}, 9.1)
  .to(wires[6], {strokeDashoffset: 0, duration: .8}, 9.1);
 const packet = select('.story-packet');
 function travel(path, start, duration) {
  const position = {value: 0};
  timeline.to(position, {value: 1, duration, onUpdate() {
   const point = path.getPointAtLength(position.value * path.getTotalLength());
   gsap.set(packet, {x: point.x, y: point.y});
  }}, start);
 }
 timeline.to(packet, {opacity: 1, duration: .1}, 2.4);
 travel(wires[0], 2.4, 1.4);
 travel(wires[3], 3.9, 1.1);
 travel(wires[4], 5.1, 1.5);
 timeline.to(packet, {opacity: 0, duration: .1}, 6.7).to(packet, {opacity: 1, duration: .1}, 8.1);
 travel(wires[5], 8.1, .9);
 travel(wires[6], 9.1, .8);
 timeline.to(packet, {opacity: 0, duration: .1}, 9.9);
 const skip = root.querySelector('a[href="#lab-entry"]');
 const exitStory = event => {
  event.preventDefault();
  window.scrollTo({top: timeline.scrollTrigger.end + innerHeight, behavior: 'instant'});
  document.querySelector('#lab-entry').focus({preventScroll: true});
 };
 skip.addEventListener('click', exitStory);
 activate(0,0);
 return () => {
  skip.removeEventListener('click', exitStory);
  root.classList.remove('is-pinned-story');
  delete root.dataset.scrollStart;
  delete root.dataset.scrollEnd;
  chapters.forEach(chapter => {chapter.inert = false; chapter.removeAttribute('aria-hidden');});
 };
});

document.fonts.ready.then(() => ScrollTrigger.refresh());
