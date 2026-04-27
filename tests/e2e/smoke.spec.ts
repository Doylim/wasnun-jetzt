import { expect, test } from "@playwright/test";

/**
 * Generischer Smoke-Test. Vom stress-tester-Agent ausgefuehrt.
 *
 * Pro Projekt sollten zusaetzliche Spec-Dateien angelegt werden
 * (z.B. tests/e2e/kontaktform.spec.ts, tests/e2e/buchung.spec.ts).
 * Dieser Smoke-Test bleibt aber UNANGETASTET – er ist die Baseline.
 */

test.describe("Smoke", () => {
  test("Startseite antwortet mit 200 und hat Title", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBeLessThan(400);
    await expect(page).toHaveTitle(/.+/);
  });

  test("Startseite hat ein H1", async ({ page }) => {
    await page.goto("/");
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
  });

  test("Hauptnavigation hat mindestens einen Link", async ({ page }) => {
    await page.goto("/");
    const navLinks = page.locator("header a, nav a");
    expect(await navLinks.count()).toBeGreaterThan(0);
  });

  test("Mobile-Viewport ohne horizontalen Overflow", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth - document.documentElement.clientWidth;
    });
    expect(overflow, `Horizontaler Overflow: ${overflow}px`).toBeLessThanOrEqual(2);
  });

  test("Tap-Targets im Header sind >= 44x44 px (Mobile)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    const tooSmall = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll("header a, header button"));
      return elements
        .map((el) => {
          const rect = (el as HTMLElement).getBoundingClientRect();
          return { tag: el.tagName, w: rect.width, h: rect.height, text: (el.textContent ?? "").trim().slice(0, 40) };
        })
        .filter((x) => (x.w > 0 && x.w < 44) || (x.h > 0 && x.h < 44));
    });
    expect(tooSmall, `Zu kleine Tap-Targets: ${JSON.stringify(tooSmall)}`).toEqual([]);
  });

  test("Anchor-Links auf der Startseite haben passende Targets", async ({ page }) => {
    await page.goto("/");
    const ankerProbleme = await page.evaluate(() => {
      const anker = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
      return anker
        .map((a) => {
          const id = a.getAttribute("href")?.slice(1);
          if (!id || id === "" || id === "top") return null;
          const target = document.getElementById(id);
          return target ? null : { href: a.getAttribute("href"), text: a.textContent?.trim().slice(0, 40) };
        })
        .filter(Boolean);
    });
    expect(ankerProbleme, `Tote Anker: ${JSON.stringify(ankerProbleme)}`).toEqual([]);
  });

  test("Skip-Link zum Hauptinhalt vorhanden", async ({ page }) => {
    await page.goto("/");
    const skipLinks = page.locator('a[href="#main"], a[href="#hauptinhalt"], a[href="#content"]');
    const count = await skipLinks.count();
    expect(count, "Kein Skip-Link gefunden – Accessibility-Pflicht laut CLAUDE.md").toBeGreaterThan(0);
  });
});
