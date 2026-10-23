/**
 * Bot-probe filter for the Worker entry (worker.ts).
 *
 * Scanners hit paths like /api, /wp-admin/, /sito/wp-includes/wlwmanifest.xml
 * and /.env. Each one used to fall through to Next.js, which booted the server
 * just to render a 404 — 85% of the Worker's CPU over 7 days. Answering them
 * here costs next to nothing.
 *
 * Only paths that would 404 anyway may match: nothing on this site lives under
 * /api, uses a WordPress-style segment, a dot-segment, or a server-side file
 * extension. Static assets never reach the Worker, so they are not at risk.
 * `.xml` is deliberately absent: it would also catch a future feed route, and
 * the E2E suite never runs through the Worker, so only production would show it.
 */

const PROBE_PREFIX = /^(\/(ro|en))?\/api(\/|$)/i;

// WordPress, admin panels, CGI, and dot-segments (/.env, /.git/config).
const PROBE_SEGMENT =
  /(^|\/)(wp-[^/]*|wordpress|xmlrpc[^/]*|wlwmanifest[^/]*|cgi-bin|phpmyadmin|\.[^/]+)(\/|$)/i;

const PROBE_EXTENSION =
  /\.(php\d?|phtml|asp|aspx|jsp|cgi|pl|env|ini|sql|bak|old|swp|zip|tar|gz|tgz|rar|7z|log|ya?ml|cfg|conf)\/?$/i;

export function isBotProbe(pathname: string): boolean {
  return (
    PROBE_PREFIX.test(pathname) ||
    PROBE_SEGMENT.test(pathname) ||
    PROBE_EXTENSION.test(pathname)
  );
}
