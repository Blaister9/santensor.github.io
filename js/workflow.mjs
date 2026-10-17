// Deterministic, browser-local workflow. All fixtures are synthetic; no LLM or external API.
export const stages=['Received','Extracted','Classified','Lookup complete','Record created','Owner assigned','Notification drafted','Human review','Complete'];
export const examples={
 standard:'SYNTHETIC: Northstar Studio requests 8 developer accounts. Reference NS-204. Contact: buyer@example.invalid.',
 urgent:'SYNTHETIC: Northstar Studio reports a production outage. Reference NS-204. Please restore API access urgently. Contact: buyer@example.invalid.',
 unknown:'SYNTHETIC: Unknown Company requests access to customer exports. Contact: sender@example.invalid.'
};
const directory=Object.freeze({'NS-204':{name:'Northstar Studio',tier:'Standard',owner:'Platform Operations'}});
export function begin(text){if(typeof text!=='string'||text.trim().length<20||text.length>1500)throw new Error('Use 20–1500 characters of synthetic text.');return {step:0,text,fields:null,classification:null,lookup:null,record:null,owner:null,notification:null,approved:false,events:['Synthetic request received. Nothing is sent externally.']};}
export function advance(state,decision){
 if(state.step>=8)throw new Error('Workflow already completed.');
 const next=structuredClone(state);const log=m=>next.events.push(m);
 switch(state.step){
 case 0:next.fields={reference:state.text.match(/\bNS-\d{3}\b/)?.[0]??null,contact:state.text.match(/[\w.+-]+@[\w.-]+\.[a-z]+/i)?.[0]??null};log('Extracted reference and contact using explicit patterns.');break;
 case 1:next.classification=/outage|urgent|restore/i.test(state.text)?'Incident':'Service request';log(`Rule classification: ${next.classification}. No model inference.`);break;
 case 2:next.lookup=directory[state.fields.reference]??null;log(next.lookup?'Mock directory matched one synthetic account.':'Unknown account: review required; no access granted.');break;
 case 3:next.record={id:'SYN-001',status:'Draft',category:state.classification};log('Created an in-memory draft record.');break;
 case 4:next.owner=state.lookup?.owner??'Security Review';log(`Assigned fictional owner: ${next.owner}.`);break;
 case 5:next.notification={status:'Draft only',recipient:state.owner};log('Prepared a notification draft. No email or webhook is sent.');break;
 case 6:log('Paused for explicit human review.');break;
 case 7:if(!['approve','reject'].includes(decision))throw new Error('A human must approve or reject.');if(decision==='approve'&&!state.lookup)throw new Error('Unknown accounts cannot be approved in this demo.');next.approved=decision==='approve';next.record.status=next.approved?'Validated':'Rejected';log(`Human ${next.approved?'approved':'rejected'} the synthetic draft.`);break;
 }
 next.step++;return next;
}

export const orchestrationStages = ['intake', 'understand', 'policy', 'tool', 'review', 'result'];

export function createRun(text, scenario = 'success', now = new Date().toISOString()) {
 if (typeof text !== 'string' || text.trim().length < 20 || text.length > 600) throw new Error('INVALID_INPUT');
 if (!['success', 'ambiguous', 'failure'].includes(scenario)) throw new Error('INVALID_SCENARIO');
 const run = {stage: 0, text: text.trim(), scenario, receivedAt: now, fields: null, policy: null, tool: null, result: null, failed: false, events: [], snapshots: []};
 return recordEvent(run, 'intake');
}

function recordEvent(run, event) {
 run.events.push({stage: run.stage, code: event, sequence: run.events.length + 1});
 run.snapshots[run.stage] = structuredClone({stage: run.stage, text: run.text, receivedAt: run.receivedAt, fields: run.fields, policy: run.policy, tool: run.tool, result: run.result, failed: run.failed});
 return run;
}

export function stepRun(current, action) {
 const run = structuredClone(current);
 if (run.stage === 5) throw new Error('COMPLETE');
 if (run.failed) {
  if (action !== 'retry') throw new Error('RETRY_REQUIRED');
  run.failed = false;
  run.tool = mockDirectory(run.fields.reference);
  return recordEvent(run, 'retry');
 }
 if (run.stage === 4) {
  if (!['approve', 'reject', 'correct'].includes(action)) throw new Error('HUMAN_REQUIRED');
  if (action === 'approve' && run.policy !== 'review') throw new Error('MANUAL_TRIAGE_REQUIRED');
  run.stage = 5;
  const outcome = {approve: 'approved', reject: 'rejected', correct: 'corrected'}[action];
  run.result = {id: 'SYN-001', outcome, owner: action === 'reject' ? 'none' : action === 'correct' ? 'manual' : 'operations', externalWrites: 0};
  return recordEvent(run, outcome);
 }
 if (action && action !== 'step') throw new Error('INVALID_ACTION');
 run.stage++;
 if (run.stage === 1) {
  const reference = run.text.match(/\bNS-\d{3}\b/)?.[0] ?? null;
  const category = /outage|urgent|caída|urgente/i.test(run.text) ? 'incident' : /accounts?|access|cuentas?|acceso/i.test(run.text) ? 'access' : 'unknown';
  run.fields = {reference, category, certainty: reference && category !== 'unknown' ? 'exact' : 'uncertain', method: 'rules'};
  return recordEvent(run, 'understand');
 }
 if (run.stage === 2) {
  run.policy = run.fields.reference === 'NS-204' && run.fields.category !== 'unknown' ? 'review' : 'triage';
  return recordEvent(run, run.policy === 'review' ? 'policyKnown' : 'policyUnknown');
 }
 if (run.stage === 3) {
  run.tool = mockDirectory(run.fields.reference);
  if (run.scenario === 'failure') { run.failed = true; run.tool.status = 503; run.tool.response = null; }
  return recordEvent(run, run.failed ? 'toolError' : run.tool.status === 200 ? 'toolOk' : 'toolUnknown');
 }
 return recordEvent(run, 'review');
}

function mockDirectory(reference) {
 return {request: {method: 'GET', resource: '/synthetic-directory', reference}, auth: 'authenticated', status: reference === 'NS-204' ? 200 : 404, response: reference === 'NS-204' ? {reference, owner: 'operations'} : null};
}
