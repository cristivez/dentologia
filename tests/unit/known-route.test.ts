import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { isKnownRoute } from "@/lib/knownRoute";

// Shaped like the build's prerender-manifest route keys: always locale-prefixed.
const PAGES = new Set([
  "/ro",
  "/en",
  "/ro/contact",
  "/en/contact",
  "/ro/servicii/implant-dentar",
  "/sitemap.xml",
  "/robots.txt",
]);

describe("isKnownRoute", () => {
  it.each([
    "/",
    "/contact",
    "/contact/",
    "/servicii/implant-dentar",
    "/ro",
    "/ro/contact",
    "/en",
    "/en/contact",
    "/sitemap.xml",
    "/robots.txt",
    "/_next/static/chunks/main.js",
  ])("knows %s", (path) => {
    expect(isKnownRoute(path, PAGES)).toBe(true);
  });

  it.each([
    "/nu-exista",
    "/Contact",
    "/contact/extra",
    "/servicii/nu-exista",
    "/en/servicii/implant-dentar",
    "/de/contact",
    "/ro/ro/contact",
  ])("does not know %s", (path) => {
    expect(isKnownRoute(path, PAGES)).toBe(false);
  });

  // Mirrors what the build emits: every sitemap URL, locale-prefixed, is a
  // manifest key. If the sitemap and the unprefixing logic ever disagree,
  // worker.ts would 404 a real page and only production would show it.
  it("knows every sitemap URL", () => {
    const paths = sitemap().map((entry) => new URL(entry.url).pathname);
    const manifest = new Set(
      paths.map((p) =>
        /^\/(ro|en)(\/|$)/.test(p) ? p : p === "/" ? "/ro" : `/ro${p}`,
      ),
    );
    expect(paths.length).toBeGreaterThan(20);
    expect(paths.filter((p) => !isKnownRoute(p, manifest))).toEqual([]);
  });
});
