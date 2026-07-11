export type Review = {
  rating: number;
  text: string;
  author: string;
};

/**
 * Patient testimonials shown on /recenzii and the homepage.
 *
 * Empty on purpose. The nine entries previously here were invented during the
 * v2 rebuild and published under the heading "Recenzii reale de pe Google
 * Maps" — none of the authors appear on the clinic's Google Business Profile.
 * Publishing fabricated consumer testimonials is sanctionable under OUG
 * 58/2022 (the Romanian transposition of the EU Omnibus Directive).
 *
 * Only add entries here that are copied verbatim from a real review on
 * https://www.google.com/maps?cid=15236386707900164590 — attribute the author
 * as first name + surname initial. While this list is empty both pages fall
 * back to linking the Google profile directly, which is accurate either way.
 */
export const reviews: Review[] = [];
