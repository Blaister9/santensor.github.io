import {readdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
for (const directory of ['js','scripts']) for (const filename of await readdir(directory)) {
 if (!filename.endsWith('.mjs')) continue;
 const result = spawnSync(process.execPath, ['--check', `${directory}/${filename}`], {stdio:'inherit'});
 if (result.status !== 0) process.exit(result.status ?? 1);
}
