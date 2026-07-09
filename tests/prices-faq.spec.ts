import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Phase 4 — Prices Page", () => {
  test("prices page renders with 7 tabs", async ({ page }) => {
    await page.goto("/preturi", { waitUntil: "networkidle" });
    const tabs = page.locator('[role="tab"]');
    const count = await tabs.count();
    expect(count).toBe(7);
  });

  test("clicking a tab shows its content", async ({ page }) => {
    await page.goto("/preturi", { waitUntil: "networkidle" });

    // Click "Chirurgie" tab
    const chirurgieTab = page.locator('[role="tab"]', {
      hasText: "Chirurgie",
    });
    await chirurgieTab.click();

    // Should show chirurgie items
    const tabpanel = page.locator('[role="tabpanel"]');
    await expect(tabpanel).toContainText("Extracție");
  });

  test("default tab is active", async ({ page }) => {
    await page.goto("/preturi", { waitUntil: "networkidle" });
    const firstTab = page.locator('[role="tab"]').first();
    const selected = await firstTab.getAttribute("aria-selected");
    expect(selected).toBe("true");
  });

  test("search filters results", async ({ page }) => {
    await page.goto("/preturi", { waitUntil: "networkidle" });

    const searchInput = page.locator('input[aria-label*="Caută"]');
    await searchInput.fill("implant");

    // Wait for debounce
    await page.waitForTimeout(300);

    // Should show results containing "implant"
    await expect(page.locator("main")).toContainText("implant", {
      ignoreCase: true,
    });
  });

  test("search with no results shows message", async ({ page }) => {
    await page.goto("/preturi", { waitUntil: "networkidle" });

    const searchInput = page.locator('input[aria-label*="Caută"]');
    await searchInput.fill("xyznoexist");

    await page.waitForTimeout(300);
    await expect(page.locator("main")).toContainText("Niciun serviciu găsit");
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

  test("prices tab bar is scrollable on mobile", async ({ page }) => {
    await page.goto("/preturi", { waitUntil: "networkidle" });
    const tablist = page.locator('[role="tablist"]');
    await expect(tablist).toBeVisible();
    // Check overflow style allows scrolling
    const overflow = await tablist.evaluate(
      (el) => getComputedStyle(el).overflowX,
    );
    expect(overflow).toBe("auto");
  });
});
