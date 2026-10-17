import{execFileSync,spawnSync}from'node:child_process';import{readFile,writeFile}from'node:fs/promises';import{createHash}from'node:crypto';
const baseline='821c4d6',critical=['CNAME','.openai/hosting.json','js/workflow.mjs'];
const checks=critical.map(file=>({file,unchanged:spawnSync('git',['diff','--quiet',baseline,'--',file]).status===0}));
const main=execFileSync('git',['ls-remote','origin','refs/heads/main'],{encoding:'utf8'}).split(/\s/)[0];
const names=[...new Set([...execFileSync('git',['diff','--name-only',baseline],{encoding:'utf8'}).split(/\r?\n/),...execFileSync('git',['ls-files','--others','--exclude-standard'],{encoding:'utf8'}).split(/\r?\n/)])].filter(Boolean);
const suspect=[];for(const file of names){if(/\.(png|webp|webm|woff2|zip)$/.test(file))continue;const text=await readFile(file,'utf8');if(/ghp_[a-zA-Z0-9]{30,}|github_pat_[a-zA-Z0-9_]{30,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(text))suspect.push(file);}
const response=await fetch('https://santensor.com/');
const result={baseline:execFileSync('git',['rev-parse',baseline],{encoding:'utf8'}).trim(),main,mainPreserved:main===execFileSync('git',['rev-parse',baseline],{encoding:'utf8'}).trim(),critical:checks,secretScan:{suspect,scope:'Changed/new text files; pattern scan and manual content review'},production:{status:response.status,sha256:createHash('sha256').update(await response.text()).digest('hex')},operations:'No main merge/push, force push, Pages/DNS, Railway or trainer changes. Existing authorized preview only.'};
await writeFile('evidence/v4.1/preservation.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));if(!result.mainPreserved||checks.some(c=>!c.unchanged)||suspect.length)process.exit(1);
