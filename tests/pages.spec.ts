import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Phase 3 — Homepage", () => {
  test("homepage renders h1 with Dentologia", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Dentologia");
  });

  test("homepage has CTA buttons", async ({ page }) => {
    await page.goto("/");
    const servicesBtn = page.locator('a[href="/servicii"]').first();
    const contactBtn = page.locator('a[href="/contact"]').first();
    await expect(servicesBtn).toBeVisible();
    await expect(contactBtn).toBeVisible();
  });

  test("homepage has logo image", async ({ page }) => {
    await page.goto("/");
    const logo = page.locator('img[alt*="Logo"]');
    await expect(logo).toBeVisible();
  });

  test("homepage passes accessibility", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
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

test.describe("Phase 3 — Services Page", () => {
  test("services page renders heading", async ({ page }) => {
    await page.goto("/servicii");
    await expect(page.locator("h2")).toContainText("Serviciile noastre");
  });

  test("services page has 3 service cards", async ({ page }) => {
    await page.goto("/servicii");
    const cards = page.locator("main h3");
    const count = await cards.count();
    expect(count).toBe(3);
  });

  test("each card has a feature list", async ({ page }) => {
    await page.goto("/servicii");
    const lists = page.locator("ul");
    const count = await lists.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("each card links to prices", async ({ page }) => {
    await page.goto("/servicii");
    // Only count links inside main content (exclude header nav)
    const priceLinks = page.locator('main a[href*="/preturi"]');
    const count = await priceLinks.count();
    expect(count).toBe(3);
  });

  test("services page passes accessibility", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/servicii", { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const critical = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(critical).toHaveLength(0);
  });
});

test.describe("Phase 3 — Mobile", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("services page shows single column on mobile", async ({ page }) => {
    await page.goto("/servicii");
    const cards = page.locator("main h3");
    const count = await cards.count();
    expect(count).toBe(3);

    // All cards should be stacked vertically — check first 2 cards have different Y positions
    const card1 = page.locator("main h3").first();
    const card2 = page.locator("main h3").nth(1);
    const box1 = await card1.boundingBox();
    const box2 = await card2.boundingBox();
    expect(box1).not.toBeNull();
    expect(box2).not.toBeNull();
    // In single column, card2 should be below card1
    expect(box2!.y).toBeGreaterThan(box1!.y);
  });
});
