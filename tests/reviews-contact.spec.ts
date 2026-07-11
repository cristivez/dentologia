import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Phase 5 — Reviews Page", () => {
  test("reviews page shows the real Google rating", async ({ page }) => {
    await page.goto("/recenzii", { waitUntil: "networkidle" });
    // Romanian decimal comma, and the verified count from the Google profile.
    await expect(page.locator("main")).toContainText("5,0");
    await expect(page.locator("main")).toContainText("15 recenzii pe Google");
  });

  test("reviews page shows no fabricated testimonials", async ({ page }) => {
    await page.goto("/recenzii", { waitUntil: "networkidle" });
    const main = page.locator("main");
    for (const name of ["Andrei M.", "Elena I.", "Maria P.", "George B."]) {
      await expect(main).not.toContainText(name);
    }
  });

  test("reviews page never claims more reviews than Google reports", async ({
    page,
  }) => {
    await page.goto("/recenzii", { waitUntil: "networkidle" });
    const quotes = await page.locator("blockquote").count();
    expect(quotes).toBeLessThanOrEqual(15);
  });

  test("reviews page links to the real Google listing", async ({ page }) => {
    await page.goto("/recenzii", { waitUntil: "networkidle" });
    const link = page
      .locator('a[href="https://www.google.com/maps?cid=15236386707900164590"]')
      .first();
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

  test("reviews page renders its Google panel on mobile", async ({ page }) => {
    await page.goto("/recenzii", { waitUntil: "networkidle" });
    await expect(
      page.getByRole("heading", { name: "Recenziile noastre sunt pe Google" }),
    ).toBeVisible();
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
