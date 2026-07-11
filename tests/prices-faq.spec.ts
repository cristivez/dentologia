import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { totalServiceItems } from "../src/data/services";

test.describe("Prices page — full list", () => {
  test("renders all 7 categories on one page", async ({ page }) => {
    await page.goto("/preturi", { waitUntil: "networkidle" });
    for (const slug of [
      "general",
      "profilaxie",
      "odontoterapie",
      "endodontie",
      "chirurgie",
      "ortodontie",
      "protetica",
    ]) {
      await expect(page.locator(`section#${slug}`)).toBeVisible();
    }
  });

  test("exposes every price row, not just one category", async ({ page }) => {
    await page.goto("/preturi", { waitUntil: "networkidle" });
    // Every row in the catalogue, derived from the data rather than hardcoded.
    await expect(page.locator("main tbody tr")).toHaveCount(totalServiceItems);
  });

  test("has a real h1 carrying the city", async ({ page }) => {
    await page.goto("/preturi", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText("Câmpulung Muscel");
  });

  test("jump-nav links to each category section", async ({ page }) => {
    await page.goto("/preturi", { waitUntil: "networkidle" });
    const nav = page.getByRole("navigation", { name: "Categorii de prețuri" });
    await expect(nav.locator("a")).toHaveCount(7);
    await expect(nav.locator('a[href="#ortodontie"]')).toBeVisible();
  });

  test("each category deep-links to its own price page", async ({ page }) => {
    await page.goto("/preturi", { waitUntil: "networkidle" });
    await expect(
      page.locator('main a[href="/preturi/ortodontie"]').first(),
    ).toBeVisible();
  });

  test("search filters results", async ({ page }) => {
    await page.goto("/preturi", { waitUntil: "networkidle" });
    await page.locator('input[aria-label*="Caută"]').fill("implant");
    await page.waitForTimeout(300);
    await expect(page.locator("main")).toContainText("implant", {
      ignoreCase: true,
    });
    // The jump-nav is replaced by results while searching.
    await expect(
      page.getByRole("navigation", { name: "Categorii de prețuri" }),
    ).toHaveCount(0);
  });

  test("search with no results shows message", async ({ page }) => {
    await page.goto("/preturi", { waitUntil: "networkidle" });
    await page.locator('input[aria-label*="Caută"]').fill("xyznoexist");
    await page.waitForTimeout(300);
    await expect(page.locator("main")).toContainText("Niciun serviciu găsit");
  });

  test("clearing the search restores the full list", async ({ page }) => {
    await page.goto("/preturi", { waitUntil: "networkidle" });
    const input = page.locator('input[aria-label*="Caută"]');
    await input.fill("implant");
    await page.waitForTimeout(300);
    await page.getByRole("button", { name: "Șterge căutarea" }).click();
    await page.waitForTimeout(300);
    await expect(page.locator("main tbody tr")).toHaveCount(totalServiceItems);
  });

  test("prices page passes accessibility", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/preturi", { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const critical = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(critical).toHaveLength(0);
  });
});

test.describe("Price category pages", () => {
  const categories = [
    ["general", "Consultații"],
    ["profilaxie", "Profilaxie"],
    ["odontoterapie", "Odontoterapie"],
    ["endodontie", "Endodonție"],
    ["chirurgie", "Chirurgie"],
    ["ortodontie", "Ortodonție"],
    ["protetica", "Protetică"],
  ] as const;

  for (const [slug, label] of categories) {
    test(`/preturi/${slug} renders with its own h1 and prices`, async ({
      page,
    }) => {
      const response = await page.goto(`/preturi/${slug}`);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toContainText("Câmpulung Muscel");
      await expect(page.locator("main tbody tr").first()).toBeVisible();
      await expect(
        page.getByRole("navigation", { name: "Alte categorii de prețuri" }),
      ).toBeVisible();
      // The other six categories are linked from this one.
      const others = page.getByRole("navigation", {
        name: "Alte categorii de prețuri",
      });
      await expect(others.locator("a")).toHaveCount(6);
      await expect(others).not.toContainText(label);
    });
  }

  test("emits OfferCatalog structured data", async ({ page }) => {
    await page.goto("/preturi/ortodontie");
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const catalog = blocks.find((b) => b.includes("OfferCatalog"));
    expect(catalog, "no OfferCatalog script found").toBeTruthy();

    const data = JSON.parse(catalog!);
    expect(data["@type"]).toBe("OfferCatalog");
    expect(data.itemListElement.length).toBeGreaterThan(0);

    // A thousands separator must never be read as a decimal point.
    const metal = data.itemListElement.find(
      (o: { name: string }) =>
        o.name.includes("Aparat metalic") && !o.name.includes("segmentar"),
    );
    expect(metal.price).toBe(2700);
    expect(metal.priceCurrency).toBe("RON");
  });

  test("emits exactly one BreadcrumbList", async ({ page }) => {
    await page.goto("/preturi/ortodontie");
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const crumbs = blocks.filter((b) => b.includes("BreadcrumbList"));
    expect(crumbs).toHaveLength(1);
  });

  test("unknown category returns 404, not a soft 404", async ({ page }) => {
    const response = await page.goto("/preturi/nu-exista");
    expect(response?.status()).toBe(404);
  });

  test("category page passes accessibility", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/preturi/ortodontie", { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const critical = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(critical).toHaveLength(0);
  });
});

test.describe("Phase 4 — FAQ Page", () => {
  test("FAQ page has 10 accordion items", async ({ page }) => {
    await page.goto("/intrebari");
    const details = page.locator("details");
    const count = await details.count();
    expect(count).toBe(10);
  });

  test("clicking a question expands the answer", async ({ page }) => {
    await page.goto("/intrebari");

    const firstSummary = page.locator("summary").first();
    await firstSummary.click();

    const firstDetails = page.locator("details").first();
    await expect(firstDetails).toHaveAttribute("open", "");
  });

  test("FAQ page passes accessibility", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/intrebari", { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const critical = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(critical).toHaveLength(0);
  });
});

test.describe("Phase 4 — Mobile", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("category jump-nav is scrollable on mobile", async ({ page }) => {
    await page.goto("/preturi", { waitUntil: "networkidle" });
    const nav = page.getByRole("navigation", { name: "Categorii de prețuri" });
    await expect(nav).toBeVisible();
    const overflow = await nav
      .locator("ul")
      .evaluate((el) => getComputedStyle(el).overflowX);
    expect(overflow).toBe("auto");
  });
});
