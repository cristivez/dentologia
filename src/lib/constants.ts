export const CLINIC = {
  name: "Dentologia",
  fullName: "Dentologia - Clinică Stomatologică",
  phone: "+40750486564",
  phoneDisplay: "0750 486 564",
  email: "contact@dentologia.ro",
  whatsapp: "https://wa.me/40750486564",
  address: {
    street: "Strada General Iosif Teodorescu 2",
    city: "Câmpulung",
    county: "Argeș",
    postalCode: "115100",
    country: "RO",
    full: "Strada General Iosif Teodorescu 2, Câmpulung 115100",
  },
  coordinates: {
    lat: 45.2649667,
    lng: 25.0412075,
  },
  social: {
    facebook: "https://www.facebook.com/dentologia",
    instagram: "https://www.instagram.com/dentologia.med/",
    google: "https://www.google.com/maps?cid=15236386707900164590",
  },
  googleMapsEmbed:
    "https://maps.google.com/maps?q=45.2649667,25.0412075&hl=ro&z=17&output=embed",
  domain: "dentologia.ro",
  url: "https://dentologia.ro",
} as const;

/**
 * Verified against the Google Business Profile on 2026-07-10.
 * Displayed on-page only — never emitted as `aggregateRating` JSON-LD:
 * Google disallows self-serving review markup on LocalBusiness.
 */
export const GOOGLE_RATING = {
  value: 5.0,
  count: 15,
} as const;

/** "5,0" — Romanian decimal comma. Prose and metadata must both read from here. */
export const formattedRating = GOOGLE_RATING.value.toFixed(1).replace(".", ",");

/** schema.org DayOfWeek enum. Google discards OpeningHoursSpecification that uses anything else. */
export type SchemaDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type ScheduleEntry = {
  /** Romanian label, rendered to visitors. */
  day: string;
  /** Emitted in JSON-LD. Kept beside the label so the two cannot drift apart. */
  schemaDay: SchemaDay;
  open: string | null;
  close: string | null;
};

/**
 * Source of truth for opening hours — matches the Google Business Profile,
 * verified 2026-07-10 (luni–vineri 09–18, sâmbătă and duminică închis).
 *
 * The site previously claimed 09:00–19:00 weekdays and Saturday 09:00–14:00,
 * which matched nothing. The front-door decal is a third variant
 * (sâmbătă 09:00–15:00) and needs correcting in the real world.
 */
export const SCHEDULE: ScheduleEntry[] = [
  { day: "Luni", schemaDay: "Monday", open: "09:00", close: "18:00" },
  { day: "Marți", schemaDay: "Tuesday", open: "09:00", close: "18:00" },
  { day: "Miercuri", schemaDay: "Wednesday", open: "09:00", close: "18:00" },
  { day: "Joi", schemaDay: "Thursday", open: "09:00", close: "18:00" },
  { day: "Vineri", schemaDay: "Friday", open: "09:00", close: "18:00" },
  { day: "Sâmbătă", schemaDay: "Saturday", open: null, close: null },
  { day: "Duminică", schemaDay: "Sunday", open: null, close: null },
];

/** "09:00 – 18:00", or "Închis" on a closed day. Never a bare dash. */
export function formatHours(entry: ScheduleEntry | undefined): string {
  if (!entry?.open || !entry.close) return "Închis";
  return `${entry.open} – ${entry.close}`;
}

/** The days the clinic is actually open, for prose like "Luni – Vineri". */
export const OPEN_DAYS = SCHEDULE.filter((s) => s.open && s.close);
