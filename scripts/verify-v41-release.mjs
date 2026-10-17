// Run only after the main deployment: node scripts/verify-v41-release.mjs <main SHA>
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {githubRequest} from './github-api.mjs';
const expected=process.argv[2];assert.match(expected??'',/^[a-f0-9]{40}$/);
const remote=execFileSync('git',['ls-remote','origin','refs/heads/main'],{encoding:'utf8'}).trim().split(/\s/)[0];assert.equal(remote,expected);
const runs=(await githubRequest(`/actions/runs?branch=main&head_sha=${expected}&per_page=10`)).workflow_runs;
const run=runs.find(r=>r.head_sha===expected&&r.conclusion==='success');assert.ok(run,'Successful CI for exact main SHA required');
const jobs=(await githubRequest(`/actions/runs/${run.id}/jobs`)).jobs;
for(const name of ['validate','deploy'])assert.ok(jobs.some(j=>j.name===name&&j.conclusion==='success'),`${name} must succeed`);
const pages=await githubRequest('/pages');assert.equal(pages.cname,'santensor.com');assert.equal(pages.build_type,'workflow');assert.equal(pages.https_enforced,true);
const get=async path=>{const response=await fetch(`https://santensor.com${path}`,{cache:'no-store',signal:AbortSignal.timeout(30000)});assert.equal(response.status,200,path);assert.equal(new URL(response.url).protocol,'https:');return response;};
const release=await (await get(`/release.json?verify=${expected}`)).json();assert.equal(release.commit,expected);assert.equal(release.revision,'4.1');assert.equal(release.workflow,run.html_url);
const routes=[];
for(const root of ['/','/es/'])for(const route of ['','cases/','labs/','contact/','privacy/']){
 const path=root+route,response=await get(path),html=await response.text();
 assert.ok(html.includes(`lang="${root==='/es/'?'es':'en'}"`),path);
 assert.ok(!/trycloudflare|data-editorial-placeholder|\[CONFIRMAR/.test(html),path);
 assert.ok(html.includes(`rel="canonical" href="https://santensor.com${path}"`),path);
 routes.push({path,status:response.status,sha256:createHash('sha256').update(html).digest('hex')});
}
for(const key of ['workflow','portfolio','trainer']){
 const path=`/assets/projects/${key}.html`,html=await (await get(path)).text();
 for(const language of ['en','es'])assert.match(html,new RegExp(`id="${language}" lang="${language}"`));
 assert.ok(!/\/blob\/feat\//.test(html),path);routes.push({path,status:200});
}
assert.equal((await (await get('/CNAME')).text()).trim(),'santensor.com');
const result={date:new Date().toISOString(),expected,remote,release,ci:{sha:run.head_sha,url:run.html_url,conclusion:run.conclusion,jobs:jobs.map(j=>({name:j.name,conclusion:j.conclusion}))},pages:{cname:pages.cname,https_enforced:pages.https_enforced,build_type:pages.build_type},routes};
const directory=process.env.SITE_EVIDENCE_DIR??'.local';await mkdir(directory,{recursive:true});await writeFile(`${directory}/production-https.json`,JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
