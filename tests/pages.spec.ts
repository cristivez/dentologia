import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { servicePages, SERVICE_PAGE_SLUGS } from "../src/data/servicePages";

// Three themed intro cards on /servicii, above the per-service detail grid.
const THEMED_CARDS = 3;

test.describe("Phase 3 — Homepage", () => {
  test("homepage h1 targets the local search term", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText(
      "Clinică stomatologică în Câmpulung Muscel",
    );
  });

  test("homepage prices section shows one category at a time", async ({
    page,
  }) => {
    await page.goto("/");
    const tablist = page.getByRole("tablist", {
      name: "Categorii de prețuri",
    });
    await tablist.scrollIntoViewIfNeeded();
    await expect(tablist.getByRole("tab")).toHaveCount(7);

    // Exactly one panel, showing only the selected category's rows.
    const panel = page.locator('[role="tabpanel"]');
    await expect(panel).toHaveCount(1);
    await expect(panel.locator("tbody tr")).toHaveCount(2); // Consultații
  });

  test("switching a homepage price tab swaps the table", async ({ page }) => {
    await page.goto("/");
    const tablist = page.getByRole("tablist", {
      name: "Categorii de prețuri",
    });
    await tablist.scrollIntoViewIfNeeded();
    await tablist.getByRole("tab", { name: "Ortodonție" }).click();

    const panel = page.locator('[role="tabpanel"]');
    await expect(panel.locator("tbody tr")).toHaveCount(27);
    await expect(panel).toContainText("Aparat autoligaturant Damon");
    await expect(
      tablist.getByRole("tab", { name: "Ortodonție" }),
    ).toHaveAttribute("aria-selected", "true");
  });

  test("homepage prices link out to the category page and full list", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator('main a[href="/preturi/general"]')).toBeVisible();
    await expect(page.locator('main a[href="/preturi"]')).toBeVisible();
  });

  test("homepage has CTA buttons", async ({ page }) => {
    await page.goto("/");
    // Scope to <main>: an unscoped `.first()` matches the /servicii link in
    // the header nav, which is `hidden md:flex` and so invisible on a phone.
    // The hero CTAs live in the page body and must be visible at every width.
    const servicesBtn = page.locator('main a[href="/servicii"]').first();
    const contactBtn = page.locator('main a[href="/contact"]').first();
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
    await expect(page.locator("h2").first()).toContainText(
      "Serviciile noastre",
    );
  });

  test("services page has both the themed and the detailed sections", async ({
    page,
  }) => {
    await page.goto("/servicii");
    await expect(
      page.getByRole("heading", { level: 2, name: "Servicii detaliate" }),
    ).toBeVisible();
    // Three themed cards plus one detail card per dedicated service page.
    await expect(page.locator("main a[href^='/servicii/']")).toHaveCount(
      THEMED_CARDS + servicePages.length,
    );
  });

  test("services page lists every dedicated service page", async ({ page }) => {
    await page.goto("/servicii");
    await expect(page.locator("main h3")).toHaveCount(servicePages.length);
    // Every slug is actually linked, so adding a page can't silently drop it.
    for (const slug of SERVICE_PAGE_SLUGS) {
      await expect(
        page.locator(`main a[href="/servicii/${slug}"]`).first(),
      ).toBeVisible();
    }
  });

  test("each card has a feature list", async ({ page }) => {
    await page.goto("/servicii");
    const lists = page.locator("ul");
    const count = await lists.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("each themed card links to its dedicated service page", async ({
    page,
  }) => {
    await page.goto("/servicii");
    for (const slug of [
      "urgente-stomatologice",
      "implant-dentar",
      "aparat-dentar",
    ]) {
      await expect(
        page.locator(`main a[href="/servicii/${slug}"]`).first(),
      ).toBeVisible();
    }
  });

  test("no link points at the removed ?tab=implant price page", async ({
    page,
  }) => {
    await page.goto("/servicii");
    await expect(page.locator('a[href*="tab=implant"]')).toHaveCount(0);
    await page.goto("/");
    await expect(page.locator('a[href*="tab=implant"]')).toHaveCount(0);
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
    expect(count).toBe(servicePages.length);

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
