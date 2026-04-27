import { defineConfig, devices } from "@playwright/test";

/**
 * Standard-Playwright-Konfig fuer alle Webseiten-Projekte.
 * Vom stress-tester-Agent erwartet. Nicht von Hand ueberschreiben –
 * lieber projektspezifische Aenderungen via TEST_BASE_URL etc.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  // Nur Playwright-Specs matchen. *.test.ts gehoert Vitest und wuerde
  // sonst hier eingelesen werden (Konfusion zwischen Vitest und PW).
  testMatch: /.*\.spec\.ts$/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  outputDir: "test-results/artifacts",
  reporter: [
    ["list"],
    ["json", { outputFile: "test-results/results.json" }],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  use: {
    baseURL: process.env.TEST_BASE_URL ?? "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
  },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 5"] },
    },
  ],
});
