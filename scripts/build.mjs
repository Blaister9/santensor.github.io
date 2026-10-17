import { mkdir, copyFile, cp, readFile, rm, writeFile } from "node:fs/promises";
import { renderPages } from "./render-pages.mjs";
import { renderPage } from "./render-pages.mjs";
import { assertPublishable } from "./editorial-gate.mjs";
import { build } from "esbuild";
import { execFileSync } from "node:child_process";
import path from "node:path";
const preview =
  process.argv.includes("--preview") && process.env.NODE_ENV !== "production";
const production = !preview;
const routes = ["", "labs", "cases", "contact", "privacy"];
if (production)
  assertPublishable(
    ["en", "es"].flatMap((language) =>
      routes.map((page) => ({
        path: `/${language}/${page}`,
        html: renderPage(language, page, { production }),
      })),
    ),
  );
// Clear only the fixed, verified build directory; never retain preview artifacts in a release.
const output = path.resolve("dist");
if (path.dirname(output) !== process.cwd() || path.basename(output) !== "dist")
  throw new Error("Unexpected build path");
await rm(output, { recursive: true, force: true });
await mkdir("assets/fonts", { recursive: true });
await mkdir("js/vendor", { recursive: true });
await build({
  entryPoints: ["js/cinematic-world.mjs"],
  outfile: "js/vendor/cinematic-world.bundle.mjs",
  bundle: true,
  minify: true,
  format: "esm",
  target: "es2022",
  legalComments: "eof",
});
await copyFile("node_modules/three/LICENSE", "js/vendor/THREE-LICENSE.txt");
for (const filename of ["gsap.min.js", "ScrollTrigger.min.js"])
  await copyFile(`node_modules/gsap/dist/${filename}`, `js/vendor/${filename}`);
await copyFile("node_modules/gsap/README.md", "js/vendor/GSAP-NOTICE.md");
for (const [family, weight] of [
  ["space-grotesk", 500],
  ["inter", 400],
  ["ibm-plex-mono", 400],
]) {
  await copyFile(
    `node_modules/@fontsource/${family}/files/${family}-latin-${weight}-normal.woff2`,
    `assets/fonts/${family}-latin-${weight}-normal.woff2`,
  );
  await copyFile(
    `node_modules/@fontsource/${family}/LICENSE`,
    `assets/fonts/${family}-LICENSE.txt`,
  );
}
await renderPages({ production });
await mkdir("dist", { recursive: true });
for (const f of [
  "index.html",
  "CNAME",
  "robots.txt",
  "sitemap.xml",
  "favicon.svg",
  "404.html",
])
  await copyFile(f, `dist/${f}`);
if (preview) {
  for (const d of [
    "css",
    "js",
    "labs",
    "cases",
    "privacy",
    "contact",
    "es",
    "assets",
    "concepts",
    "concept-b",
  ])
    await cp(d, `dist/${d}`, { recursive: true });
} else {
  await mkdir("dist/css", { recursive: true });
  await copyFile("css/cinematic.css", "dist/css/cinematic.css");
  await mkdir("dist/js/vendor", { recursive: true });
  await copyFile(
    "js/vendor/cinematic-world.bundle.mjs",
    "dist/js/vendor/cinematic-world.bundle.mjs",
  );
  await copyFile(
    "js/vendor/THREE-LICENSE.txt",
    "dist/js/vendor/THREE-LICENSE.txt",
  );
  await build({
    entryPoints: ["js/cinematic.mjs", "js/contact.mjs", "js/notfound.mjs", "js/direct-contact.mjs"],
    outdir: "dist/js",
    outExtension: { ".js": ".mjs" },
    bundle: true,
    minify: true,
    charset: "utf8",
    format: "esm",
    target: "es2022",
    external: ["./vendor/cinematic-world.bundle.mjs"],
    define: { __SANTENSOR_PREVIEW__: "false" },
    legalComments: "eof",
  });
  for (const locale of ["", "es/"])
    for (const route of routes) {
      if (!route && !locale) continue;
      await mkdir(`dist/${locale}${route}`, { recursive: true });
      await copyFile(
        `${locale}${route ? route + "/" : ""}index.html`,
        `dist/${locale}${route ? route + "/" : ""}index.html`,
      );
    }
  await copyFile("es/404.html", "dist/es/404.html");
  await cp("assets/fonts", "dist/assets/fonts", { recursive: true });
  await cp("assets/projects", "dist/assets/projects", {recursive:true});
  await cp("assets/social", "dist/assets/social", {recursive:true});
  await cp("assets/optical", "dist/assets/optical", { recursive: true });
  const commit =
    process.env.GITHUB_SHA ??
    execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  await writeFile(
    "dist/release.json",
    JSON.stringify({ version: "4", revision: "4.1", commit, mode: "production" }, null, 2),
  );
  await writeFile("dist/.nojekyll", "");
}
if ((await readFile("dist/CNAME", "utf8")).trim() !== "santensor.com")
  throw new Error("CNAME must remain santensor.com");
console.log(
  `Static ${preview ? "preview" : "production"} build verified; CNAME preserved.`,
);
