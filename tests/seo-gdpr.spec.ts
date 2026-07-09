import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Phase 6 — SEO", () => {
  test("homepage has JSON-LD scripts", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const jsonLd = page.locator('script[type="application/ld+json"]');
    const count = await jsonLd.count();
    expect(count).toBeGreaterThanOrEqual(2); // LocalBusiness + WebSite
  });

  test("FAQ page has FAQPage JSON-LD", async ({ page }) => {
    await page.goto("/intrebari", { waitUntil: "networkidle" });
    const scripts = page.locator('script[type="application/ld+json"]');
    const texts: string[] = [];
    for (let i = 0; i < (await scripts.count()); i++) {
      texts.push((await scripts.nth(i).textContent()) ?? "");
    }
    const hasFaq = texts.some((t) => t.includes("FAQPage"));
    expect(hasFaq).toBe(true);
  });

  test("sitemap.xml returns valid XML", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);
    const text = await page.content();
    expect(text).toContain("urlset");
    expect(text).toContain("dentologia.ro");
  });

  test("robots.txt returns 200", async ({ page }) => {
    const response = await page.goto("/robots.txt");
    expect(response?.status()).toBe(200);
    const text = await page.content();
    expect(text).toContain("sitemap");
  });
});

test.describe("Phase 6 — GDPR", () => {
  test("cookie banner appears on first visit", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    // Wait for 1.5s delay + render
    await page.waitForTimeout(2000);
    await expect(page.locator("text=Folosim cookie-uri")).toBeVisible();
  });

  test("accepting cookies hides banner", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
    await page.locator("button", { hasText: "Accept" }).click();
    await expect(page.locator("text=Folosim cookie-uri")).not.toBeVisible();
  });

  test("cookie banner does not reappear after accept", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
    await page.locator("button", { hasText: "Accept" }).click();
    // Reload
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
    await expect(page.locator("text=Folosim cookie-uri")).not.toBeVisible();
  });

  test("privacy page renders", async ({ page }) => {
    await page.goto("/confidentialitate", { waitUntil: "networkidle" });
    await expect(page.locator("h2")).toContainText("confidențialitate");
  });

  test("privacy page passes accessibility", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/confidentialitate", { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const critical = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(critical).toHaveLength(0);
  });
});

test.describe("Phase 6 — Error Pages", () => {
  test("404 page renders for unknown routes", async ({ page }) => {
    const response = await page.goto("/nonexistent-page-xyz", {
      waitUntil: "networkidle",
    });
    expect(response?.status()).toBe(404);
  });
});
