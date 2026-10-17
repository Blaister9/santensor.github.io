import { test } from "node:test";
import assert from "node:assert/strict";
import { renderPage } from "../scripts/render-pages.mjs";
import { assertPublishable } from "../scripts/editorial-gate.mjs";
for (const language of ["en", "es"])
  test(`production renders approved content without weakening preview/editorial gates ${language}`, () => {
    for (const route of ["", "labs", "cases", "contact", "privacy"]) {
      const production = renderPage(language, route, { production: true });
      assert.doesNotThrow(() =>
        assertPublishable([{ path: route, html: production }]),
      );
      assert.ok(!production.includes("preview-label"));
      assert.ok(!production.includes("noindex"));
      assert.ok(production.includes('data-build-mode="production"'));
      assert.ok(!production.includes("trycloudflare"));
      assert.throws(
        () =>
          assertPublishable([
            { path: route, html: renderPage(language, route) },
          ]),
        /Production build blocked/,
      );
    }
    assert.throws(
      () =>
        assertPublishable([
          { path: "/", html: "<p data-editorial-placeholder>Pending</p>" },
        ]),
      /unresolved editorial/,
    );
    assert.throws(
      () =>
        assertPublishable([
          {
            path: "/",
            html: '<a href="https://example.trycloudflare.com/">Temporary</a>',
          },
        ]),
      /internal/,
    );
  });
