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
  test("no cookie-consent banner (analytics is cookieless)", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    // The old banner appeared after a 1.5s delay; wait past that and assert
    // it never shows, since Cloudflare Web Analytics sets no cookies.
    await page.waitForTimeout(2000);
    await expect(page.locator("text=Folosim cookie-uri")).toHaveCount(0);
  });

  test("privacy page renders", async ({ page }) => {
    await page.goto("/confidentialitate", { waitUntil: "networkidle" });
    // Page title is the <h1> now (was an <h2>, leaving the page h1-less).
    await expect(page.locator("h1")).toContainText("confidențialitate");
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

  // Unknown URLs used to get Next's bare English default ("This page could not
  // be found") because only notFound() calls inside [locale] reach the styled
  // page. The root not-found must carry the site: Romanian copy, header, footer.
  test("404 page is the Romanian site page, not Next's default", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/nonexistent-page-xyz", { waitUntil: "networkidle" });
    await expect(page.locator("html")).toHaveAttribute("lang", "ro");
    await expect(page.getByText("Pagina nu a fost găsită.")).toBeVisible();
    await expect(page.getByText("This page could not be found")).toHaveCount(0);
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Înapoi acasă" }),
    ).toHaveAttribute("href", "/");
    await expect(page).toHaveTitle(/Pagina nu a fost găsită/);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const critical = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(critical).toHaveLength(0);
  });
});
