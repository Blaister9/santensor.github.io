import {gsap} from './animation.mjs';
const media = gsap.matchMedia();
media.add('(prefers-reduced-motion: no-preference)', () => {
 const hero = document.querySelector('.hero');
 if (hero) {
  const timeline = gsap.timeline({defaults: {ease: 'power3.out'}});
  timeline.from('.hero .eyebrow', {y: 12, opacity: 0, duration: .45})
   .from('.hero h1', {y: 24, duration: .7}, .08)
   .from('.hero h1 em', {color: '#f3f5f0', duration: .9}, .2)
   .from('.hero-system', {y: 20, duration: .8}, .2)
   .from('.hero-actions, .hero-note', {y: 10, opacity: 0, duration: .45, stagger: .1}, .35);
 }
});

const expertiseLink = document.querySelector('#main-navigation a[href$="#capabilities"]');
const expertise = document.querySelector('#capabilities');
if (expertise && expertiseLink) {
 const observer = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) expertiseLink.setAttribute('aria-current', 'location');
  else expertiseLink.removeAttribute('aria-current');
 }, {threshold: .25});
 observer.observe(expertise);
}
