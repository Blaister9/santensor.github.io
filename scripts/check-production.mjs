import { readdir, readFile, lstat } from "node:fs/promises";
import { assertPublishable } from "./editorial-gate.mjs";
import assert from "node:assert/strict";
const root = "dist";
async function walk(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const p = `${directory}/${entry.name}`;
    assert.ok(!(await lstat(p)).isSymbolicLink(), `Symlink in release: ${p}`);
    if (entry.isDirectory()) result.push(...(await walk(p)));
    else result.push(p);
  }
  return result;
}
const files = await walk(root),
  pages = [];
for (const file of files) {
  assert.ok(
    !/(?:^|\/)(?:evidence|review|scripts|tests|node_modules|\.git|\.local|\.openai|docs|concepts|concept-b)(?:\/|$)/.test(
      file,
    ),
    `Internal path in release: ${file}`,
  );
  if (file.endsWith(".html")) {
    const html = await readFile(file, "utf8");
    pages.push({ path: file, html });
    assert.ok(
      !/preview-label|DESIGN PREVIEW|PREVIEW PARA|trycloudflare|data-editorial-placeholder/.test(
        html,
      ),
      file,
    );
  }
  if (/\.(mjs|css|html|json|txt|xml)$/.test(file)) {
    const text = await readFile(file, "utf8");
    assert.ok(!/github\.com[^\s"'<>]*\/(?:blob|tree)\/(?:feat|fix)\//.test(text), `Temporary source branch in ${file}`);
    assert.ok(
      !/trycloudflare\.com|ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(
        text,
      ),
      `Internal link or secret in ${file}`,
    );
  }
}
assertPublishable(pages.filter((p) => !p.path.endsWith("404.html")));
const script = await readFile("dist/js/cinematic.mjs", "utf8");
assert.ok(
  !script.includes("santensorExperience"),
  "Inspection API must be removed from production",
);
assert.equal((await readFile("dist/CNAME", "utf8")).trim(), "santensor.com");
const sitemap = await readFile("dist/sitemap.xml", "utf8");
assert.ok(!/concept|trycloudflare|review/.test(sitemap));
const release = JSON.parse(await readFile("dist/release.json", "utf8"));
assert.equal(release.mode, "production");
assert.equal(release.version, "4");
console.log(
  JSON.stringify({
    productionPages: pages.length,
    files: files.length,
    release,
    internalResources: false,
    inspectionHooks: false,
  }),
);
