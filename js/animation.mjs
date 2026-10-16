function loadScript(filename) {
 return new Promise((resolve, reject) => {
  const script = document.createElement('script');
  script.src = new URL(`./vendor/${filename}`, import.meta.url).href;
  script.onload = resolve;
  script.onerror = reject;
  document.head.append(script);
 });
}

await loadScript('gsap.min.js');
export const gsap = globalThis.gsap;
let scrollTrigger;
export async function loadScrollTrigger() {
 scrollTrigger ??= loadScript('ScrollTrigger.min.js');
 await scrollTrigger;
 return globalThis.ScrollTrigger;
}
