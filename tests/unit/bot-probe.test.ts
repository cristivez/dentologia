import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { isBotProbe } from "@/lib/botProbe";

describe("isBotProbe", () => {
  it.each([
    "/api",
    "/api/",
    "/api/v1/users",
    "/ro/api/x",
    "/sito/wp-includes/wlwmanifest.xml",
    "/wp-admin/",
    "/wp-login.php",
    "/blog/wp-content/plugins/x.js",
    "/xmlrpc.php",
    "/wordpress/",
    "/.env",
    "/.git/config",
    "/phpmyadmin/",
    "/cgi-bin/luci",
    "/shell20211028.php",
    "/shell.php/",
    "/backup.zip",
    "/config.yml",
  ])("flags %s", (path) => {
    expect(isBotProbe(path)).toBe(true);
  });

  it.each([
    "/",
    "/ro/contact",
    "/en",
    "/sitemap.xml",
    "/feed.xml",
    "/robots.txt",
    "/manifest.webmanifest",
    "/favicon.ico",
    "/apidentar",
    "/_next/static/chunks/main.js",
  ])("lets %s through", (path) => {
    expect(isBotProbe(path)).toBe(false);
  });

  // The E2E suite runs next dev/start, never worker.ts, so this is the only
  // check that the filter cannot swallow a real page.
  it("lets every sitemap URL through", () => {
    const paths = sitemap().map((entry) => new URL(entry.url).pathname);
    expect(paths.length).toBeGreaterThan(20);
    expect(paths.filter(isBotProbe)).toEqual([]);
  });
});
