import {catalogs} from './i18n.mjs';
import {createRun, stepRun} from './workflow.mjs';

const language = document.documentElement.lang === 'es' ? 'es' : 'en';
const copy = catalogs[language];
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-navigation');
if (menu && navigation) {
 menu.hidden = false;
 const closeMenu = () => {menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', copy.nav.menu); navigation.classList.remove('is-open');};
 menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? copy.nav.close : copy.nav.menu);
  navigation.classList.toggle('is-open', open);
 });
 navigation.addEventListener('click', event => {if (event.target.closest('a')) closeMenu();});
 document.addEventListener('keydown', event => {if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {closeMenu(); menu.focus();}});
}
document.querySelectorAll('[data-language]').forEach(link => link.addEventListener('click', () => {
 try {localStorage.setItem('santensor-language', link.dataset.language);} catch {}
 if (location.hash) link.hash = location.hash;
}));
try {localStorage.setItem('santensor-language', language);} catch {}

document.querySelectorAll('[data-orchestrator]').forEach(mountOrchestrator);
import('./motion.mjs').catch(() => {});
if (document.querySelector('[data-story]')) import('./story.mjs').catch(() => {});

function mountOrchestrator(root) {
 const labels = copy.lab;
 const find = selector => root.querySelector(selector);
 let scenario = 'success';
 let state = createRun(labels.fixtures[0]);
 let inspected = 0;
 let timer;
 let running = false;
 let paused = false;
 const textarea = find('[data-request]');
 const scenarioSelect = find('[data-scenario]');
 if (textarea) textarea.value = labels.fixtures[0];
 function stop() {clearTimeout(timer); running = false;}
 function reset() {
  stop();
  try {state = createRun(textarea?.value ?? labels.fixtures[0], scenario); inspected = 0; paused = false; find('[data-error]').textContent = ''; render();}
  catch {find('[data-error]').textContent = labels.invalid; render();}
 }
 function move(action) {
  try {
   state = stepRun(state, action);
   inspected = state.stage;
   find('[data-error]').textContent = '';
   if (state.failed || state.stage >= 4) stop();
   render();
  } catch {stop(); find('[data-error]').textContent = labels.humanNote; render();}
 }
 function tick() {
  if (!running) return;
  move();
  if (running) timer = setTimeout(tick, 1050);
 }
 find('[data-run]').addEventListener('click', () => {if (running) return; running = true; paused = false; render(); timer = setTimeout(tick, 750);});
 find('[data-pause]').addEventListener('click', () => {stop(); paused = true; render();});
 find('[data-step]').addEventListener('click', () => {stop(); paused = false; move();});
 find('[data-reset]').addEventListener('click', reset);
 find('[data-load]')?.addEventListener('click', reset);
 for (const action of ['approve', 'reject', 'correct', 'retry']) find(`[data-${action}]`).addEventListener('click', () => {stop(); move(action);});
 scenarioSelect?.addEventListener('change', () => {scenario = scenarioSelect.value; textarea.value = labels.fixtures[['success', 'ambiguous', 'failure'].indexOf(scenario)]; reset();});
 const nodes = [...root.querySelectorAll('[data-node]')];
 nodes.forEach(node => node.addEventListener('click', () => {
  inspected = Number(node.dataset.node); render();
  const inspector = find('[data-inspector]');
  if (inspector.tagName === 'DETAILS') inspector.open = true;
 }));
 root.querySelector('[data-timeline]')?.addEventListener('keydown', event => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const current = Number(event.target.dataset.node ?? 0);
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? 5 : Math.max(0, Math.min(5, current + (event.key === 'ArrowRight' ? 1 : -1)));
  root.querySelector(`[data-timeline] [data-node="${next}"]`).focus();
 });
 function render() {
  root.dataset.stage = state.stage;
  root.dataset.running = String(running);
  root.dataset.failed = String(state.failed);
  root.dataset.paused = String(paused);
  const circuit = find('.circuit');
  if (running && !matchMedia('(prefers-reduced-motion: reduce)').matches) circuit.unpauseAnimations();
  else circuit.pauseAnimations();
  root.dataset.progress = String(state.stage / 5);
  root.style.setProperty('--execution-progress', state.stage / 5);
  const status = state.failed ? labels.error : state.stage === 5 ? labels.done : state.stage === 4 ? labels.reviewNeeded : running ? labels.running : paused ? labels.paused : labels.ready;
  find('[data-status]').textContent = status;
  find('[data-current]').textContent = `${String(state.stage + 1).padStart(2, '0')} / ${labels.stages[state.stage]}`;
  find('[data-run]').disabled = running || state.failed || state.stage >= 4;
  find('[data-pause]').disabled = !running;
  find('[data-step]').disabled = running || state.failed || state.stage >= 4;
  find('[data-retry]').hidden = !state.failed;
  find('[data-review]').hidden = state.stage !== 4;
  find('[data-approve]').disabled = state.policy !== 'review';
  find('[data-correct]').hidden = state.policy !== 'triage';
  find('[data-review-hint]').textContent = state.policy === 'triage' ? labels.correctionHint : labels.humanNote;
  nodes.forEach(node => {
   const index = Number(node.dataset.node);
   const nodeState = index < state.stage || state.stage === 5 && index === 5 ? 'complete' : index > state.stage ? 'waiting' : state.failed ? 'error' : state.stage === 4 ? 'review' : running ? 'running' : paused ? 'paused' : 'ready';
   node.dataset.nodeState = nodeState;
   node.classList.toggle('is-active', index === state.stage);
   node.classList.toggle('is-complete', index < state.stage);
   node.setAttribute('aria-pressed', String(index === inspected));
   node.setAttribute('aria-label', `${labels.nodeLabel}: ${labels.stages[index]} — ${copy.story.labStates[nodeState]}`);
   if (node.classList.contains('system-node')) {
    let badge = node.querySelector('.node-state');
    if (!badge) {badge = document.createElement('span'); badge.className = 'node-state'; node.append(badge);}
    badge.textContent = copy.story.labStates[nodeState];
   }
  });
  root.querySelectorAll('[data-wire]').forEach(wire => {
   wire.classList.toggle('is-traversed', Number(wire.dataset.wire) < state.stage);
   wire.classList.toggle('is-flowing', Number(wire.dataset.wire) === state.stage && running);
   wire.classList.toggle('is-error', Number(wire.dataset.wire) === 2 && state.failed);
  });
  root.querySelectorAll('[data-packet]').forEach(packet => packet.setAttribute('visibility', Number(packet.dataset.packet) === state.stage && running ? 'visible' : 'hidden'));
  find('[data-inspect-title]').textContent = `${String(inspected + 1).padStart(2, '0')} / ${labels.stages[inspected]}`;
  find('[data-inspect-description]').textContent = labels.stageDescriptions[inspected];
  const snapshot = state.snapshots[inspected];
  const evidence = find('[data-evidence]');
  evidence.replaceChildren();
  if (!snapshot) evidence.textContent = labels.waiting;
  else {
   const values = inspected === 0 ? {time: snapshot.receivedAt, text: snapshot.text}
    : inspected === 1 ? snapshot.fields
    : inspected === 2 ? {policy: snapshot.policy, reference: snapshot.fields.reference}
    : inspected === 3 ? {auth: snapshot.tool.auth, request: JSON.stringify(snapshot.tool.request), status: snapshot.tool.status, response: snapshot.tool.response ? `${snapshot.tool.response.reference} / ${labels.values[snapshot.tool.response.owner]}` : labels.values.none}
    : inspected === 4 ? {policy: snapshot.policy, category: snapshot.fields.category}
    : {record: snapshot.result.id, outcome: snapshot.result.outcome, owner: snapshot.result.owner};
   for (const [key, value] of Object.entries(values)) {
    const row = document.createElement('div');
    const term = document.createElement('dt'); term.textContent = labels.fields[key] ?? key;
    const description = document.createElement('dd'); description.textContent = labels.values[value] ?? value ?? labels.values.none;
    row.append(term, description); evidence.append(row);
   }
  }
  const log = find('[data-events]');
  log.replaceChildren(...state.events.map(event => {const item = document.createElement('li'); item.textContent = `${String(event.sequence).padStart(2, '0')}  ${labels.eventText[event.code]}`; return item;}));
 }
 document.addEventListener('visibilitychange', () => {if (document.hidden && running) {stop(); paused = true; render();}});
 render();
}
