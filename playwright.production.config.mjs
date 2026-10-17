import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  testMatch: ["production.spec.mjs", "hardening.spec.mjs", "evidence-navigation.spec.mjs"],
  workers: 1,
  retries: 0,
  timeout: 60000,
  reporter: [
    ["list"],
    [
      "json",
      {
        outputFile: `${process.env.SITE_EVIDENCE_DIR ?? "evidence/v4-production/local"}/browser-results.json`,
      },
    ],
  ],
  use: {
    baseURL: process.env.SITE_TEST_URL ?? "http://127.0.0.1:4182",
    viewport: { width: 1440, height: 900 },
  },
  webServer: process.env.SITE_TEST_URL
    ? undefined
    : {
        command: "node scripts/serve-production.mjs",
        url: "http://127.0.0.1:4182",
        reuseExistingServer: true,
      },
});
