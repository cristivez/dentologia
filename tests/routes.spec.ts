import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Phase 1 — Foundation", () => {
  test("homepage returns 200 and renders", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
  });

  test("homepage h1 carries the city, not just the brand name", async ({
    page,
  }) => {
    await page.goto("/");
    const h1 = page.locator("h1");
    await expect(h1).toContainText("Câmpulung Muscel");
    // The brand still appears, as an eyebrow above the h1.
    await expect(page.locator("main")).toContainText("Dentologia");
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

  // Five top-level pages once rendered their title through SectionHeading's
  // default <h2>, leaving the page with no <h1> — an SEO and screen-reader
  // defect that axe's default ruleset does not flag (page-has-heading-one is
  // best-practice, off by default). No per-page test covered them, so it
  // shipped silent. This guards every content route at once.
  const CONTENT_ROUTES = [
    "/",
    "/servicii",
    "/preturi",
    "/echipa",
    "/recenzii",
    "/intrebari",
    "/blog",
    "/contact",
    "/confidentialitate",
  ];

  for (const route of CONTENT_ROUTES) {
    test(`${route} has exactly one <h1>`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator("h1")).toHaveCount(1);
    });
  }
});
