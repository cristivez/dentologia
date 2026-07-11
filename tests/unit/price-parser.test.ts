import { describe, it, expect } from "vitest";
import { parsePrice, serviceCategories } from "@/data/services";

describe("parsePrice", () => {
  it("reads a plain price", () => {
    expect(parsePrice("100 lei")).toEqual({
      kind: "single",
      value: 100,
      currency: "RON",
    });
  });

  /**
   * The one that matters. Romanian uses "." as a thousands separator, so
   * `Number("2.700")` would give 2.7 and the schema would advertise braces at
   * under three lei.
   */
  it("treats '.' as a thousands separator, not a decimal point", () => {
    expect(parsePrice("2.700 lei / arcadă")).toEqual({
      kind: "single",
      value: 2700,
      currency: "RON",
    });
    expect(parsePrice("4.500 lei / arcadă")).toEqual({
      kind: "single",
      value: 4500,
      currency: "RON",
    });
  });

  it("ignores trailing units that carry no digits", () => {
    expect(parsePrice("100 lei / ambele arcade")).toEqual({
      kind: "single",
      value: 100,
      currency: "RON",
    });
    expect(parsePrice("1.800 lei / element")).toEqual({
      kind: "single",
      value: 1800,
      currency: "RON",
    });
  });

  it("reads an en-dash range", () => {
    expect(parsePrice("300 – 500 lei")).toEqual({
      kind: "range",
      min: 300,
      max: 500,
      currency: "RON",
    });
  });

  it("detects EUR", () => {
    expect(parsePrice("1.600 EUR")).toEqual({
      kind: "single",
      value: 1600,
      currency: "EUR",
    });
  });

  it("collapses a degenerate range to a single price", () => {
    expect(parsePrice("200 – 200 lei")).toEqual({
      kind: "single",
      value: 200,
      currency: "RON",
    });
  });

  it("returns null rather than guessing when there is no number", () => {
    expect(parsePrice("la consultație")).toBeNull();
    expect(parsePrice("")).toBeNull();
  });

  it("parses every price string in the catalogue to a sane value", () => {
    for (const cat of serviceCategories) {
      for (const item of cat.items) {
        const parsed = parsePrice(item.price);
        expect(
          parsed,
          `${cat.slug} → ${item.name} (${item.price})`,
        ).not.toBeNull();

        // Nothing in this catalogue costs less than 10 lei. A sub-10 result
        // means a thousands separator was misread as a decimal point.
        const low = parsed!.kind === "single" ? parsed!.value : parsed!.min;
        expect(low, `${item.name} parsed as ${low}`).toBeGreaterThanOrEqual(10);
      }
    }
  });
});
