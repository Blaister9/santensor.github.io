import { test, expect } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import AxeBuilder from "@axe-core/playwright";
import { catalogs } from "../../js/i18n.mjs";
const evidence =
  process.env.SITE_EVIDENCE_DIR ?? "evidence/v4-production/local";
await mkdir(evidence, { recursive: true });
const progress = (page) =>
  page.locator("[data-journey]").getAttribute("data-progress").then(Number);
async function go(page, n) {
  await page.locator(`.scene-nav [data-go="${n}"]`).click();
  await expect.poll(() => progress(page)).toBeCloseTo(n, 2);
}
async function exportTrace(page) {
  const downloaded = page.waitForEvent("download");
  await page.locator("[data-export]").click();
  const download = await downloaded;
  return JSON.parse(await readFile(await download.path(), "utf8"));
}
function observe(page) {
  const errors = [],
    missing = [],
    foreign = [];
  let origin;
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("response", (r) => {
    if (r.status() >= 400 && r.request().resourceType() !== "document")
      missing.push({ url: r.url(), status: r.status() });
  });
  page.on("request", (r) => {
    if (!/^https?:/.test(r.url())) return;
    if (!origin && r.resourceType() === "document")
      origin = new URL(r.url()).origin;
    if (
      origin &&
      r.resourceType() !== "document" &&
      new URL(r.url()).origin !== origin
    )
      foreign.push(r.url());
  });
  return { errors, missing, foreign };
}

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
])
  for (const language of ["en", "es"])
    test(`production system, failure, recovery and trace ${language} ${viewport.width}`, async ({
      browser,
    }) => {
      const context = await browser.newContext({
          viewport,
          isMobile: viewport.width < 700,
          hasTouch: viewport.width < 700,
        }),
        page = await context.newPage(),
        observed = observe(page),
        mobile = viewport.width < 700;
      expect((await page.goto(language === "es" ? "/es/" : "/")).status()).toBe(
        200,
      );
      await expect(page.locator("body")).toHaveAttribute(
        "data-build-mode",
        "production",
      );
      await expect(page.locator(".preview-label")).toHaveCount(0);
      expect(
        await page.evaluate(() => typeof globalThis.santensorExperience),
      ).toBe("undefined");
      await go(page, 3);
      await page
        .locator("[data-request]")
        .fill(
          "SYNTHETIC: Account NS-204 requests 12 developer accounts for a fictional engineering test.",
        );
      await page.locator("[data-run]").click();
      await expect(page.locator("[data-review]")).toBeVisible();
      await page.locator("[data-approve]").click();
      await expect(page.locator("[data-evidence-values]")).toContainText(
        "SYN-001",
      );
      const first = await exportTrace(page);
      expect(first.run.result.outcome).toBe("approved");
      expect(first.run.result.externalWrites).toBe(0);
      expect(first.run.text).toContain("12 developer");
      if (mobile) await page.locator('[data-panel-tab="0"]').tap();
      await page.locator("[data-break]").click();
      await expect(page.locator("[data-retry]")).toBeVisible();
      await expect(page.locator("[data-status]")).toContainText("503");
      const countBefore = await page.locator("[data-event]").count();
      await page.locator("[data-language]").click();
      await expect(page.locator("html")).toHaveAttribute(
        "lang",
        language === "es" ? "en" : "es",
      );
      await expect.poll(() => progress(page)).toBeCloseTo(3, 2);
      await expect(page.locator("[data-retry]")).toBeVisible();
      expect(await page.locator("[data-event]").count()).toBe(countBefore);
      await page.locator("[data-retry]").click();
      await page.locator("[data-step]").click();
      await page.locator("[data-approve]").click();
      await page.locator('[data-event="3"]').click();
      await expect(page.locator("[data-evidence-values]")).toContainText("503");
      const recovered = await exportTrace(page);
      expect(recovered.eventSnapshots[3].tool.status).toBe(503);
      expect(recovered.run.tool.status).toBe(200);
      expect(
        recovered.run.events.filter((e) => e.code === "intake"),
      ).toHaveLength(1);
      expect(recovered.run.result.externalWrites).toBe(0);
      expect(recovered.run.events.map((e) => e.code)).toContain("retry");
      await go(page, 4);
      await expect(page.locator(".result-summary")).toContainText("SYN-001");
      for (const area of [0, 1, 2]) {
        await page.locator(`[data-area="${area}"]`).click();
        await expect(page.locator(`[data-area="${area}"]`)).toHaveAttribute(
          "aria-pressed",
          "true",
        );
      }
      await page.screenshot({
        path: `${evidence}/results-${language}-${viewport.width}.png`,
      });
      await go(page, 3);
      if (mobile) await page.locator('[data-panel-tab="0"]').click();
      await page.locator("[data-reset]").click();
      await page.locator("[data-request]").fill("short");
      await page.locator("[data-run]").click();
      await expect(page.locator("[data-error]")).toContainText("20–600");
      await page
        .locator("[data-request]")
        .fill(
          "SYNTHETIC: Unknown account requests access to an unidentified resource.",
        );
      await page.locator("[data-run]").click();
      await expect(page.locator("[data-review]")).toBeVisible();
      await expect(page.locator("[data-approve]")).toBeDisabled();
      await page.locator("[data-correct]").click();
      expect((await exportTrace(page)).run.result.outcome).toBe("corrected");
      expect(observed.errors).toEqual([]);
      expect(observed.missing).toEqual([]);
      expect(observed.foreign).toEqual([]);
      await writeFile(
        `${evidence}/trace-${language}-${viewport.width}.json`,
        JSON.stringify({ observed, first, recovered }, null, 2),
      );
      await context.close();
    });

