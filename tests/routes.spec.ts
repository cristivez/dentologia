import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Phase 1 — Foundation", () => {
  test("homepage returns 200 and renders", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
  });

  test("homepage renders clinic name in h1", async ({ page }) => {
    await page.goto("/");
    const h1 = page.locator("h1");
    await expect(h1).toContainText("Dentologia");
  });

  test("page has no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });
    await page.goto("/", { waitUntil: "networkidle" });
    // Filter out known non-critical warnings
    const criticalErrors = errors.filter(
      (e) => !e.includes("Download the React DevTools"),
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test("skip-to-content link is present", async ({ page }) => {
    await page.goto("/");
    const skipLink = page.locator(".skip-to-content");
    await expect(skipLink).toBeAttached();
  });

  test("page uses correct lang attribute", async ({ page }) => {
    await page.goto("/");
    const lang = await page.locator("html").getAttribute("lang");
    expect(lang).toBe("ro");
  });

  test("no critical accessibility violations", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const critical = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(critical).toHaveLength(0);
  });
});
