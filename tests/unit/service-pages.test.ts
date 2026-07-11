import { describe, it, expect } from "vitest";
import {
  serviceCategories,
  isServiceCategorySlug,
  SERVICE_CATEGORY_SLUGS,
  itemsByName,
} from "@/data/services";
import { getServiceCategory } from "@/data/services";
import {
  servicePages,
  getServicePage,
  priceItemsFor,
  SERVICE_PAGE_SLUGS,
} from "@/data/servicePages";
import { SCHEDULE } from "@/lib/constants";

describe("Price tab slugs", () => {
  it("accepts every real category slug", () => {
    for (const slug of SERVICE_CATEGORY_SLUGS) {
      expect(isServiceCategorySlug(slug)).toBe(true);
    }
  });

  /**
   * Regression: the homepage and services page both linked to
   * `/preturi?tab=implant`, a slug that has never existed. The price page
   * looked it up, found nothing, and rendered no table at all.
   */
  it("rejects 'implant', which linked to an empty price page", () => {
    expect(isServiceCategorySlug("implant")).toBe(false);
  });

  it("rejects unknown, empty, and nullish values", () => {
    expect(isServiceCategorySlug("nope")).toBe(false);
    expect(isServiceCategorySlug("")).toBe(false);
    expect(isServiceCategorySlug(null)).toBe(false);
    expect(isServiceCategorySlug(undefined)).toBe(false);
  });

  it("the declared slug list matches the actual category data", () => {
    expect([...SERVICE_CATEGORY_SLUGS].sort()).toEqual(
      serviceCategories.map((c) => c.slug).sort(),
    );
  });
});

describe("Service pages", () => {
  it("exposes one page per declared slug", () => {
    expect(servicePages.map((p) => p.slug).sort()).toEqual(
      [...SERVICE_PAGE_SLUGS].sort(),
    );
  });

  it("resolves every declared slug and rejects unknown ones", () => {
    for (const slug of SERVICE_PAGE_SLUGS) {
      expect(getServicePage(slug)).toBeDefined();
    }
    expect(getServicePage("nu-exista")).toBeUndefined();
  });

  /**
   * Service pages select price rows by exact name. A typo would silently drop
   * the row rather than fail, so assert every name resolves.
   */
  it("every priceItemName resolves to a real row in services.ts", () => {
    const known = new Set(
      serviceCategories.flatMap((c) => c.items.map((i) => i.name)),
    );
    for (const page of servicePages) {
      for (const name of page.priceItemNames) {
        expect(known, `${page.slug} references "${name}"`).toContain(name);
      }
    }
  });

  it("every page renders at least one price row", () => {
    for (const page of servicePages) {
      expect(priceItemsFor(page).length, page.slug).toBeGreaterThan(0);
    }
  });

  it("itemsByName pulls rows across category boundaries", () => {
    const rows = itemsByName([
      "Consultație de specialitate",
      "Element zirconiu implant",
    ]);
    expect(rows).toHaveLength(2);
  });

  it("Offer prices are bare numbers, as schema.org requires", () => {
    for (const page of servicePages) {
      for (const offer of page.offers) {
        expect(offer.price, `${page.slug} → ${offer.name}`).toMatch(/^\d+$/);
      }
    }
  });

  it("has unique, non-empty metadata per page", () => {
    const titles = servicePages.map((p) => p.title);
    expect(new Set(titles).size).toBe(titles.length);
    for (const page of servicePages) {
      expect(page.h1).toBeTruthy();
      expect(page.metaDescription.length).toBeLessThanOrEqual(165);
      expect(page.faq.length).toBeGreaterThan(0);
    }
  });

  it("related slugs point at pages that exist and never at self", () => {
    for (const page of servicePages) {
      for (const rel of page.relatedSlugs) {
        expect(getServicePage(rel), `${page.slug} → ${rel}`).toBeDefined();
        expect(rel).not.toBe(page.slug);
      }
    }
  });

  it("every service page links to a real price category", () => {
    for (const page of servicePages) {
      expect(
        getServiceCategory(page.priceCategory),
        `${page.slug} → /preturi/${page.priceCategory}`,
      ).toBeDefined();
    }
  });

  it("the linked category actually contains some of the page's price rows", () => {
    for (const page of servicePages) {
      const category = getServiceCategory(page.priceCategory)!;
      const categoryNames = new Set(category.items.map((i) => i.name));
      const overlap = page.priceItemNames.filter((n) => categoryNames.has(n));
      expect(
        overlap.length,
        `${page.slug} links to ${page.priceCategory} but shares no rows with it`,
      ).toBeGreaterThan(0);
    }
  });
});

/**
 * Regression: OpeningHoursSpecification emitted `dayOfWeek: "Luni"`. Google
 * discards the entire block unless the schema.org English enum is used, so the
 * clinic's hours never appeared in search results.
 */
describe("Schedule schema mapping", () => {
  it("every day carries a valid schema.org DayOfWeek", () => {
    const valid = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    for (const entry of SCHEDULE) {
      expect(valid, `${entry.day} → ${entry.schemaDay}`).toContain(
        entry.schemaDay,
      );
    }
  });

  it("maps Romanian labels to the correct English day, in order", () => {
    expect(SCHEDULE.map((s) => s.schemaDay)).toEqual([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ]);
  });
});
