import {catalogs} from './i18n.mjs';
import {cinematicCopy} from './cinematic-copy.mjs';
import {mountOperation} from './cinematic-operation.mjs';
const home = document.querySelector('[data-journey]');
let language=document.documentElement.lang;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
let progress=home?0:4, world, raf=0;
let operation;
let contextScene=-1,contextSelection=-1;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
function requestRender(){if(!raf)raf=requestAnimationFrame(render);}
function render(){
 raf=0;
 if(home){
  progress=clamp(scrollY/(innerHeight*1.6),0,4);
  const index=Math.round(progress),operating=progress>2.65;
  const reveal=clamp((progress-2.3)/.65);
  const isOperation=index===3;
  document.body.classList.toggle('operating',isOperation);
  document.body.classList.toggle('results-view',index===4);
  home.style.setProperty('--app',String(reveal));
  if(index!==contextScene){contextScene=index;contextSelection=-1;renderContext();}
  home.dataset.progress=progress.toFixed(4);
  document.querySelector('.experience').dataset.scene=index;
  document.querySelectorAll('[data-copy]').forEach((el,i)=>{el.classList.toggle('active',i===index);el.inert=i!==index;el.setAttribute('aria-hidden',String(i!==index));});
  document.querySelector('[data-scene-count]').textContent=`0${index+1}`;
  const names=language==='es'?['El archivo','Interpretación','Inteligencia','Operación','Evidencia']:['The archive','Understanding','Intelligence','Operation','Evidence'];
  document.querySelector('[data-scene-name]').textContent=names[index];
  document.querySelectorAll('.scene-nav a').forEach((el,i)=>{if(i===index)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});
  const mobile=innerWidth<700;
  const poses=mobile?[
   [[.36,.62,.48,-25],[.59,.65,.48,-30],[.8,.67,.48,-35]],
   [[.2,.62,.5,-20],[.52,.65,.56,0],[.84,.62,.5,20]],
   [[.2,.62,.42,-18],[.52,.65,.55,0],[.84,.62,.42,18]],
   [[.5,.6,1,0],[1.6,.6,1,0],[2.7,.6,1,0]],
   [[.2,.68,.4,-10],[.5,.7,.45,0],[.8,.68,.4,10]]
  ]:[
   [[.57,.55,.58,-28],[.69,.54,.58,-28],[.81,.53,.58,-28]],
   [[.5,.58,.72,-18],[.68,.5,.7,-8],[.85,.59,.65,10]],
   [[.48,.59,.64,-18],[.67,.48,.72,0],[.84,.6,.62,18]],
   [[.205,.57,1,0],[.5,.57,1,0],[.795,.57,1,0]],
   [[.17,.6,.75,-8],[.48,.65,.7,5],[.8,.61,.65,8]]
  ];
  const idx=Math.min(3,Math.floor(progress));let t=progress-idx;t=t*t*(3-2*t);
  document.querySelectorAll('[data-surface]').forEach((el,i)=>{
   const a=poses[idx][i],b=poses[idx+1][i],p=a.map((n,k)=>n+(b[k]-n)*t);
   if(mobile&&isOperation){p[0]+=(0-(operation?.panel??0))*1.1;}
   const interactive=isOperation&&operating&&(!mobile||i===(operation?.panel??0));
   el.querySelector('.surface-app').inert=!interactive;
   el.style.pointerEvents=interactive?'auto':'none';
   el.setAttribute('aria-hidden',String(!interactive));
   el.style.transform=`translate(-50%,-50%) translate(${p[0]*innerWidth}px,${p[1]*innerHeight}px) rotateY(${p[3]}deg) rotateX(${operating?0:3}deg) scale(${p[2]})`;
   el.dataset.pose=p.map(x=>x.toFixed(4)).join(',');
  });
  const tabs=document.querySelector('[data-operation-tabs]');tabs.hidden=!isOperation;
  tabs.querySelectorAll('button').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===(operation?.panel??0))));
  document.querySelector('[data-disclosure]').textContent=cinematicCopy[language][isOperation?'executable':'conceptual'];
 }
 const state=operation?.run;
 world?.render(reduced.matches?Math.round(progress):progress,state?.stage??0,state?.failed??false);
}
function renderContext(){
 if(!home)return;
 const copy=cinematicCopy[language],section=contextScene===1?'understanding':contextScene===2?'integration':null;
 const actions=document.querySelector('[data-context-actions]');
 actions.inert=!section;actions.setAttribute('aria-hidden',String(!section));
 actions.innerHTML=section?copy[section].map((item,i)=>`<button data-context="${i}" aria-expanded="${i===contextSelection}"><span class="mono">0${i+1}</span> ${item[0]} <span aria-hidden="true">+</span></button>`).join(''):'';
 const inspector=document.querySelector('.context-inspector');inspector.hidden=contextSelection<0||!section;
 if(section&&contextSelection>=0){const item=copy[section][contextSelection];inspector.innerHTML=`<button data-context-close aria-label="${copy.close}">×</button><p class="eyebrow">${item[2]}</p><h3>${item[0]}</h3><p>${item[1]}</p>`;}
}
document.addEventListener('click',event=>{
 const inspect=event.target.closest('[data-context]');if(inspect){contextSelection=contextSelection===Number(inspect.dataset.context)?-1:Number(inspect.dataset.context);renderContext();}
 if(event.target.closest('[data-context-close]')){const old=contextSelection;contextSelection=-1;renderContext();document.querySelector(`[data-context="${old}"]`)?.focus();}
});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&contextSelection>=0){const old=contextSelection;contextSelection=-1;renderContext();document.querySelector(`[data-context="${old}"]`)?.focus();}});
document.addEventListener('click',event=>{const link=event.target.closest('[data-go]');if(!home||!link)return;event.preventDefault();const p=Number(link.dataset.go);history.replaceState(null,'',`#scene-${p}`);scrollTo({top:p*innerHeight*1.6,behavior:'instant'});requestRender();});
addEventListener('scroll',requestRender,{passive:true});
addEventListener('resize',()=>{world?.resize();requestRender();});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)requestRender();});
document.querySelectorAll('[data-language]').forEach(link=>link.addEventListener('click',()=>{try{localStorage.setItem('santensor-language',link.dataset.language);}catch{}if(location.hash)link.hash=location.hash;}));
requestRender();
if(home||document.querySelector('[data-standalone-lab]'))operation=mountOperation({language,onChange:requestRender});
if(!reduced.matches&&!new URLSearchParams(location.search).has('graphics-off')){
 import('./vendor/cinematic-world.bundle.mjs').then(({createWorld})=>{world=createWorld(document.querySelector('#optical-world'),()=>document.body.classList.add('graphics-fallback'));requestRender();}).catch(()=>document.body.classList.add('graphics-fallback'));
}else document.body.classList.add('graphics-fallback');
globalThis.santensorExperience={get progress(){return progress;},get operation(){return operation?.state;},stats:()=>world?.stats()??{mode:'css-fallback'}};
