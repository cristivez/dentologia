import { test, expect } from "@playwright/test";
import { totalServiceItems, serviceCategories } from "../src/data/services";

/**
 * Above-the-fold content must be painted by the server, not revealed by
 * JavaScript.
 *
 * `AnimatedSection` emits `style="opacity:0"` into the server HTML and only
 * fades in once framer-motion hydrates — and MotionProvider loads its feature
 * bundle asynchronously. Wrapping a page header in it makes the <h1>, which is
 * the LCP element, invisible until two network round-trips have completed.
 *
 * Disabling JavaScript is the cheapest way to assert the rule: whatever is
 * visible here is what a crawler, a slow phone, and Lighthouse's LCP probe all
 * see first.
 */
test.describe("Above-the-fold content renders without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  const servicePages = [
    ["/servicii/implant-dentar", "Implant dentar în Câmpulung Muscel"],
    ["/servicii/aparat-dentar", "Aparat dentar în Câmpulung Muscel"],
    [
      "/servicii/albire-dentara",
      "Albire dentară profesională în Câmpulung Muscel",
    ],
    [
      "/servicii/detartraj-profesional",
      "Detartraj și igienizare profesională în Câmpulung Muscel",
    ],
    [
      "/servicii/urgente-stomatologice",
      "Urgențe stomatologice în Câmpulung Muscel",
    ],
  ] as const;

  test("homepage h1 is visible with JS off", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("h1")).toContainText("Câmpulung Muscel");
  });

  test("homepage shows the real Google rating with JS off", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("main")).toContainText("15 recenzii pe Google");
  });

  test("homepage prices section renders its default tab with JS off", async ({
    page,
  }) => {
    await page.goto("/");
    const panel = page.locator('[role="tabpanel"]');
    await expect(panel.locator("tbody tr")).toHaveCount(
      serviceCategories[0].items.length,
    );
    await expect(panel).toContainText("Consultație de specialitate");
  });

  for (const [path, heading] of servicePages) {
    test(`${path} renders its h1 and prices with JS off`, async ({ page }) => {
      await page.goto(path);

      const h1 = page.locator("h1");
      await expect(h1).toBeVisible();
      await expect(h1).toHaveText(heading);

      // The price table lives in the sidebar, above the fold on desktop.
      await expect(page.locator("aside table tbody tr").first()).toBeVisible();

      // Phone CTA must be reachable without hydration.
      await expect(
        page.locator('a[href="tel:+40750486564"]').first(),
      ).toBeVisible();
    });
  }

  test("services page heading is visible with JS off", async ({ page }) => {
    await page.goto("/servicii");
    await expect(
      page.getByRole("heading", { level: 2, name: "Serviciile noastre" }),
    ).toBeVisible();
  });

  /**
   * The whole point of dropping the tabs: every price must be in the static
   * HTML. Behind tabs, six of seven categories only existed after hydration.
   */
  test("/preturi ships every price row in static HTML", async ({ page }) => {
    await page.goto("/preturi");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("main tbody tr")).toHaveCount(totalServiceItems);

    for (const cat of serviceCategories) {
      await expect(page.locator(`section#${cat.slug}`)).toBeVisible();
    }
  });

  test("/preturi shows prices from a category that used to be tab-hidden", async ({
    page,
  }) => {
    await page.goto("/preturi");
    // "Aparat autoligaturant Damon" lives in ortodontie, the 6th tab.
    await expect(page.locator("main")).toContainText(
      "Aparat autoligaturant Damon",
    );
    await expect(page.locator("main")).toContainText("4.500 lei / arcadă");
  });

  for (const cat of serviceCategories) {
    test(`/preturi/${cat.slug} renders its h1 and table with JS off`, async ({
      page,
    }) => {
      await page.goto(`/preturi/${cat.slug}`);
      await expect(page.locator("h1")).toHaveText(cat.h1);
      await expect(page.locator("main tbody tr")).toHaveCount(cat.items.length);
    });
  }

  test("no above-the-fold element is hidden at opacity:0 on a service page", async ({
    page,
  }) => {
    await page.goto("/servicii/implant-dentar");
    const hidden = await page.locator('[style*="opacity:0"]').count();
    const h1Hidden = await page.locator('[style*="opacity:0"] h1').count();
    expect(
      h1Hidden,
      "the <h1> must never sit inside an opacity:0 wrapper",
    ).toBe(0);
    // Below-the-fold sections may still fade in; the header block may not.
    // The footer's staggered entrance adds a fixed 3 (CTA band, the columns
    // block, the bottom bar) on every page; the rest is this page's own copy.
    expect(hidden).toBeLessThanOrEqual(9);
  });
});
