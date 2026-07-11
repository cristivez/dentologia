import type { ReactNode } from "react";
import type { ServiceItem } from "@/data/services";
import { cn } from "@/lib/utils";

/**
 * Renders price rows. Server-safe on purpose: /preturi and every
 * /preturi/<categorie> page share this, so all 84 prices reach the static HTML.
 */
export function PriceTable({
  items,
  caption,
  renderName,
  className,
}: {
  items: ServiceItem[];
  caption: string;
  /** Lets the search view wrap matches in <mark> without duplicating the table. */
  renderName?: (name: string) => ReactNode;
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border",
        className,
      )}
    >
      <table className="w-full">
        <caption className="sr-only">{caption}</caption>
        <tbody>
          {items.map((item, i) => (
            <tr
              key={item.name}
              className={i % 2 === 0 ? "bg-surface" : "bg-surface/80"}
            >
              <td className="px-4 py-3 text-sm text-foreground">
                {renderName ? renderName(item.name) : item.name}
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-primary text-right whitespace-nowrap">
                {item.price}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
