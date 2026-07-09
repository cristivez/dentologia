import { describe, it, expect } from "vitest";
import { generatePageMetadata } from "@/lib/metadata";

describe("generatePageMetadata", () => {
  it("generates correct canonical URL", () => {
    const meta = generatePageMetadata({
      title: "Test",
      description: "Desc",
      path: "/servicii",
    });
    expect(meta.alternates?.canonical).toBe("https://dentologia.ro/servicii");
  });

  it("generates OpenGraph metadata", () => {
    const meta = generatePageMetadata({
      title: "Test Title",
      description: "Test Desc",
      path: "/contact",
      locale: "ro",
    });
    const og = meta.openGraph as Record<string, unknown>;
    expect(og.title).toBe("Test Title");
    expect(og.description).toBe("Test Desc");
    expect(og.url).toBe("https://dentologia.ro/contact");
    expect(og.locale).toBe("ro_RO");
  });

  it("generates Twitter card metadata", () => {
    const meta = generatePageMetadata({
      title: "Test",
      description: "Desc",
      path: "/",
    });
    const twitter = meta.twitter as Record<string, unknown>;
    expect(twitter.card).toBe("summary_large_image");
  });

  it("uses en_US locale for English", () => {
    const meta = generatePageMetadata({
      title: "Test",
      description: "Desc",
      path: "/",
      locale: "en",
    });
    const og = meta.openGraph as Record<string, unknown>;
    expect(og.locale).toBe("en_US");
  });
});
