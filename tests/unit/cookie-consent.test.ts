import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock localStorage
const storage: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => storage[key] ?? null,
  setItem: (key: string, value: string) => {
    storage[key] = value;
  },
  removeItem: (key: string) => {
    delete storage[key];
  },
};

vi.stubGlobal("localStorage", localStorageMock);

// Import after mocking
const { getConsentStatus } = await import("@/components/shared/CookieConsent");

describe("getConsentStatus", () => {
  beforeEach(() => {
    Object.keys(storage).forEach((key) => delete storage[key]);
  });

  it("returns null when no consent stored", () => {
    expect(getConsentStatus()).toBeNull();
  });

  it("returns 'accepted' when accepted", () => {
    storage["dentologia-cookie-consent"] = "accepted";
    expect(getConsentStatus()).toBe("accepted");
  });

  it("returns 'declined' when declined", () => {
    storage["dentologia-cookie-consent"] = "declined";
    expect(getConsentStatus()).toBe("declined");
  });

  it("returns null for invalid value", () => {
    storage["dentologia-cookie-consent"] = "maybe";
    expect(getConsentStatus()).toBeNull();
  });
});
