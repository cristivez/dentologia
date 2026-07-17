import { describe, it, expect } from "vitest";
import { serviceCategories, parsePrice } from "@/data/services";
import { servicePages } from "@/data/servicePages";
import { faqItems } from "@/data/faq";

/**
 * Structured data can be derived from services.ts, and is. Romanian sentences
 * cannot be — "Consultația costă 100 lei" has to be written by a human. So the
 * prices in prose are the last copies of a fact that lives somewhere else, and
 * every drift this site has shipped was exactly that: a number restated and
 * then left behind. /recenzii told Google "12 recenzii" while the page said 15;
 * the old hand-typed `offers` quoted 300 lei for a root canal the table showed
 * as 300–500.
 *
 * This cannot check that a sentence is *well written*. It can check that every
 * number it quotes is a price the clinic actually charges — which turns "the
 * prose drifted" from something a patient notices into a failing build.
 *
 * When this fails, the fix is almost never to edit this test. Either the prose
 * is stale (update the sentence) or services.ts is (update the row). If a price
 * genuinely changed, it changes in services.ts first — that is the whole point.
 */

/** Every amount the clinic actually charges, as "<currency>:<amount>". */
function publishedAmounts(): Set<string> {
  const out = new Set<string>();
  for (const category of serviceCategories) {
    for (const item of category.items) {
      const parsed = parsePrice(item.price);
      if (!parsed) continue;
      if (parsed.kind === "single") {
        out.add(`${parsed.currency}:${parsed.value}`);
      } else {
        // Prose quotes either end of a range ("de la 300 lei", "până la 500").
        out.add(`${parsed.currency}:${parsed.min}`);
        out.add(`${parsed.currency}:${parsed.max}`);
      }
    }
  }
  return out;
}

/**
 * Price-shaped literals only: "100 lei", "2.700 lei", "1.600 EUR", "1.600 €".
 * The currency suffix is what keeps ages ("7 ani") and durations ("24 de luni")
 * out — they are numbers in prose too, but they are not prices.
 */
const PRICE_IN_PROSE = /(\d{1,3}(?:\.\d{3})*)\s*(lei|eur|€)/gi;

function pricesIn(text: string) {
  return Array.from(text.matchAll(PRICE_IN_PROSE)).map((match) => {
    const amount = Number(match[1].replace(/\./g, ""));
    const currency = /eur|€/i.test(match[2]) ? "EUR" : "RON";
    return { raw: match[0], key: `${currency}:${amount}` };
  });
}

/** Every human-authored string that is allowed to quote a price. */
function proseFields(): { where: string; text: string }[] {
  const out: { where: string; text: string }[] = [];
  const snip = (s: string) => s.slice(0, 45);

  for (const category of serviceCategories) {
    out.push({
      where: `services.ts ${category.slug} intro`,
      text: category.intro,
    });
    out.push({
      where: `services.ts ${category.slug} meta`,
      text: category.metaDescription,
    });
    out.push({
      where: `services.ts ${category.slug} title`,
      text: category.title,
    });
    out.push({ where: `services.ts ${category.slug} h1`, text: category.h1 });
  }

  for (const item of faqItems) {
    out.push({ where: `faq.ts "${snip(item.question)}"`, text: item.answer });
  }

  for (const page of servicePages) {
    out.push({ where: `${page.slug} intro`, text: page.intro });
    out.push({ where: `${page.slug} meta`, text: page.metaDescription });
    out.push({ where: `${page.slug} title`, text: page.title });
    out.push({ where: `${page.slug} h1`, text: page.h1 });
    if (page.priceNote) {
      out.push({ where: `${page.slug} priceNote`, text: page.priceNote });
    }
    for (const section of page.sections) {
      out.push({
        where: `${page.slug} §"${snip(section.heading)}"`,
        text: section.body,
      });
    }
    for (const item of page.faq) {
      out.push({
        where: `${page.slug} faq "${snip(item.question)}"`,
        text: item.answer,
      });
    }
  }

  return out;
}

describe("Prices quoted in prose", () => {
  it("every price written in prose is a price services.ts actually lists", () => {
    const published = publishedAmounts();
    const orphans: string[] = [];

    for (const { where, text } of proseFields()) {
      for (const price of pricesIn(text)) {
        if (!published.has(price.key))
          orphans.push(`${where} — "${price.raw}"`);
      }
    }

    expect(
      orphans,
      `These prices appear in prose but match no row in services.ts. Either the ` +
        `sentence is stale or the price list is:\n  ${orphans.join("\n  ")}\n`,
    ).toEqual([]);
  });

  it("actually inspects the prose it claims to (guards the regex itself)", () => {
    // Without this, a regex that quietly stopped matching — or a proseFields()
    // that stopped collecting — would make the test above pass forever while
    // checking nothing. Floors, not exact counts, so ordinary content edits
    // don't trip them. ~85 rows collapse to ~33 distinct amounts, because a
    // great many things at this clinic cost 100 lei.
    const fields = proseFields();
    const found = fields.flatMap((f) => pricesIn(f.text));
    expect(fields.length).toBeGreaterThan(100);
    expect(found.length).toBeGreaterThan(100);
    expect(publishedAmounts().size).toBeGreaterThan(25);
  });
});
