import { test, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";
import {createHash} from 'node:crypto';
const evidence = process.env.SITE_EVIDENCE_DIR ?? "evidence/v4";
await mkdir(evidence,{recursive:true});
const go = async (page, n) => {
  await page.locator(`.scene-nav [data-go="${n}"]`).click();
  await expect
    .poll(() => page.evaluate(() => globalThis.santensorExperience.progress))
    .toBeCloseTo(n, 2);
};

test('procedural WebGL camera is reversible independently of the lightweight alternative',async({page})=>{
 await page.goto('/?quality=webgl');await page.waitForFunction(()=>globalThis.santensorExperience?.stats().mode==='webgl');
 const hashes=[];
 for(const scene of [0,1,2,3,4,2,0]){await go(page,scene);const data=await page.evaluate(p=>globalThis.santensorExperience.capture(p),scene);hashes.push({scene,sha256:createHash('sha256').update(data).digest('hex')});}
 expect(hashes[0].sha256).toBe(hashes[6].sha256);expect(hashes[2].sha256).toBe(hashes[5].sha256);expect(new Set(hashes.map(h=>h.sha256)).size).toBe(5);
 const render=await page.evaluate(()=>globalThis.santensorExperience.stats());expect(render.drawCalls).toBeLessThanOrEqual(160);await writeFile(`${evidence}/webgl-reversibility.json`,JSON.stringify({hashes,render},null,2));
});

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
])
  test(`executable operation, failure recovery, historical evidence ${viewport.width}`, async ({
    browser,
  }) => {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/");
    await go(page, 3);
    await mkdir(evidence, { recursive: true });
    await page.screenshot({
      path: `${evidence}/operation-${viewport.width}.png`,
    });
    await page
      .locator("[data-request]")
      .fill(
        "SYNTHETIC: Account NS-204 requests 12 developer accounts for a fictional laboratory.",
      );
    await page.locator("[data-run]").click();
    await expect(page.locator("[data-review]")).toBeVisible();
    await page.locator("[data-approve]").click();
    await expect
      .poll(() =>
        page.evaluate(
          () => globalThis.santensorExperience.operation.run.result.outcome,
        ),
      )
      .toBe("approved");
    await expect(page.locator("[data-evidence-values]")).toContainText(
      "SYN-001",
    );
    if (viewport.width < 700)
      await page.locator('[data-panel-tab="0"]').click();
    await page.locator("[data-break]").click();
    await expect(page.locator("[data-retry]")).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(
          () => globalThis.santensorExperience.operation.run.tool.status,
        ),
      )
      .toBe(503);
    await page.screenshot({
      path: `${evidence}/failure-${viewport.width}.png`,
    });
    await page.locator("[data-retry]").click();
    await page.locator("[data-step]").click();
    await page.locator("[data-approve]").click();
    const run = await page.evaluate(
      () => globalThis.santensorExperience.operation.run,
    );
    expect(run.result.externalWrites).toBe(0);
    expect(run.events.map((e) => e.code)).toContain("retry");
    expect(run.events.map((e) => e.code)).toContain("toolError");
    await page.locator('[data-event="3"]').click();
    await expect(page.locator("[data-evidence-values]")).toContainText("503");
    await page.screenshot({
      path: `${evidence}/recovered-${viewport.width}.png`,
    });
    if (viewport.width < 700)
      await page.locator('[data-panel-tab="0"]').click();
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
    expect(
      (await page.evaluate(() => globalThis.santensorExperience.operation.run))
        .result.outcome,
    ).toBe("corrected");
    await go(page, 4);
    await expect(page.locator(".result-summary")).toContainText("SYN-001");
    for (const i of [0, 1, 2]) {
      await page.locator(`[data-area="${i}"]`).click();
      await expect(page.locator(`[data-area="${i}"]`)).toHaveAttribute(
        "aria-pressed",
        "true",
      );
    }
    await page.screenshot({
      path: `${evidence}/results-${viewport.width}.png`,
    });
    await page.locator("[data-result-inspect]").click();
    await expect
      .poll(() => page.evaluate(() => globalThis.santensorExperience.progress))
      .toBeCloseTo(3, 2);
    await expect(page.locator("[data-evidence-values]")).toContainText(
      "SYN-001",
    );
    await writeFile(
      `${evidence}/operation-trace-${viewport.width}.json`,
      JSON.stringify({ errors, run }, null, 2),
    );
    expect(errors).toEqual([]);
    await context.close();
  });

