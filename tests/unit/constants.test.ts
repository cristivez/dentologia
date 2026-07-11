import { describe, it, expect } from "vitest";
import { CLINIC, SCHEDULE, formatHours, OPEN_DAYS } from "@/lib/constants";

describe("CLINIC constants", () => {
  it("has a valid phone number format", () => {
    expect(CLINIC.phone).toMatch(/^\+40\d{9}$/);
  });

  it("has a valid display phone format", () => {
    expect(CLINIC.phoneDisplay).toMatch(/^\d{4}\s\d{3}\s\d{3}$/);
  });

  it("has a valid email format", () => {
    expect(CLINIC.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it("has valid coordinates", () => {
    expect(CLINIC.coordinates.lat).toBeGreaterThan(44);
    expect(CLINIC.coordinates.lat).toBeLessThan(46);
    expect(CLINIC.coordinates.lng).toBeGreaterThan(24);
    expect(CLINIC.coordinates.lng).toBeLessThan(26);
  });

  it("has a valid WhatsApp URL", () => {
    expect(CLINIC.whatsapp).toMatch(/^https:\/\/wa\.me\/\d+$/);
  });

  it("has a complete address", () => {
    expect(CLINIC.address.street).toBeTruthy();
    expect(CLINIC.address.city).toBeTruthy();
    expect(CLINIC.address.county).toBeTruthy();
    expect(CLINIC.address.postalCode).toMatch(/^\d{6}$/);
    expect(CLINIC.address.country).toBe("RO");
  });

  it("has social media links", () => {
    expect(CLINIC.social.facebook).toMatch(/^https:\/\//);
    expect(CLINIC.social.instagram).toMatch(/^https:\/\//);
    expect(CLINIC.social.google).toMatch(/^https:\/\//);
  });

  it("has a valid domain and URL", () => {
    expect(CLINIC.domain).toBe("dentologia.ro");
    expect(CLINIC.url).toBe("https://dentologia.ro");
  });
});

describe("SCHEDULE", () => {
  it("has 7 entries (one per day)", () => {
    expect(SCHEDULE).toHaveLength(7);
  });

  it("has valid day names in Romanian", () => {
    const expectedDays = [
      "Luni",
      "Marți",
      "Miercuri",
      "Joi",
      "Vineri",
      "Sâmbătă",
      "Duminică",
    ];
    expect(SCHEDULE.map((s) => s.day)).toEqual(expectedDays);
  });

  it("weekdays have open and close times", () => {
    const weekdays = SCHEDULE.slice(0, 5);
    for (const day of weekdays) {
      expect(day.open).toMatch(/^\d{2}:\d{2}$/);
      expect(day.close).toMatch(/^\d{2}:\d{2}$/);
    }
  });

  /**
   * Pinned to the Google Business Profile, which is the source of truth
   * (verified 2026-07-10). The site used to claim 09:00–19:00 and Saturday
   * 09:00–14:00 — matching neither Google nor the front-door decal.
   */
  it("weekday hours match the Google Business Profile: 09:00–18:00", () => {
    for (const day of SCHEDULE.slice(0, 5)) {
      expect(day.open, day.day).toBe("09:00");
      expect(day.close, day.day).toBe("18:00");
    }
  });

  it("Saturday and Sunday are closed", () => {
    const [saturday, sunday] = [SCHEDULE[5], SCHEDULE[6]];
    expect(saturday.day).toBe("Sâmbătă");
    expect(saturday.open).toBeNull();
    expect(sunday.open).toBeNull();
  });

  it("OPEN_DAYS lists only the five weekdays", () => {
    expect(OPEN_DAYS.map((d) => d.day)).toEqual([
      "Luni",
      "Marți",
      "Miercuri",
      "Joi",
      "Vineri",
    ]);
  });
});

describe("formatHours", () => {
  it("formats an open day", () => {
    expect(formatHours(SCHEDULE[0])).toBe("09:00 – 18:00");
  });

  /** Regression: a closed day used to render as a bare " – ". */
  it("renders a closed day as Închis, never a bare dash", () => {
    expect(formatHours(SCHEDULE[5])).toBe("Închis");
    expect(formatHours(SCHEDULE[6])).toBe("Închis");
    expect(formatHours(undefined)).toBe("Închis");
  });
});