test("production scroll is continuous, reversible and retains all three surfaces", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(
    () =>
      (globalThis.testSurfaces = [
        ...document.querySelectorAll("[data-surface]"),
      ]),
  );
  const poses = [];
  for (const n of [0, 1, 2, 3, 4, 3, 2, 1, 0]) {
    await page.mouse.move(1435, 500);
    await page.mouse.wheel(
      0,
      n * 900 * 1.6 - (await page.evaluate(() => scrollY)),
    );
    await expect.poll(() => progress(page)).toBeCloseTo(n, 2);
    poses.push(
      await page.locator('[data-surface="0"]').getAttribute("data-pose"),
    );
    expect(
      await page.evaluate(() =>
        globalThis.testSurfaces.every(
          (s, i) => s === document.querySelector(`[data-surface="${i}"]`),
        ),
      ),
    ).toBe(true);
    if (n === 1 || n === 2) {
      await page.locator('[data-context="0"]').click();
      await expect(page.locator(".context-inspector")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.locator(".context-inspector")).toBeHidden();
    }
  }
  for (let i = 0; i < 4; i++) expect(poses[i]).toBe(poses[8 - i]);
  await page.mouse.wheel(0, 720);
  await expect.poll(() => progress(page)).toBeCloseTo(0.5, 2);
  expect(
    await page.locator('[data-surface="0"]').getAttribute("data-pose"),
  ).not.toBe(poses[0]);
  await writeFile(
    `${evidence}/continuity.json`,
    JSON.stringify({ poses, intermediate: true, persistent: true }, null, 2),
  );
});

