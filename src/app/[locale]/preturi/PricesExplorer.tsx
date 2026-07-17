"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { m } from "framer-motion";
import { Search, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PriceTable } from "@/components/shared/PriceTable";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { springSnappy } from "@/lib/motion";
import {
  serviceCategories,
  type ServiceCategory,
  type ServiceCategorySlug,
} from "@/data/services";
import { cn } from "@/lib/utils";

/** Height of the fixed site header, in px. The sticky nav parks right under it. */
const HEADER_HEIGHT = 60;

function normalizeDiacritics(str: string): string {
  return str
    .toLowerCase()
    .replace(/ă/g, "a")
    .replace(/â/g, "a")
    .replace(/î/g, "i")
    .replace(/ș/g, "s")
    .replace(/ț/g, "t");
}

function matches(name: string, query: string): boolean {
  return normalizeDiacritics(name).includes(normalizeDiacritics(query));
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const index = normalizeDiacritics(text).indexOf(normalizeDiacritics(query));
  if (index === -1) return text;

  return (
    <>
      {text.slice(0, index)}
      <mark className="bg-primary text-background rounded px-0.5">
        {text.slice(index, index + query.length)}
      </mark>
      {text.slice(index + query.length)}
    </>
  );
}

/**
 * Tracks which category section is currently under the header.
 *
 * `rootMargin` pulls the observation band down past the fixed header and the
 * sticky nav, so a section counts as "current" once its heading clears them —
 * not the instant its bottom edge enters the viewport.
 */
function useActiveCategory(active: boolean): ServiceCategorySlug {
  const [current, setCurrent] = useState<ServiceCategorySlug>(
    serviceCategories[0].slug,
  );

  useEffect(() => {
    if (!active) return;

    const sections = serviceCategories
      .map((cat) => document.getElementById(cat.slug))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setCurrent(visible[0].target.id as ServiceCategorySlug);
      },
      { rootMargin: "-140px 0px -55% 0px", threshold: 0 },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [active]);

  return current;
}

/**
 * True once the nav has stuck to the header. A 1px sentinel just above it
 * leaves the viewport at exactly that moment — cheaper and more reliable than
 * measuring `getBoundingClientRect().top` on every scroll event.
 */
function useIsStuck(sentinel: React.RefObject<HTMLDivElement | null>): boolean {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { rootMargin: `-${HEADER_HEIGHT + 1}px 0px 0px 0px`, threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [sentinel]);

  return stuck;
}

function CategoryNav({ activeSlug }: { activeSlug: ServiceCategorySlug }) {
  const prefersReduced = usePrefersReducedMotion();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isStuck = useIsStuck(sentinelRef);

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="h-px" />
      <nav
        aria-label="Categorii de prețuri"
        className={cn(
          // Solid page-colored band, NOT a translucent blur: the header
          // auto-hides on scroll, and a `bg-background/90 backdrop-blur` strip
          // let price rows ghost through behind the pills and janked on mobile
          // Safari (blur on a moving header + a sticky bar). Solid + same colour
          // as the page reads as seamless and covers scrolling content cleanly.
          "sticky z-30 -mx-4 mb-10 bg-background px-4 py-3 sm:-mx-6 sm:px-6",
          "top-[60px]",
          // Once stuck, fill the 60px the auto-hiding header leaves behind so
          // rows never show above the pills.
          isStuck &&
            "before:absolute before:inset-x-0 before:bottom-full before:h-[60px] before:bg-background",
        )}
      >
        <ul className="scrollbar-none flex gap-2 overflow-x-auto">
          {serviceCategories.map((cat) => {
            const isActive = cat.slug === activeSlug;
            return (
              <li key={cat.slug} className="shrink-0">
                <a
                  href={`#${cat.slug}`}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative flex min-h-[44px] items-center rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "text-primary-foreground"
                      : "bg-surface text-foreground [@media(hover:hover)]:hover:bg-surface-elevated",
                  )}
                >
                  {/* One element shared across links: framer-motion tweens the
                      pill from the previous slug's box to this one. */}
                  {isActive && (
                    <m.span
                      layoutId="price-nav-pill"
                      className="absolute inset-0 rounded-full bg-primary"
                      transition={
                        prefersReduced ? { duration: 0 } : springSnappy
                      }
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

function CategorySection({ category }: { category: ServiceCategory }) {
  return (
    <section
      id={category.slug}
      aria-labelledby={`${category.slug}-heading`}
      className="mb-14 scroll-mt-36"
    >
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 id={`${category.slug}-heading`} className="text-2xl font-bold">
          {category.label}
        </h2>
        <Link
          href={`/preturi/${category.slug}`}
          className="text-sm font-semibold text-primary [@media(hover:hover)]:hover:underline"
        >
          Detalii {category.label.toLowerCase()} →
        </Link>
      </div>
      <PriceTable
        items={category.items}
        caption={`Prețuri ${category.label} — Dentologia Câmpulung Muscel`}
      />
    </section>
  );
}

export function PricesExplorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const isSearching = debouncedQuery.length > 0;
  const activeSlug = useActiveCategory(!isSearching);

  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    return serviceCategories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter((item) => matches(item.name, debouncedQuery)),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [debouncedQuery, isSearching]);

  const resultCount = searchResults.reduce(
    (sum, cat) => sum + cat.items.length,
    0,
  );

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setDebouncedQuery("");
    inputRef.current?.focus();
  }, []);

  return (
    <>
      <div className="relative mx-auto mb-8 max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        {/* `type="text"`, not `"search"`: WebKit renders its own clear button
            for search inputs, which would sit beside the one below. */}
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Caută serviciu (ex: albire, implant, aparat)"
          aria-label="Caută în lista de prețuri"
          className="w-full rounded-full border border-border bg-surface py-3 pl-10 pr-11 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Șterge căutarea"
            className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-muted [@media(hover:hover)]:hover:text-foreground"
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Announce result counts to screen readers without moving focus. */}
      <p aria-live="polite" className="sr-only">
        {isSearching ? `${resultCount} rezultate pentru ${debouncedQuery}` : ""}
      </p>

      {isSearching ? (
        searchResults.length > 0 ? (
          <div>
            {searchResults.map((cat) => (
              <section key={cat.slug} className="mb-8">
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
                  {cat.label}
                </h2>
                <PriceTable
                  items={cat.items}
                  caption={`Rezultate ${cat.label}`}
                  renderName={(name) => highlightMatch(name, debouncedQuery)}
                />
              </section>
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-muted">
            Niciun serviciu găsit. Încercați alt termen.
          </p>
        )
      ) : (
        <>
          <CategoryNav activeSlug={activeSlug} />
          {serviceCategories.map((cat) => (
            <CategorySection key={cat.slug} category={cat} />
          ))}
        </>
      )}
    </>
  );
}
