"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { serviceCategories, type ServiceCategory } from "@/data/services";
import { cn } from "@/lib/utils";

function normalizeDiacritics(str: string): string {
  return str
    .toLowerCase()
    .replace(/ă/g, "a")
    .replace(/â/g, "a")
    .replace(/î/g, "i")
    .replace(/ș/g, "s")
    .replace(/ț/g, "t");
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const normalizedText = normalizeDiacritics(text);
  const normalizedQuery = normalizeDiacritics(query);
  const index = normalizedText.indexOf(normalizedQuery);
  if (index === -1) return text;

  const before = text.slice(0, index);
  const match = text.slice(index, index + query.length);
  const after = text.slice(index + query.length);

  return (
    <>
      {before}
      <mark className="bg-primary/30 text-foreground rounded px-0.5">
        {match}
      </mark>
      {after}
    </>
  );
}

function PriceTable({
  category,
  searchQuery,
}: {
  category: ServiceCategory;
  searchQuery?: string;
}) {
  const filteredItems = searchQuery
    ? category.items.filter((item) =>
        normalizeDiacritics(item.name).includes(
          normalizeDiacritics(searchQuery),
        ),
      )
    : category.items;

  if (searchQuery && filteredItems.length === 0) return null;

  return (
    <div className="mb-6">
      {searchQuery && (
        <h3 className="text-sm font-semibold text-primary mb-2 uppercase tracking-wider">
          {category.tabLabel}
        </h3>
      )}
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full" role="table">
          <tbody>
            {filteredItems.map((item, i) => (
              <tr
                key={item.name}
                className={cn(
                  "flex justify-between gap-4 px-4 py-3 text-sm",
                  i % 2 === 0 ? "bg-surface" : "bg-surface/80",
                )}
              >
                <td className="text-foreground">
                  {searchQuery
                    ? highlightMatch(item.name, searchQuery)
                    : item.name}
                </td>
                <td className="text-primary font-semibold whitespace-nowrap">
                  {item.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function PricesPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || serviceCategories[0].slug;
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const isSearching = debouncedQuery.length > 0;

  const searchResults = useMemo(() => {
    if (!isSearching) return null;
    return serviceCategories.filter((cat) =>
      cat.items.some((item) =>
        normalizeDiacritics(item.name).includes(
          normalizeDiacritics(debouncedQuery),
        ),
      ),
    );
  }, [debouncedQuery, isSearching]);

  const hasResults = searchResults ? searchResults.length > 0 : true;

  const handleTabClick = useCallback((slug: string) => {
    setActiveTab(slug);
    setSearchQuery("");
    setDebouncedQuery("");
  }, []);

  const activeCategory = serviceCategories.find(
    (cat) => cat.slug === activeTab,
  );

  return (
    <Container as="section" className="py-20 pt-28">
      <SectionHeading
        title="Prețuri"
        subtitle="Tarife transparente pentru toate serviciile noastre"
      />

      {/* Search */}
      <div className="relative mb-6 max-w-md mx-auto">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Caută serviciu (ex: albire, implant, aparat)"
          aria-label="Caută în lista de prețuri"
          className="w-full rounded-full border border-border bg-surface py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Tabs */}
      {!isSearching && (
        <div
          className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none"
          role="tablist"
          aria-label="Categorii de prețuri"
        >
          {serviceCategories.map((cat) => (
            <button
              key={cat.slug}
              id={`tab-${cat.slug}`}
              role="tab"
              aria-selected={activeTab === cat.slug}
              aria-controls={`panel-${cat.slug}`}
              onClick={() => handleTabClick(cat.slug)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium min-h-[44px] transition-colors",
                activeTab === cat.slug
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface text-foreground [@media(hover:hover)]:hover:bg-surface-elevated active:bg-surface-elevated",
              )}
            >
              {cat.tabLabel}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {isSearching ? (
        hasResults ? (
          <div role="region" aria-label="Rezultate căutare">
            {searchResults!.map((cat) => (
              <PriceTable
                key={cat.slug}
                category={cat}
                searchQuery={debouncedQuery}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted py-12">
            Niciun serviciu găsit. Încercați alt termen.
          </p>
        )
      ) : (
        activeCategory && (
          <div
            id={`panel-${activeCategory.slug}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeCategory.slug}`}
          >
            <PriceTable category={activeCategory} />
          </div>
        )
      )}
    </Container>
  );
}