test("production WebGL enhancement renders the same optical system", async ({
  browser,
}) => {
  const context = await browser.newContext();
  await context.addInitScript(() => {
    const original = WebGL2RenderingContext.prototype.getExtension;
    WebGL2RenderingContext.prototype.getExtension = function (name) {
      return name === "WEBGL_debug_renderer_info"
        ? null
        : original.call(this, name);
    };
  });
  const page = await context.newPage(),
    observed = observe(page);
  await page.goto("/");
  await expect(page.locator("body")).toHaveClass(/graphics-ready/);
  const hashes = [];
  for (const n of [0, 1, 2, 3, 4]) {
    await page.waitForTimeout(1900);
    await go(page, n);
    hashes.push({
      scene: n,
      hash: createHash("sha256")
        .update(await page.locator("#optical-world").screenshot())
        .digest("hex"),
    });
    await page.screenshot({ path: `${evidence}/webgl-scene-${n + 1}.png` });
  }
  expect(new Set(hashes.map((x) => x.hash)).size).toBe(5);
  expect(observed.errors).toEqual([]);
  expect(observed.missing).toEqual([]);
  await writeFile(
    `${evidence}/webgl.json`,
    JSON.stringify(
      {
        mode: "Actual WebGL; capability-detection override in test only; software renderer, not physical GPU evidence",
        hashes,
        observed,
      },
      null,
      2,
    ),
  );
  await context.close();
});

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
  { width: 360, height: 740 },
])
  test(`production EN ES, keyboard, reduced motion and layout ${viewport.width}`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
        viewport,
        reducedMotion: "reduce",
      }),
      page = await context.newPage(),
      observed = observe(page),
      reports = [];
    for (const language of ["en", "es"]) {
      await page.goto(language === "es" ? "/es/" : "/");
      for (const n of [0, 1, 2, 3, 4]) {
        await go(page, n);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        const report = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        reports.push({ language, scene: n, violations: report.violations });
      }
      for (const route of ["labs", "cases", "contact", "privacy"]) {
        expect(
          (
            await page.goto(`${language === "es" ? "/es" : ""}/${route}/`)
          ).status(),
        ).toBe(200);
        await expect(page.locator("h1")).toHaveCount(1);
        await expect(page.locator(".preview-label")).toHaveCount(0);
        const report = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        reports.push({ language, route, violations: report.violations });
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
      }
    }
    await writeFile(
      `${evidence}/axe-${viewport.width}.json`,
      JSON.stringify(reports, null, 2),
    );
    expect(reports.flatMap((r) => r.violations)).toEqual([]);
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.locator(".skip")).toBeFocused();
    await page.keyboard.press("Enter");
    await expect.poll(() => progress(page)).toBeCloseTo(3, 2);
    await page.locator("[data-request]").focus();
    await page.keyboard.press("ControlOrMeta+A");
    await page.keyboard.type(
      "SYNTHETIC: Account NS-204 requests 10 accounts for a fictional test.",
    );
    await page.keyboard.press("Tab");
    await expect(page.locator("[data-run]")).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("[data-review]")).toBeVisible();
    await page.locator("[data-approve]").focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("[data-evidence-values]")).toContainText(
      "SYN-001",
    );
    const before = await page.evaluate(() => scrollY);
    await page.mouse.move(viewport.width - 3, 400);
    await page.mouse.wheel(0, -800);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(before);
    expect(
      await page.evaluate(() =>
        performance
          .getEntriesByType("resource")
          .some((r) => r.name.includes("cinematic-world.bundle")),
      ),
    ).toBe(false);
    expect(observed.errors).toEqual([]);
    expect(observed.missing).toEqual([]);
    expect(observed.foreign).toEqual([]);
    await context.close();
  });

test("production navigation, contact draft and internal-path exclusion", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await page.locator('header [data-route="labs"]').click();
  await page.locator("[data-run]").click();
  await expect(page.locator("[data-review]")).toBeVisible();
  await page.locator("[data-reject]").click();
  expect((await exportTrace(page)).run.result.outcome).toBe("rejected");
  await page.locator('header [data-route="cases"]').click();
  await expect(page.locator(".study")).toHaveCount(3);
  await expect(page.locator(".case-kind").first()).toContainText(
    "Experimental",
  );
  await page.locator('header [data-route="contact"]').click();
  await page.locator("#name").fill("Synthetic Visitor");
  await page.locator("#email").fill("visitor@example.invalid");
  await page
    .locator("#message")
    .fill("A fictional inquiry about an inspectable engineering system.");
  await page.locator('[name="consent"]').check();
  await page.locator('[type="submit"]').click();
  await expect(page.locator("[data-draft-panel]")).toBeVisible();
  await expect(page.locator("[data-open-draft]")).toHaveAttribute(
    "href",
    /^mailto:/,
  );
  for (const path of [
    "/review/",
    "/evidence/v4/",
    "/scripts/build.mjs",
    "/RUN_REPORT.md",
    "/.git/config",
    "/.env",
    "/concepts/",
  ])
    expect((await request.get(path)).status(), path).toBe(404);
  const response = await request.get("/release.json");
  expect(response.status()).toBe(200);
  const release = await response.json();
  expect(release.version).toBe("4");
  expect(release.mode).toBe("production");
  await writeFile(
    `${evidence}/served-release.json`,
    JSON.stringify(release, null, 2),
  );
});

test("production accessible paths do not require JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false }),
    page = await context.newPage();
  await page.goto("/es/");
  await expect(page.locator(".nojs")).toBeVisible();
  await page.locator('header [data-route="contact"]').click();
  await expect(page.locator('a[href^="mailto:"]').first()).toBeVisible();
  await context.close();
});
