// Rebuild the low-GPU artwork from the original procedural world, never from third-party imagery.
import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const browser = await chromium.launch();
await mkdir("assets/optical", { recursive: true });
const manifest = [];
for (const [name, viewport] of [
  ["desktop", { width: 1440, height: 900 }],
  ["mobile", { width: 390, height: 844 }],
]) {
  const page = await browser.newPage({ viewport });
  await page.goto(
    `${process.env.SITE_TEST_URL ?? "http://127.0.0.1:4180"}/?quality=webgl`,
  );
  await page.waitForFunction(
    () => globalThis.santensorExperience?.stats().mode === "webgl",
  );
  for (let scene = 0; scene < 5; scene++) {
    const data = await page.evaluate(
        (p) => globalThis.santensorExperience.capture(p),
        scene,
      ),
      bytes = Buffer.from(data.split(",")[1], "base64"),
      path = `assets/optical/${name}-${scene}.webp`;
    await writeFile(path, bytes);
    manifest.push({
      path,
      bytes: bytes.length,
      scene,
      viewport,
      origin:
        "Original procedural scene in js/cinematic-world.mjs; canvas WebP export.",
    });
  }
  await page.close();
}
await writeFile(
  "assets/optical/manifest.json",
  JSON.stringify(manifest, null, 2),
);
console.log(
  JSON.stringify(manifest.map(({ path, bytes }) => ({ path, bytes }))),
);
await browser.close();
