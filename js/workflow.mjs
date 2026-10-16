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
