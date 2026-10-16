import {defineConfig} from '@playwright/test';
process.env.SITE_EVIDENCE_DIR ??= 'evidence/v3/baseline-tests';

export default defineConfig({
 testDir:'./tests/browser',
 testMatch:['site.spec.mjs','story.spec.mjs'],
 workers:1,
 reporter:[['list'],['json',{outputFile:'evidence/v3/baseline-tests/browser-results.json'}]],
 use:{baseURL:process.env.SITE_TEST_URL ?? 'http://127.0.0.1:4174',viewport:{width:1440,height:900}}
});
