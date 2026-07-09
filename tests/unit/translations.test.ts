import { describe, it, expect } from "vitest";
import ro from "@/messages/ro.json";
import en from "@/messages/en.json";

describe("Translation files", () => {
  it("ro.json and en.json have the same top-level keys", () => {
    expect(Object.keys(ro).sort()).toEqual(Object.keys(en).sort());
  });

  it("all Hero keys are present and non-empty in ro.json", () => {
    const heroKeys = [
      "title",
      "subtitle",
      "tagline",
      "cta_services",
      "cta_contact",
    ];
    for (const key of heroKeys) {
      expect(
        (ro.Hero as Record<string, string>)[key],
        `Missing Hero.${key}`,
      ).toBeTruthy();
    }
  });

  it("all Services keys are present and non-empty in ro.json", () => {
    const expectedKeys = ["heading", "subtitle"];
    for (let i = 1; i <= 3; i++) {
      expectedKeys.push(`card${i}_title`, `card${i}_description`);
      for (let f = 1; f <= 5; f++) {
        expectedKeys.push(`card${i}_feature${f}`);
      }
    }
    for (const key of expectedKeys) {
      expect(
        (ro.Services as Record<string, string>)[key],
        `Missing Services.${key}`,
      ).toBeTruthy();
    }
  });

  it("en.json has all the same nested keys as ro.json", () => {
    for (const ns of Object.keys(ro) as (keyof typeof ro)[]) {
      const roKeys = Object.keys(ro[ns]).sort();
      const enKeys = Object.keys(en[ns]).sort();
      expect(enKeys, `Namespace ${ns} key mismatch`).toEqual(roKeys);
    }
  });

  it("no empty string values in ro.json", () => {
    for (const ns of Object.keys(ro) as (keyof typeof ro)[]) {
      for (const [key, value] of Object.entries(ro[ns])) {
        expect(value, `Empty value at ${ns}.${key}`).not.toBe("");
      }
    }
  });
});
