# Internationalization (i18n) Setup

## Library: next-intl

## Configuration Files

### 1. Routing (`src/i18n/routing.ts`)

```typescript
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ro", "en"],
  defaultLocale: "ro",
  localePrefix: "as-needed", // No /ro prefix, only /en
  localeDetection: false, // Don't auto-detect from browser
});
```

### 2. Request Config (`src/i18n/request.ts`)

```typescript
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as "ro" | "en")) {
    locale = routing.defaultLocale;
  }

  // Base translations
  const messages = (await import(`../messages/${locale}.json`)).default;

  // Split service detail translations by category (optional)
  const categories = await Promise.all([
    import(`../messages/${locale}/emergency.json`),
    import(`../messages/${locale}/aesthetics.json`),
    // ... add more as needed
  ]);

  // Merge into ServiceDetail namespace
  const serviceDetailMessages = Object.assign(
    {},
    ...categories.map((m) => m.default?.ServiceDetail ?? {}),
  );

  return {
    locale,
    messages: {
      ...messages,
      ServiceDetail: { ...messages.ServiceDetail, ...serviceDetailMessages },
    },
  };
});
```

### 3. Navigation (`src/i18n/navigation.ts`)

```typescript
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

**Always use `Link` from `@/i18n/navigation`**, not `next/link`. The i18n Link automatically handles locale prefixing.

### 4. Middleware (`src/middleware.ts`)

```typescript
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/", "/(ro|en)/:path*", "/((?!_next|_vercel|.*\\..*).*)"],
};
```

### 5. Next.js Plugin (`next.config.ts`)

```typescript
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
export default withNextIntl(nextConfig);
```

## Translation File Structure

```
src/messages/
├── ro.json                    # Main Romanian translations
├── en.json                    # Main English translations
├── ro/
│   ├── emergency.json         # Service detail: emergency
│   ├── aesthetics.json        # Service detail: aesthetics
│   └── ...                    # One file per service category
└── en/
    ├── emergency.json
    ├── aesthetics.json
    └── ...
```

### Translation Key Namespaces

```json
{
  "Metadata": { "homeTitle": "...", "homeDescription": "..." },
  "Nav": { "home": "Acasă", "team": "Echipa", ... },
  "Hero": { "title": "...", "subtitle": "..." },
  "About": { ... },
  "Services": { "categoryTitle": "...", "currency": "RON" },
  "ServiceDetail": { "slug-name": { "metaTitle": "...", ... } },
  "Team": { ... },
  "Contact": { ... },
  "Schedule": { "day": "Zi", "hours": "Program", "closed": "Închis" },
  "Cookie": { "message": "...", "accept": "Accept", "decline": "Refuz" },
  "Footer": { ... },
  "NotFound": { "title": "404", "description": "..." }
}
```

## Usage

### Server Components

```typescript
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);  // Required for static generation

  const t = await getTranslations({ locale, namespace: "Services" });
  return <h1>{t("pageTitle")}</h1>;
}
```

### Client Components

```typescript
"use client";
import { useTranslations } from "next-intl";

export function MyComponent() {
  const t = useTranslations("Nav");
  return <a href="/">{t("home")}</a>;
}
```

### Layout (Pass Messages to Provider)

```typescript
import { getMessages, setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
```

## URL Patterns

| Page           | Romanian (default)        | English                      |
| -------------- | ------------------------- | ---------------------------- |
| Home           | `/`                       | `/en`                        |
| Services       | `/preturi`                | `/en/preturi`                |
| Team           | `/echipa`                 | `/en/echipa`                 |
| Contact        | `/contact`                | `/en/contact`                |
| Service detail | `/preturi/implant-dentar` | `/en/preturi/implant-dentar` |

## Testing Translations

```typescript
// Unit test: ensure both locales have matching keys
it("ro.json and en.json have matching top-level namespaces", () => {
  const roKeys = Object.keys(roMessages).sort();
  const enKeys = Object.keys(enMessages).sort();
  expect(roKeys).toEqual(enKeys);
});

// E2E test: language switch works
test("content changes to English after switching", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("nav").first()).toContainText(/Acasă/);

  await page.locator("button", { hasText: "EN" }).first().click();
  await page.waitForURL("**/en");

  await expect(page.locator("nav").first()).toContainText(/Home/);
});
```
