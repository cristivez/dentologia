import { describe, it, expect } from "vitest";
import { CLINIC, SCHEDULE } from "@/lib/constants";

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

  it("Saturday has reduced hours", () => {
    const saturday = SCHEDULE[5];
    expect(saturday.open).toBe("09:00");
    expect(saturday.close).toBe("14:00");
  });

  it("Sunday is closed", () => {
    const sunday = SCHEDULE[6];
    expect(sunday.open).toBeNull();
    expect(sunday.close).toBeNull();
  });
});
