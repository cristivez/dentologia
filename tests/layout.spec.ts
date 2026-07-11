import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Phase 2 — Layout", () => {
  test("header is visible on page load", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const header = page.locator("header");
    await expect(header).toBeVisible();
  });

  test("header hides on scroll down and reappears on scroll up", async ({
    page,
  }) => {
    // Use services page which has scrollable content
    await page.goto("/servicii", { waitUntil: "networkidle" });
    const header = page.locator("header");

    // Scroll down past threshold
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(600);
    await expect(header).toHaveClass(/-translate-y-full/);

    // Scroll back up
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);
    await expect(header).not.toHaveClass(/-translate-y-full/);
  });

  test("desktop nav has all navigation links", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator('nav[aria-label="Navigare principală"]');
    await expect(nav).toBeVisible();

    // Assert the real routes are present rather than a magic count, so adding
    // a nav item doesn't require editing a number here.
    for (const href of [
      "/",
      "/servicii",
      "/preturi",
      "/echipa",
      "/recenzii",
      "/intrebari",
      "/blog",
      "/contact",
    ]) {
      await expect(nav.locator(`a[href="${href}"]`)).toBeVisible();
    }
  });

  test("footer is visible with copyright text", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer).toContainText("Dentologia");
    await expect(footer).toContainText(new Date().getFullYear().toString());
  });

  test("floating contact FAB appears after delay", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    // FAB appears after 1s delay
    const fabButton = page.locator('button[aria-label="Contact rapid"]');
    await expect(fabButton).toBeVisible({ timeout: 3000 });
  });

  test("FAB expands to show phone and WhatsApp options", async ({ page }) => {
    await page.goto("/servicii", { waitUntil: "networkidle" });
    const fabButton = page.locator('button[aria-label="Contact rapid"]');
    await expect(fabButton).toBeVisible({ timeout: 3000 });

    await fabButton.click();

    const phoneLink = page.locator('a[aria-label="Sună acum"]');
    const whatsappLink = page.locator('a[aria-label="WhatsApp"]');
    await expect(phoneLink).toBeVisible();
    await expect(whatsappLink).toBeVisible();
  });

  test("skip-to-content link exists and points to main", async ({ page }) => {
    await page.goto("/");
    const skipLink = page.locator(".skip-to-content");
    await expect(skipLink).toBeAttached();
    const href = await skipLink.getAttribute("href");
    expect(href).toBe("#main");
  });

  test("no critical accessibility violations with layout", async ({ page }) => {
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

test.describe("Phase 2 — Mobile Layout", () => {
  test.use({
    viewport: { width: 375, height: 812 },
    hasTouch: true,
  });

  test("mobile menu opens and closes", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    // Hamburger should be visible on mobile
    const hamburger = page.locator('button[aria-label="Deschide meniul"]');
    await expect(hamburger).toBeVisible();

    // Open menu
    await hamburger.click();

    // Mobile nav should be visible
    const mobileNav = page.locator('nav[aria-label="Meniu mobil"]');
    await expect(mobileNav).toBeVisible();

    // Close menu
    const closeBtn = mobileNav.locator('button[aria-label="Închide meniul"]');
    await closeBtn.click();
    await expect(mobileNav).not.toBeVisible();
  });

  test("mobile menu has all nav links", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const hamburger = page.locator('button[aria-label="Deschide meniul"]');
    await hamburger.click();

    const mobileNav = page.locator('nav[aria-label="Meniu mobil"]');
    // Every route link plus the phone link at the bottom.
    for (const href of [
      "/",
      "/servicii",
      "/preturi",
      "/echipa",
      "/recenzii",
      "/intrebari",
      "/blog",
      "/contact",
    ]) {
      await expect(mobileNav.locator(`a[href="${href}"]`)).toBeVisible();
    }
    await expect(mobileNav.locator('a[href^="tel:"]')).toBeVisible();
  });

  test("mobile menu has phone number", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const hamburger = page.locator('button[aria-label="Deschide meniul"]');
    await hamburger.click();

    const mobileNav = page.locator('nav[aria-label="Meniu mobil"]');
    await expect(mobileNav).toContainText("0750 486 564");
  });
});
