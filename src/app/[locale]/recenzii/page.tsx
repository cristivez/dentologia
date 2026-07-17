import { Star, ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { GoogleRating } from "@/components/shared/GoogleRating";
import { reviews } from "@/data/reviews";
import { CLINIC, GOOGLE_RATING, formattedRating } from "@/lib/constants";
import { cn } from "@/lib/utils";

function StarRating({ rating }: { rating: number }) {
  return (
    <div
      className="flex gap-0.5"
      role="img"
      aria-label={`${rating} din 5 stele`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={16}
          className={cn(i < rating ? "fill-star text-star" : "text-muted/40")}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

/**
 * A plain grid, deliberately — this used to be an embla carousel.
 *
 * `reviews` is empty by design (data/reviews.ts), so the carousel rendered
 * never, but Next builds a route's client manifest from the module graph
 * rather than from what renders: importing it shipped embla's ~9KB to every
 * visitor of a page that could not use it. Neither making the page a server
 * component nor `next/dynamic` broke that edge — only not importing it does.
 *
 * A grid needs no JavaScript at all, and for the ~15 reviews this clinic has
 * there was nothing to page through anyway. Pasting real reviews into
 * data/reviews.ts renders them here, server-side, with no client bundle. If a
 * carousel is ever genuinely wanted back, it is in git history — but weigh
 * ~9KB on every visit against swiping through fifteen cards.
 */
function ReviewGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {reviews.map((review) => (
        <Card key={review.author} className="flex h-full flex-col gap-3">
          <StarRating rating={review.rating} />
          <blockquote className="flex-1 text-sm leading-relaxed text-foreground">
            &ldquo;{review.text}&rdquo;
          </blockquote>
          <p className="text-sm font-semibold text-primary">{review.author}</p>
        </Card>
      ))}
    </div>
  );
}

/**
 * Rendered while `reviews` is empty. The clinic's reviews are real and live on
 * Google, so sending visitors there is both accurate and useful: it is also
 * where a new review has to be left, which is the strongest local-ranking
 * signal available to this business.
 */
function GoogleReviewsPanel() {
  return (
    <Card className="mx-auto max-w-2xl p-8 text-center">
      <h2 className="mb-3 text-xl font-bold">
        Recenziile noastre sunt pe Google
      </h2>
      <p className="mb-6 leading-relaxed text-muted">
        Pacienții ne-au acordat {formattedRating} din 5 stele în{" "}
        {GOOGLE_RATING.count} recenzii pe Google Maps. Le puteți citi integral,
        direct la sursă.
      </p>
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button
          href={CLINIC.social.google}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink size={18} aria-hidden="true" />
          Citește recenziile pe Google
        </Button>
        <Button href="/contact" variant="secondary">
          Programează-te
        </Button>
      </div>
    </Card>
  );
}

export default function ReviewsPage() {
  return (
    <Container as="section" className="py-20 pt-28">
      <div className="rise">
        <SectionHeading
          title="Ce spun pacienții noștri"
          subtitle="Recenzii verificate pe Google Maps"
        />
      </div>

      <AnimatedSection delay={0.1}>
        <div className="mb-10">
          <GoogleRating size="lg" />
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.2}>
        {reviews.length > 0 ? <ReviewGrid /> : <GoogleReviewsPanel />}
      </AnimatedSection>
    </Container>
  );
}
