import { ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { GoogleRating } from "@/components/shared/GoogleRating";
import { reviews } from "@/data/reviews";
import { CLINIC, GOOGLE_RATING, formattedRating } from "@/lib/constants";
import { ReviewCarousel } from "./ReviewCarousel";

/**
 * Rendered while `reviews` is empty. The clinic's reviews are real and live on
 * Google, so sending visitors there is both accurate and useful: it is also
 * where a new review has to be left, which is the strongest local-ranking
 * signal available to this business.
 */
function GoogleReviewsPanel() {
  return (
    <Card className="max-w-2xl mx-auto p-8 text-center">
      <h2 className="text-xl font-bold mb-3">
        Recenziile noastre sunt pe Google
      </h2>
      <p className="text-muted leading-relaxed mb-6">
        Pacienții ne-au acordat {formattedRating} din 5 stele în{" "}
        {GOOGLE_RATING.count} recenzii pe Google Maps. Le puteți citi integral,
        direct la sursă.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
        {reviews.length > 0 ? <ReviewCarousel /> : <GoogleReviewsPanel />}
      </AnimatedSection>
    </Container>
  );
}
