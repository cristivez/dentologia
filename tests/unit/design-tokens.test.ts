import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

describe("Design tokens (globals.css)", () => {
  const css = readFileSync(
    resolve(__dirname, "../../src/app/globals.css"),
    "utf-8",
  );

  const requiredVars = [
    "--background",
    "--foreground",
    "--surface",
    "--surface-elevated",
    "--muted",
    "--border-color",
    "--primary",
    "--primary-foreground",
    "--accent",
  ];

  it("defines all required CSS custom properties in :root", () => {
    for (const varName of requiredVars) {
      expect(css).toContain(varName);
    }
  });

  it("maps CSS vars to Tailwind via @theme inline", () => {
    expect(css).toContain("@theme inline");
    expect(css).toContain("--color-background: var(--background)");
    expect(css).toContain("--color-foreground: var(--foreground)");
    expect(css).toContain("--color-primary: var(--primary)");
    expect(css).toContain("--color-surface: var(--surface)");
  });

  it("includes WhatsApp and star colors", () => {
    expect(css).toContain("--color-whatsapp: #25d366");
    expect(css).toContain("--color-star: #f1c40f");
  });

  it("includes reduced motion media query", () => {
    expect(css).toContain("prefers-reduced-motion: reduce");
  });

  it("includes focus-visible styles", () => {
    expect(css).toContain(":focus-visible");
  });

  it("includes skip-to-content link styles", () => {
    expect(css).toContain(".skip-to-content");
  });

  it("uses Montserrat font variable", () => {
    expect(css).toContain("--font-montserrat");
  });
});
