import {begin,advance,examples,stages} from './workflow.mjs';
const $=id=>document.getElementById(id);let state;
function render(){
 $('stage-list').replaceChildren(...stages.map((name,i)=>{const li=document.createElement('li');li.textContent=`${String(i+1).padStart(2,'0')}  ${name}`;if(i===state.step)li.setAttribute('aria-current','step');if(i<state.step)li.className='finished';return li;}));
 $('workflow-state').textContent=JSON.stringify({stage:stages[state.step],classification:state.classification,fields:state.fields,lookup:state.lookup,record:state.record,owner:state.owner,notification:state.notification},null,2);
 $('event-log').replaceChildren(...state.events.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
 $('step').disabled=state.step>=7;$('approve').disabled=state.step!==7||!state.lookup;$('reject').disabled=state.step!==7;
 $('result').textContent=state.step===8?`Result: ${state.record.status}. Synthetic record ${state.record.id}. No external changes.`:`Current stage: ${stages[state.step]}.`;
}
function reset(){try{state=begin($('request').value);$('error').textContent='';render();}catch(e){$('error').textContent=e.message;}}
function step(decision){try{state=advance(state,decision);$('error').textContent='';render();}catch(e){$('error').textContent=e.message;}}
$('fixture').addEventListener('change',()=>{$('request').value=examples[$('fixture').value];reset();});
$('reset').addEventListener('click',reset);$('step').addEventListener('click',()=>step());$('approve').addEventListener('click',()=>step('approve'));$('reject').addEventListener('click',()=>step('reject'));$('request').value=examples.standard;reset();
