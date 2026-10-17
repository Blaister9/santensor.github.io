import { chromium } from "@playwright/test";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import assert from "node:assert/strict";
const browser = await chromium.launch(),
  results = [];
const base = process.env.SITE_TEST_URL ?? "http://127.0.0.1:4180";
for (const mode of ["desktop", "mobile-throttled", "reduced-motion"]) {
  const mobile = mode !== "desktop",
    reduced = mode === "reduced-motion";
  const context = await browser.newContext({
    viewport: mobile
      ? { width: 390, height: 844 }
      : { width: 1440, height: 900 },
    deviceScaleFactor: mobile ? 3 : 1,
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  const page = await context.newPage(),
    session = await context.newCDPSession(page),
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  if (mode === "mobile-throttled") {
    await session.send("Network.enable");
    await session.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
    });
    await session.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  }
  await page.addInitScript(() => {
    globalThis.v4Measurements = { lcp: 0, cls: 0, longTasks: [] };
    new PerformanceObserver((list) => {
      for (const e of list.getEntries())
        globalThis.v4Measurements.lcp = e.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries())
        if (!e.hadRecentInput) globalThis.v4Measurements.cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries())
        globalThis.v4Measurements.longTasks.push(e.duration);
    }).observe({ type: "longtask", buffered: true });
  });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForFunction(
    () => globalThis.santensorExperience?.stats().mode !== "loading",
    { timeout: 30000 },
  );
  const initialBytes = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .reduce(
        (n, r) => n + r.transferSize,
        performance.getEntriesByType("navigation")[0].transferSize,
      ),
  );
  const idleStart = await page.evaluate(() =>
    globalThis.santensorExperience.stats(),
  );
  await page.waitForTimeout(450);
  const idleEnd = await page.evaluate(() =>
    globalThis.santensorExperience.stats(),
  );
  const deltas = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const frames = [];
        let i = 0,
          last = performance.now();
        function frame(now) {
          frames.push(now - last);
          last = now;
          scrollTo(0, (i / 60) * innerHeight * 6.4);
          if (++i <= 60) requestAnimationFrame(frame);
          else resolve(frames.slice(1));
        }
        requestAnimationFrame(frame);
      }),
  );
  const metrics = await page.evaluate(() => ({
    timing: performance.getEntriesByType("navigation")[0].toJSON(),
    resources: performance
      .getEntriesByType("resource")
      .map((e) => ({
        name: new URL(e.name).pathname,
        origin: new URL(e.name).origin,
        bytes: e.transferSize,
        duration: e.duration,
      })),
    measurements: globalThis.v4Measurements,
    render: globalThis.santensorExperience.stats(),
  }));
  const bytes = metrics.resources.reduce(
      (n, r) => n + r.bytes,
      metrics.timing.transferSize,
    ),
    sorted = deltas.toSorted((a, b) => a - b);
  assert.equal(errors.length, 0);
  assert.ok(
    initialBytes < (reduced ? 300000 : 950000),
    `${mode} initial resource budget: ${initialBytes}`,
  );
  assert.ok(
    bytes < (reduced ? 300000 : 1250000),
    `${mode} tour resource budget: ${bytes}`,
  );
  assert.ok(metrics.resources.every((r) => r.origin === new URL(base).origin));
  if (!reduced) {
    assert.equal(
      idleStart.frames,
      idleEnd.frames,
      "renderer should sleep when idle",
    );
    if (metrics.render.mode === "webgl")
      assert.ok(metrics.render.drawCalls <= 160);
  }
  results.push({
    mode,
    viewport: mobile ? "390x844 / DPR 3" : "1440x900 / DPR 1",
    conditions:
      mode === "mobile-throttled"
        ? "CDP 4× CPU, 150ms RTT, 1.6Mbps download; emulation, not a physical phone"
        : "local Chromium laboratory measurement",
    initialBytes,
    bytes,
    initialResourceBudget: reduced ? 300000 : 950000,
    tourResourceBudget: reduced ? 300000 : 1250000,
    frameIntervalsMs: {
      median: sorted[Math.floor(sorted.length * 0.5)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      max: Math.max(...sorted),
    },
    idleRendererSleeps: reduced ? true : idleStart.frames === idleEnd.frames,
    ...metrics,
    errors,
  });
  await context.close();
}
const renderer = await readFile("js/vendor/cinematic-world.bundle.mjs");
await mkdir("evidence/v4", { recursive: true });
await writeFile(
  "evidence/v4/performance.json",
  JSON.stringify(
    {
      date: new Date().toISOString(),
      renderer: { raw: renderer.length, gzip: gzipSync(renderer).length },
      results,
    },
    null,
    2,
  ),
);
console.log(
  JSON.stringify(
    results.map(({ mode, bytes, frameIntervalsMs, measurements, render }) => ({
      mode,
      bytes,
      frameIntervalsMs,
      lcp: measurements.lcp,
      cls: measurements.cls,
      render,
    })),
  ),
);
await browser.close();
