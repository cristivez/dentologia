/**
 * Security headers sent on every response. One list for both senders:
 * next.config.ts applies it to everything Next.js serves, and worker.ts to the
 * 404 it answers without booting Next.js.
 */
export const SECURITY_HEADERS: { key: string; value: string }[] = [
  // Tells browsers to reach this host over HTTPS only, which kills the
  // http:// -> https:// redirect hop as a downgrade opportunity. Safe
  // here because dentologia.ro and www are Worker custom domains and
  // have always been HTTPS-only. No `preload`: that needs a submission
  // to the browser preload list and is far harder to undo. Note the
  // max-age is a real commitment — a browser that sees this refuses
  // plain HTTP for this host for a year, even if the header is removed.
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];
