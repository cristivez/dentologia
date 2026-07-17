export type ServiceItem = {
  name: string;
  price: string;
};

/**
 * Every price category, each with its own `/preturi/<slug>` page.
 *
 * Typing this as a union rather than `string` is what stops a link like
 * `/preturi?tab=implant` — which shipped to production and rendered an empty
 * price page — from ever compiling again.
 */
export const SERVICE_CATEGORY_SLUGS = [
  "general",
  "profilaxie",
  "odontoterapie",
  "endodontie",
  "chirurgie",
  "ortodontie",
  "protetica",
] as const;

export type ServiceCategorySlug = (typeof SERVICE_CATEGORY_SLUGS)[number];

export type ServiceCategory = {
  slug: ServiceCategorySlug;
  /** Short name, used in the jump-nav on /preturi. */
  label: string;
  /** Heading of the category's own page. Carries the city. */
  h1: string;
  title: string;
  metaDescription: string;
  intro: string;
  items: ServiceItem[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    slug: "general",
    label: "Consultații",
    h1: "Prețuri consultații stomatologice în Câmpulung Muscel",
    title: "Consultație Stomatologică Câmpulung | 100 lei | Dentologia",
    metaDescription:
      "Consultație de specialitate 100 lei, tratament de urgență 250 lei la Dentologia, Câmpulung Muscel. Prețuri transparente, fără costuri ascunse.",
    intro:
      "Prima vizită la Dentologia începe cu o consultație de specialitate, în care evaluăm starea dinților și a gingiilor și stabilim împreună un plan de tratament. Pentru durerea acută avem tarif separat de urgență.",
    items: [
      { name: "Consultație de specialitate", price: "100 lei" },
      { name: "Tratament de urgență", price: "250 lei" },
    ],
  },
  {
    slug: "profilaxie",
    label: "Profilaxie",
    h1: "Prețuri profilaxie și igienizare dentară în Câmpulung Muscel",
    title: "Profilaxie Dentară Câmpulung | de la 100 lei | Dentologia",
    metaDescription:
      "Detartraj 150 lei, pachet detartraj + periaj + AirFlow 250 lei, fluorizare 150 lei, sigilări 200 lei. Profilaxie dentară în Câmpulung Muscel.",
    intro:
      "Profilaxia este cea mai ieftină formă de tratament: o igienizare periodică previne cariile și boala parodontală. Aici găsiți tarifele pentru detartraj, periaj profesional, AirFlow, fluorizare și sigilări.",
    items: [
      {
        name: "Pachet complet: Detartraj + Periaj + AirFlow",
        price: "250 lei",
      },
      {
        name: "Detartraj + Periaj + AirFlow + Albire cu gutiere",
        price: "700 lei",
      },
      { name: "Periaj profesional", price: "100 lei / ambele arcade" },
      { name: "Fluorizare", price: "150 lei / ambele arcade" },
      { name: "Detartraj", price: "150 lei" },
      { name: "AirFlow", price: "100 lei" },
      {
        name: "Aplicare bijuterie dentară (include bijuteria)",
        price: "300 lei",
      },
      { name: "Sigilare dinte temporar", price: "200 lei" },
      { name: "Sigilare dinte definitiv", price: "200 lei" },
    ],
  },
  {
    slug: "odontoterapie",
    label: "Odontoterapie",
    h1: "Prețuri obturații și tratarea cariilor în Câmpulung Muscel",
    title: "Preț Plombă Dentară Câmpulung | de la 150 lei | Dentologia",
    metaDescription:
      "Obturație fizionomică de la 200 lei, obturație dinte frontal 350 lei, obturație CIS 150 lei, reconstrucție dinte fracturat 200–300 lei. Câmpulung Muscel.",
    intro:
      "Odontoterapia tratează caria dentară. Obturația (plomba) fizionomică reface forma și funcția dintelui folosind material compozit de culoarea smalțului. Prețul depinde de mărimea cavității și de poziția dintelui.",
    items: [
      { name: "Obturație fizionomică mică", price: "200 lei" },
      { name: "Obturație fizionomică medie", price: "250 lei" },
      { name: "Obturație fizionomică mare", price: "300 lei" },
      { name: "Obturație dinte frontal", price: "350 lei" },
      { name: "Obturație CIS", price: "150 lei" },
      { name: "Reconstrucție dinte fracturat", price: "200 – 300 lei" },
    ],
  },
  {
    slug: "endodontie",
    label: "Endodonție",
    h1: "Prețuri tratament de canal (endodonție) în Câmpulung Muscel",
    title: "Prețuri Endodonție Câmpulung | de la 250 lei | Dentologia",
    metaDescription:
      "Tratament endodontic rotativ de la 250 lei (monoradicular), 300–500 lei pluriradicular. Retratament, drenaj endodontic, ablație pivot. Câmpulung Muscel.",
    intro:
      "Tratamentul endodontic salvează un dinte al cărui nerv este inflamat sau infectat. Lucrăm cu instrumentar rotativ, care scurtează durata ședinței. Prețul variază după numărul de canale radiculare.",
    items: [
      {
        name: "Consultație de urgență + pansament calmant",
        price: "250 lei",
      },
      {
        name: "Tratament endodontic rotativ — dinte monoradicular",
        price: "250 lei",
      },
      {
        name: "Tratament endodontic rotativ — dinte pluriradicular",
        price: "300 – 500 lei",
      },
      { name: "Retratament — dinte monoradicular", price: "300 lei" },
      {
        name: "Retratament — dinte pluriradicular",
        price: "400 – 600 lei",
      },
      { name: "Drenaj endodontic", price: "100 lei" },
      { name: "Tratament Hidroxid de Calciu", price: "150 lei" },
      { name: "Reconstrucție perete", price: "150 lei" },
      { name: "Ablație pivot", price: "200 lei" },
    ],
  },
  {
    slug: "chirurgie",
    label: "Chirurgie",
    h1: "Prețuri extracții și chirurgie orală în Câmpulung Muscel",
    title: "Prețuri Chirurgie Orală Câmpulung | Extracții | Dentologia",
    metaDescription:
      "Extracție monoradiculară 150–200 lei, pluriradiculară 250–300 lei, molar de minte 400–600 lei, incizie și drenaj abces 200 lei. Câmpulung Muscel.",
    intro:
      "Extracția este ultima soluție, aleasă doar când dintele nu mai poate fi salvat. Toate intervențiile se fac sub anestezie locală. Prețul depinde de numărul de rădăcini și de dificultatea cazului.",
    items: [
      { name: "Extracție monoradiculară", price: "150 – 200 lei" },
      { name: "Extracție pluriradiculară", price: "250 – 300 lei" },
      { name: "Extracție molar de minte", price: "400 – 600 lei" },
      { name: "Incizie + drenaj abces", price: "200 lei" },
      { name: "Decapușonare", price: "150 lei" },
    ],
  },
  {
    slug: "ortodontie",
    label: "Ortodonție",
    h1: "Prețuri ortodonție și aparat dentar în Câmpulung Muscel",
    title: "Preț Aparat Dentar Câmpulung | de la 2.700 lei | Dentologia",
    metaDescription:
      "Aparat metalic 2.700 lei/arcadă, autoligaturant 3.200 lei, Damon 4.500 lei, gutiere Spark de la 1.600 €. Controale, retainer, contenție. Câmpulung Muscel.",
    intro:
      "Ortodonția aliniază dinții și corectează mușcătura, la copii și la adulți. Prețurile de mai jos acoperă aparatele fixe și mobile, gutierele transparente Spark, controalele periodice și contenția de la finalul tratamentului.",
    items: [
      { name: "Consultație", price: "100 lei" },
      { name: "Plan de tratament + Modele de studiu", price: "200 lei" },
      { name: "Aparat metalic", price: "2.700 lei / arcadă" },
      { name: "Aparat autoligaturant", price: "3.200 lei / arcadă" },
      {
        name: "Aparat autoligaturant Damon",
        price: "4.500 lei / arcadă",
      },
      { name: "Aparat metalic segmentar", price: "1.500 lei" },
      { name: "Disjunctor", price: "1.600 lei" },
      { name: "Disjunctor pe 2 miniimplanturi", price: "3.200 lei" },
      { name: "Disjunctor pe 4 miniimplanturi", price: "4.000 lei" },
      { name: "Arc lingual", price: "800 lei" },
      { name: "Arc transpalatinal", price: "800 lei" },
      { name: "Trainer", price: "1.000 lei" },
      { name: "Aparat mobil", price: "1.000 lei" },
      { name: "Control aparat o arcadă", price: "110 lei" },
      { name: "Control aparat două arcade", price: "170 lei" },
      { name: "Control aparat mobil", price: "100 lei" },
      { name: "Recolare bracket metalic", price: "50 lei" },
      { name: "Recolare tub", price: "75 lei" },
      {
        name: "Recolare bracket autoligaturant / Damon",
        price: "75 lei",
      },
      { name: "Inel ortodontic", price: "100 lei" },
      { name: "Gutieră de contenție", price: "350 lei" },
      { name: "Gutieră de bruxism", price: "350 lei" },
      { name: "Retainer", price: "350 lei" },
      {
        name: "Îndepărtare aparat + retainer + gutieră",
        price: "1.200 lei",
      },
      { name: "Spark 10 / ambele arcade", price: "1.600 EUR" },
      { name: "Spark 20 / ambele arcade", price: "2.800 EUR" },
      { name: "Spark Advance / ambele arcade", price: "3.500 EUR" },
    ],
  },
  {
    slug: "protetica",
    label: "Protetică",
    h1: "Prețuri coroane, fațete și proteze dentare în Câmpulung Muscel",
    title: "Preț Coroană Zirconiu Câmpulung | de la 900 lei | Dentologia",
    metaDescription:
      "Coroană zirconiu de la 900 lei, zirconiu + ceramică 1.100 lei, fațete Emax Ivoclar 1.800 lei/element, proteză totală de la 2.000 lei. Câmpulung Muscel.",
    intro:
      "Protetica reface dinții pierduți sau grav deteriorați. Lucrăm cu zirconiu monolit și stratificat, ceramică Emax Ivoclar și componente Dentsply Sirona, iar proteze mobile realizăm atât acrilice, cât și flexibile.",
    items: [
      {
        name: "Element zirconiu monolit multistratificat",
        price: "900 lei",
      },
      {
        name: "Element zirconiu monolit multistratificat Dentsply Sirona",
        price: "1.000 lei",
      },
      { name: "Element zirconiu + ceramică", price: "1.100 lei" },
      {
        name: "Element zirconiu + ceramică Dentsply Sirona",
        price: "1.500 lei",
      },
      { name: "Element zirconiu implant", price: "1.000 lei" },
      {
        name: "Element zirconiu implant Dentsply Sirona",
        price: "1.600 lei",
      },
      {
        name: "Element zirconiu + ceramică implant",
        price: "1.700 lei",
      },
      {
        name: "Element zirconiu + ceramică implant Dentsply Sirona",
        price: "2.000 lei",
      },
      { name: "Cimentare bont (tibase) implant", price: "100 lei" },
      {
        name: "Emax Ivoclar (fațete, punți, coroane)",
        price: "1.800 lei / element",
      },
      { name: "Inlay Emax Ivoclar", price: "800 lei" },
      { name: "RCR zirconiu", price: "300 lei" },
      {
        name: "Reconstrucție gingivală roz element",
        price: "80 lei",
      },
      { name: "Gutiere albire", price: "350 lei" },
      { name: "Gutieră bruxism", price: "350 lei" },
      { name: "Element Weisser Crom", price: "350 lei" },
      { name: "Cimentare coroană", price: "80 lei" },
      { name: "RCR metalic (crom)", price: "200 lei" },
      { name: "Element metalo-ceramică", price: "700 lei" },
      { name: "Proteză totală acrilică", price: "2.000 lei" },
      { name: "Proteză totală flexibilă", price: "2.200 lei" },
      { name: "Proteză parțială acrilică", price: "1.500 lei" },
      { name: "Proteză parțială flexibilă", price: "2.200 lei" },
      { name: "Rebazare proteză", price: "250 lei" },
      { name: "Element coroană acrilat", price: "200 lei" },
      { name: "Coroană provizorie PMMA", price: "100 lei" },
      { name: "Ablație / dinte", price: "100 lei" },
    ],
  },
];