test("commercial routes, independent laboratory and direct email contact", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator('header [data-route="labs"]').click();
  await expect(page.locator("[data-standalone-lab]")).toBeVisible();
  await page.locator("[data-run]").click();
  await expect(page.locator("[data-review]")).toBeVisible();
  await page.locator("[data-reject]").click();
  expect(
    (await page.evaluate(() => globalThis.santensorExperience.operation.run))
      .result.outcome,
  ).toBe("rejected");
  await page.locator('header [data-route="cases"]').click();
  await expect(page.locator(".study")).toHaveCount(3);
  await expect(page.locator(".case-kind").first()).toContainText(
    "prototype",
  );
  await page.locator('header [data-route="contact"]').click();
  await expect(page.locator('a.email-link')).toHaveAttribute('href','mailto:santiagopazbedoya@gmail.com');
  await expect(page.locator('a.button.primary')).toHaveAttribute('href',/^mailto:/);
  await expect(page.locator('form')).toHaveCount(0);
});

test("reversible continuous scroll, persistent surfaces and contextual architecture", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.evaluate(
    () =>
      (globalThis.surfaceReferences = [
        ...document.querySelectorAll("[data-surface]"),
      ]),
  );
  const poses = [];
  for (const [i, amount] of [0, 1, 2, 3, 2, 1, 0].map((i) => [
    i,
    i * 900 * 1.6,
  ])) {
    await page.mouse.wheel(0, amount - (await page.evaluate(() => scrollY)));
    await expect
      .poll(() => page.evaluate(() => globalThis.santensorExperience.progress))
      .toBeCloseTo(i, 2);
    poses.push(
      await page.locator('[data-surface="0"]').getAttribute("data-pose"),
    );
    expect(
      await page.evaluate(() =>
        globalThis.surfaceReferences.every(
          (el, i) => el === document.querySelector(`[data-surface="${i}"]`),
        ),
      ),
    ).toBe(true);
    if (i === 1 || i === 2) {
      await page.locator('[data-context="0"]').click();
      await expect(page.locator(".context-inspector")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.locator(".context-inspector")).toBeHidden();
    }
  }
  expect(poses[1]).toBe(poses[5]);
  expect(poses[2]).toBe(poses[4]);
  expect(poses[0]).toBe(poses[6]);
  // Intermediate scroll must produce an intermediate pose, not switch discrete slides.
  await page.mouse.wheel(0, 720);
  await expect
    .poll(() => page.evaluate(() => globalThis.santensorExperience.progress))
    .toBeCloseTo(0.5, 2);
  expect(
    await page.locator('[data-surface="0"]').getAttribute("data-pose"),
  ).not.toBe(poses[0]);
  await writeFile(
    `${evidence}/continuity.json`,
    JSON.stringify(
      { poses, errors, persistent: true, intermediate: true },
      null,
      2,
    ),
  );
  expect(errors).toEqual([]);
});

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
])
  test(`EN ES preserves camera, run, failure and result ${viewport.width}`, async ({
    browser,
  }) => {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.goto("/");
    await go(page, 2);
    await page.locator('[data-context="3"]').click();
    await expect(page.locator(".context-inspector")).toContainText(
      "local mock",
    );
    await page.locator("[data-language]").click();
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(page.locator(".context-inspector")).toContainText(
      "Simulador local",
    );
    await expect
      .poll(() => page.evaluate(() => globalThis.santensorExperience.progress))
      .toBeCloseTo(2, 2);
    await go(page, 3);
    await page.locator("[data-break]").click();
    await expect(page.locator("[data-retry]")).toBeVisible();
    const before = await page.evaluate(
      () => globalThis.santensorExperience.operation.run,
    );
    await page.locator("[data-language]").click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    expect(
      await page.evaluate(() => globalThis.santensorExperience.operation.run),
    ).toEqual(before);
    await expect(page.locator("[data-retry]")).toContainText("Recover");
    await page.locator("[data-retry]").click();
    await page.locator("[data-step]").click();
    await page.locator("[data-approve]").click();
    await go(page, 4);
    await page.locator("[data-language]").click();
    await expect(page.locator(".result-summary")).toContainText("Aprobada");
    await expect(page).toHaveURL(/\/es\/#scene-4$/);
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect
      .poll(() => page.evaluate(() => globalThis.santensorExperience.progress))
      .toBeCloseTo(4, 2);
    await expect(page.locator(".result-summary")).toContainText(
      "Aún no hay resultado",
    );
    await context.close();
  });

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
  { width: 360, height: 740 },
])
  test(`layout, keyboard and accessibility ${viewport.width}`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const reports = [];
    for (const language of ["en", "es"]) {
      await page.goto(language === "en" ? "/" : "/es/");
      for (const scene of [0, 1, 2, 3, 4]) {
        await go(page, scene);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        const report = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        reports.push({ language, scene, violations: report.violations });
      }
      for (const route of ["labs", "cases", "contact", "privacy"]) {
        await page.goto(`${language === "es" ? "/es" : ""}/${route}/`);
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
    await expect
      .poll(() => page.evaluate(() => globalThis.santensorExperience.progress))
      .toBeCloseTo(3, 2);
    await page.keyboard.press("Tab");
    await expect(page.locator("[data-request]")).toBeFocused();
    await page.keyboard.press("ControlOrMeta+A");
    await page.keyboard.type(
      "SYNTHETIC: Account NS-204 requests 10 accounts for a fictional test.",
    );
    await page.keyboard.press("Tab");
    await expect(page.locator("[data-run]")).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("[data-review]")).toBeVisible();
    for (let i = 0; i < 30 && !(await page.locator('[data-approve]').evaluate(el => el === document.activeElement)); i++) await page.keyboard.press('Tab');
    await expect(page.locator('[data-approve]')).toBeFocused();
    await page.keyboard.press("Enter");
    expect(
      (await page.evaluate(() => globalThis.santensorExperience.operation.run))
        .result.outcome,
    ).toBe("approved");
    expect(
      (await page.evaluate(() => globalThis.santensorExperience.stats())).mode,
    ).toBe("css-fallback");
    const before = await page.evaluate(() => scrollY);
    await page.mouse.move(viewport.width / 2, 400);
    await page.mouse.wheel(0, -800);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(before);
    await context.close();
  });

test("no WebGL and JavaScript-disabled accessible paths", async ({
  browser,
}) => {
  const page = await browser.newPage();
  await page.goto("/?graphics-off#scene-3");
  await expect
    .poll(() =>
      page.evaluate(() => globalThis.santensorExperience.stats().mode),
    )
    .toBe("css-fallback");
  await expect(page.locator("[data-run]")).toBeVisible();
  await page.locator("[data-run]").click();
  await expect(page.locator("[data-review]")).toBeVisible();
  await page.close();
  const context = await browser.newContext({ javaScriptEnabled: false });
  const fallback = await context.newPage();
  await fallback.goto("/es/");
  await expect(fallback.locator(".nojs")).toBeVisible();
  await expect(fallback.locator('header [data-route="contact"]')).toBeVisible();
  await fallback.locator('header [data-route="contact"]').click();
  await expect(fallback.locator('a[href^="mailto:"]').first()).toBeVisible();
  await context.close();
});
