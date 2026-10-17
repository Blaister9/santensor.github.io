import {test} from 'node:test';
import assert from 'node:assert/strict';
import {studioCopy} from '../js/v3-copy.mjs';
import {renderPage} from '../scripts/render-pages.mjs';
import {assertPublishable} from '../scripts/editorial-gate.mjs';

test('both concept catalogs have identical translated fields', () => {
 assert.deepEqual(Object.keys(studioCopy.en),Object.keys(studioCopy.es));
 for (const language of ['en','es']) for (const value of Object.values(studioCopy[language])) assert.ok(Array.isArray(value) ? value.length : value.trim().length);
});
test('production gate rejects previews and hidden editorial placeholders in both languages', () => {
 for (const language of ['en','es']) for (const path of ['', 'cases', 'labs', 'concepts', 'concept-b']) {
  assert.throws(() => assertPublishable([{path,html:renderPage(language,path)}]),/Production build blocked/);
 }
 assert.throws(() => assertPublishable([{path:'/',html:'<details hidden>[CASE_RESULT: pending]</details>'}]),/unresolved editorial/);
 assert.doesNotThrow(() => assertPublishable([{path:'/',html:'<h1>Approved content</h1>'}]));
});
test('both concepts are static bilingual documents without obsolete network diagrams', () => {
 for (const language of ['en','es']) for (const route of ['', 'concepts', 'concept-b', 'labs']) {
  const html = renderPage(language,route);
  assert.ok(html.includes(`<html lang="${language}">`));
  assert.equal((html.match(/<h1>/g) ?? []).length,1);
  assert.ok(!html.includes('class="circuit"'));
  assert.ok(!html.includes('undefined'));
 }
});
