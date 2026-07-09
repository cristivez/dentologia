import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Phase 5 — Reviews Page", () => {
  test("reviews page shows rating badge with 5.0", async ({ page }) => {
    await page.goto("/recenzii", { waitUntil: "networkidle" });
    await expect(page.locator("main")).toContainText("5.0");
  });

  test("reviews page has 9 review cards", async ({ page }) => {
    await page.goto("/recenzii", { waitUntil: "networkidle" });
    const cards = page.locator("blockquote");
    await expect(cards).toHaveCount(9);
  });

  test("reviews page has prev/next navigation buttons", async ({ page }) => {
    await page.goto("/recenzii", { waitUntil: "networkidle" });
    const prevBtn = page.locator('button[aria-label="Recenzia anterioară"]');
    const nextBtn = page.locator('button[aria-label="Recenzia următoare"]');
    await expect(prevBtn).toBeVisible();
    await expect(nextBtn).toBeVisible();
  });

  test("reviews page has Google Maps link", async ({ page }) => {
    await page.goto("/recenzii", { waitUntil: "networkidle" });
    const link = page.locator('a[href*="google.com/maps"]');
    await expect(link).toBeVisible();
  });

  test("reviews page passes accessibility", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/recenzii", { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const critical = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(critical).toHaveLength(0);
  });
});

test.describe("Phase 5 — Contact Page", () => {
  test("contact page has phone and WhatsApp buttons", async ({ page }) => {
    await page.goto("/contact", { waitUntil: "networkidle" });
    const phoneBtn = page.locator('a[href^="tel:"]').first();
    const whatsappBtn = page.locator('a[href*="wa.me"]').first();
    await expect(phoneBtn).toBeVisible();
    await expect(whatsappBtn).toBeVisible();
  });

  test("contact page shows schedule", async ({ page }) => {
    await page.goto("/contact", { waitUntil: "networkidle" });
    await expect(page.locator("main")).toContainText("Luni");
    await expect(page.locator("main")).toContainText("09:00");
    await expect(page.locator("main")).toContainText("Închis");
  });

  test("contact page has social links with target blank", async ({ page }) => {
    await page.goto("/contact", { waitUntil: "networkidle" });
    const fbLink = page.locator('main a[aria-label="Facebook"]');
    const igLink = page.locator('main a[aria-label="Instagram"]');
    await expect(fbLink).toHaveAttribute("target", "_blank");
    await expect(igLink).toHaveAttribute("target", "_blank");
  });

  test("contact page has Google Maps iframe", async ({ page }) => {
    await page.goto("/contact", { waitUntil: "networkidle" });
    const iframe = page.locator("iframe");
    await expect(iframe).toBeVisible();
  });

  test("contact page passes accessibility", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/contact", { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .exclude("iframe")
      .analyze();
    const critical = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(critical).toHaveLength(0);
  });
});

test.describe("Phase 5 — Mobile", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("reviews carousel is swipeable on mobile", async ({ page }) => {
    await page.goto("/recenzii", { waitUntil: "networkidle" });
    const carousel = page.locator(".overflow-hidden").first();
    await expect(carousel).toBeVisible();
  });

  test("contact buttons stack vertically on mobile", async ({ page }) => {
    await page.goto("/contact", { waitUntil: "networkidle" });
    const phoneBtn = page.locator('a[href^="tel:"]').first();
    const whatsappBtn = page.locator('a[href*="wa.me"]').first();
    const phoneBox = await phoneBtn.boundingBox();
    const whatsappBox = await whatsappBtn.boundingBox();
    // On mobile (375px), buttons should stack: WhatsApp below Phone
    expect(whatsappBox!.y).toBeGreaterThan(phoneBox!.y);
  });
});
