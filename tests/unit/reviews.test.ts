import { describe, it, expect } from "vitest";
import { reviews } from "@/data/reviews";
import { GOOGLE_RATING } from "@/lib/constants";

/**
 * The previous version of this file asserted "has 9 reviews" and "aggregate
 * count is 12" — locking in nine testimonials that were invented during the
 * rebuild, and a count that did not match the Google Business Profile. Tests
 * that pin fabricated data make the fabrication harder to remove, not easier.
 */
describe("Reviews data", () => {
  it("only contains reviews (none are required)", () => {
    for (const review of reviews) {
      expect(review.text).toBeTruthy();
      expect(review.author).toBeTruthy();
      expect(review.rating).toBeGreaterThanOrEqual(1);
      expect(review.rating).toBeLessThanOrEqual(5);
    }
  });

  it("has unique authors", () => {
    const authors = reviews.map((r) => r.author);
    expect(new Set(authors).size).toBe(authors.length);
  });

  it("contains none of the fabricated authors removed in the content audit", () => {
    const fabricated = [
      "Andrei M.",
      "Elena I.",
      "Cristian D.",
      "Maria P.",
      "Ioana G.",
      "Marius V.",
      "Simona L.",
      "Daniela R.",
      "George B.",
    ];
    const authors = reviews.map((r) => r.author);
    for (const name of fabricated) {
      expect(authors, `"${name}" was an invented testimonial`).not.toContain(
        name,
      );
    }
  });

  it("never displays more reviews than the Google profile reports", () => {
    expect(reviews.length).toBeLessThanOrEqual(GOOGLE_RATING.count);
  });
});

describe("Google rating", () => {
  it("matches the verified Google Business Profile", () => {
    expect(GOOGLE_RATING.value).toBe(5.0);
    expect(GOOGLE_RATING.count).toBe(15);
  });
});
