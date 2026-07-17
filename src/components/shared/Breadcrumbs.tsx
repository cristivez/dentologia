import { Fragment, type CSSProperties } from "react";
import { Link } from "@/i18n/navigation";
import { CLINIC } from "@/lib/constants";
import { BreadcrumbJsonLd } from "@/components/shared/JsonLd";

export type Crumb = {
  name: string;
  /** App path, e.g. "/" or "/servicii/implant-dentar". */
  href: string;
};

/**
 * The visible breadcrumb trail AND its BreadcrumbList JSON-LD from one list.
 *
 * The detail pages used to declare the trail twice — once as JSX, once as
 * structured data — which is exactly how a crumb label drifts between what a
 * visitor sees and what Google indexes. Pass the full trail including the
 * current page as the last item; it renders as plain `aria-current` text while
 * the rest are links.
 *
 * Server component: the entrance is the CSS `.rise` (transform only), never
 * opacity, because this sits above the fold on the LCP screen.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const jsonLdItems = items.map((crumb) => ({
    name: crumb.name,
    url: crumb.href === "/" ? CLINIC.url : `${CLINIC.url}${crumb.href}`,
  }));

  return (
    <>
      <BreadcrumbJsonLd items={jsonLdItems} />
      <nav
        aria-label="Firimituri"
        className="rise mb-6 text-sm text-muted"
        style={{ "--rise-delay": "0ms" } as CSSProperties}
      >
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((crumb, i) => {
            const isLast = i === items.length - 1;
            return (
              <Fragment key={crumb.href}>
                {i > 0 && <li aria-hidden="true">/</li>}
                <li
                  className={isLast ? "text-foreground" : undefined}
                  aria-current={isLast ? "page" : undefined}
                >
                  {isLast ? (
                    crumb.name
                  ) : (
                    <Link
                      href={crumb.href}
                      className="transition-colors [@media(hover:hover)]:hover:text-primary"
                    >
                      {crumb.name}
                    </Link>
                  )}
                </li>
              </Fragment>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
