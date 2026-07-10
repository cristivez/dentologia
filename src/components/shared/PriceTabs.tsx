"use client";

import { useState } from "react";
import { m } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { PriceTable } from "@/components/shared/PriceTable";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { springSnappy } from "@/lib/motion";
import { serviceCategories, type ServiceCategorySlug } from "@/data/services";
import { cn } from "@/lib/utils";

/**
 * Compact price browser for the homepage: one category at a time, behind tabs.
 *
 * The full stacked list lives at /preturi, and each category also has its own
 * page — so the categories hidden behind a tab here are still crawlable there.
 */
export function PriceTabs({ seePricesLabel }: { seePricesLabel: string }) {
  const prefersReduced = usePrefersReducedMotion();
  const [activeTab, setActiveTab] = useState<ServiceCategorySlug>(
    serviceCategories[0].slug,
  );

  const activeCategory =
    serviceCategories.find((cat) => cat.slug === activeTab) ??
    serviceCategories[0];

  return (
    <div>
      {/* Scrolls horizontally on a phone; wraps and centres once there is room,
          so the last tab is never clipped mid-word on desktop. */}
      <div
        className="scrollbar-none mb-6 flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center sm:overflow-x-visible"
        role="tablist"
        aria-label="Categorii de prețuri"
      >
        {serviceCategories.map((cat) => {
          const isActive = cat.slug === activeTab;
          return (
            <button
              key={cat.slug}
              id={`home-tab-${cat.slug}`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`home-panel-${cat.slug}`}
              onClick={() => setActiveTab(cat.slug)}
              className={cn(
                "relative min-h-[44px] shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "text-primary-foreground"
                  : "bg-surface text-foreground [@media(hover:hover)]:hover:bg-surface-elevated active:bg-surface-elevated",
              )}
            >
              {/* One element shared across tabs — framer-motion tweens the pill
                  from the old tab's box to the new one instead of cross-fading. */}
              {isActive && (
                <m.span
                  layoutId="home-price-tab-pill"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={prefersReduced ? { duration: 0 } : springSnappy}
                  aria-hidden="true"
                />
              )}
              <span className="relative z-10">{cat.label}</span>
            </button>
          );
        })}
      </div>

      <div
        id={`home-panel-${activeCategory.slug}`}
        role="tabpanel"
        aria-labelledby={`home-tab-${activeCategory.slug}`}
      >
        <PriceTable
          items={activeCategory.items}
          caption={`Prețuri ${activeCategory.label} — Dentologia Câmpulung Muscel`}
        />
      </div>

      <div className="mt-4 text-center">
        <Link
          href={`/preturi/${activeCategory.slug}`}
          className="text-sm font-semibold text-primary [@media(hover:hover)]:hover:underline"
        >
          {seePricesLabel} {activeCategory.label.toLowerCase()} →
        </Link>
      </div>
    </div>
  );
}
