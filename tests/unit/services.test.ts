import { describe, it, expect } from "vitest";
import { serviceCategories, totalServiceItems } from "@/data/services";
import { faqItems } from "@/data/faq";

describe("Service catalog data", () => {
  it("has 7 categories", () => {
    expect(serviceCategories).toHaveLength(7);
  });

  it("every category has a slug, label, and items", () => {
    for (const cat of serviceCategories) {
      expect(cat.slug).toBeTruthy();
      expect(cat.label).toBeTruthy();
      expect(cat.items.length).toBeGreaterThan(0);
    }
  });

  it("every category carries its own page metadata", () => {
    for (const cat of serviceCategories) {
      expect(cat.h1, cat.slug).toContain("Câmpulung Muscel");
      expect(cat.title, cat.slug).toBeTruthy();
      expect(cat.metaDescription.length, cat.slug).toBeLessThanOrEqual(165);
      expect(cat.intro.length, cat.slug).toBeGreaterThan(80);
    }
  });

  it("category titles and h1s are unique", () => {
    const titles = serviceCategories.map((c) => c.title);
    const h1s = serviceCategories.map((c) => c.h1);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(h1s).size).toBe(h1s.length);
  });

  it("every item has a non-empty name and price", () => {
    for (const cat of serviceCategories) {
      for (const item of cat.items) {
        expect(item.name, `Empty name in ${cat.slug}`).toBeTruthy();
        expect(item.price, `Empty price in ${cat.slug}`).toBeTruthy();
      }
    }
  });

  it("has at least 84 total items", () => {
    expect(totalServiceItems).toBeGreaterThanOrEqual(84);
  });

  it("has unique category slugs", () => {
    const slugs = serviceCategories.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("FAQ data", () => {
  it("has exactly 10 items", () => {
    expect(faqItems).toHaveLength(10);
  });

  it("every item has a non-empty question and answer", () => {
    for (const item of faqItems) {
      expect(item.question).toBeTruthy();
      expect(item.answer).toBeTruthy();
    }
  });

  it("questions are unique", () => {
    const questions = faqItems.map((f) => f.question);
    expect(new Set(questions).size).toBe(questions.length);
  });
});
