import { describe, it, expect } from "vitest";
import { reviews, aggregateRating } from "@/data/reviews";

describe("Reviews data", () => {
  it("has 9 reviews", () => {
    expect(reviews).toHaveLength(9);
  });

  it("every review has a non-empty text, author, and rating", () => {
    for (const review of reviews) {
      expect(review.text).toBeTruthy();
      expect(review.author).toBeTruthy();
      expect(review.rating).toBeGreaterThanOrEqual(1);
      expect(review.rating).toBeLessThanOrEqual(5);
    }
  });

  it("aggregate rating is 5.0", () => {
    expect(aggregateRating.value).toBe(5.0);
  });

  it("aggregate count is 12", () => {
    expect(aggregateRating.count).toBe(12);
  });

  it("all reviews have 5-star rating", () => {
    for (const review of reviews) {
      expect(review.rating).toBe(5);
    }
  });
});