export const totalServiceItems = serviceCategories.reduce(
  (sum, cat) => sum + cat.items.length,
  0,
);

export function getServiceCategory(slug: string): ServiceCategory | undefined {
  return serviceCategories.find((cat) => cat.slug === slug);
}

export type ParsedPrice =
  | { kind: "single"; value: number; currency: "RON" | "EUR" }
  | { kind: "range"; min: number; max: number; currency: "RON" | "EUR" };

/**
 * Turns a display price into something schema.org accepts.
 *
 * Prices are authored for humans — "2.700 lei / arcadă", "300 – 500 lei",
 * "1.600 EUR" — but `Offer.price` must be a bare number, and a range has to
 * become an `AggregateOffer`. Romanian uses "." as the thousands separator, so
 * "2.700" is two thousand seven hundred, not 2.7.
 *
 * Returns null rather than guessing when no number can be read.
 */
export function parsePrice(price: string): ParsedPrice | null {
  const currency = /eur|€/i.test(price) ? "EUR" : "RON";

  // 1–3 digits, then any number of ".ddd" groups. Matches 100, 2.700, 1.600.
  const numbers = Array.from(price.matchAll(/\d{1,3}(?:\.\d{3})*/g)).map((m) =>
    Number(m[0].replace(/\./g, "")),
  );

  if (numbers.length === 0) return null;
  if (numbers.length === 1) {
    return { kind: "single", value: numbers[0], currency };
  }

  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  return min === max
    ? { kind: "single", value: min, currency }
    : { kind: "range", min, max, currency };
}

/**
 * Price rows whose name matches any of `names`, drawn from every category.
 * Service pages cut across the clinical categories — an implant page needs
 * rows from both `chirurgie` and `protetica` — so they select by name.
 */
export function itemsByName(names: readonly string[]): ServiceItem[] {
  const wanted = new Set(names);
  return serviceCategories
    .flatMap((cat) => cat.items)
    .filter((item) => wanted.has(item.name));
}
