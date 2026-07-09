import Image from "next/image";
import { useTranslations } from "next-intl";
import { CLINIC, SCHEDULE } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { reviews, aggregateRating } from "@/data/reviews";
import { faqItems } from "@/data/faq";
import {
  ChevronDown,
  Star,
  FileText,
  Smile,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
} from "lucide-react";

const servicePreview = [
  {
    Icon: FileText,
    titleKey: "card1_title" as const,
    descKey: "card1_description" as const,
    slug: "general",
  },
  {
    Icon: Star,
    titleKey: "card2_title" as const,
    descKey: "card2_description" as const,
    slug: "implant",
  },
  {
    Icon: Smile,
    titleKey: "card3_title" as const,
    descKey: "card3_description" as const,
    slug: "ortodontie",
  },
];

export default function HomePage() {
  const t = useTranslations("Hero");
  const ts = useTranslations("Services");
  const th = useTranslations("Home");

  const topFaqs = faqItems.slice(0, 3);
  const topReviews = reviews.slice(0, 2);

  const weekdaySchedule = SCHEDULE.find((s) => s.day === "Luni");
  const saturdaySchedule = SCHEDULE.find((s) => s.day === "Sâmbătă");

  return (
    <>
      {/* Hero */}
      <section className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
        <Image
          src="/logo.webp"
          alt={`${CLINIC.name} - Logo`}
          width={160}
          height={160}
          className="mb-8 rounded-2xl"
          priority
        />
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-4">
          {t("title")}
        </h1>
        <p className="text-xl sm:text-2xl text-muted mb-4">{t("subtitle")}</p>
        <p className="max-w-xl text-base text-accent mb-8 leading-relaxed">
          {t("tagline")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button href="/servicii" size="lg">
            {t("cta_services")}
          </Button>
          <Button href="/contact" variant="secondary" size="lg">
            {t("cta_contact")}
          </Button>
        </div>
        <a
          href="#servicii-preview"
          className="mt-16 animate-bounce text-muted"
          aria-label="Descoperă serviciile"
        >
          <ChevronDown size={32} aria-hidden="true" />
        </a>
      </section>

      {/* Services Preview */}
      <section id="servicii-preview" className="bg-surface py-20">
        <Container>
          <AnimatedSection>
            <SectionHeading
              title={th("services_title")}
              subtitle={th("services_subtitle")}
            />
          </AnimatedSection>
          <div className="grid gap-6 md:grid-cols-3">
            {servicePreview.map((svc, i) => (
              <AnimatedSection key={svc.slug} delay={i * 0.1}>
                <Card hover>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-surface-elevated">
                    <svc.Icon
                      size={28}
                      className="text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{ts(svc.titleKey)}</h3>
                  <p className="text-muted text-sm leading-relaxed mb-4 line-clamp-3">
                    {ts(svc.descKey)}
                  </p>
                  <a
                    href={`/preturi?tab=${svc.slug}`}
                    className="text-sm font-semibold text-primary [@media(hover:hover)]:hover:underline"
                  >
                    {th("see_prices")}
                  </a>
                </Card>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection>
            <div className="text-center mt-8">
              <Button href="/servicii" variant="secondary">
                {th("all_services")}
              </Button>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* Reviews Preview */}
      <section className="py-20">
        <Container>
          <AnimatedSection>
            <SectionHeading
              title={th("reviews_title")}
              subtitle={th("reviews_subtitle")}
            />
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="flex flex-col items-center gap-2 mb-8">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-foreground">
                  {aggregateRating.value.toFixed(1)}
                </span>
                <div className="flex flex-col gap-1">
                  <div
                    className="flex gap-0.5"
                    role="img"
                    aria-label="5 din 5 stele"
                  >
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} size={18} className="fill-star text-star" />
                    ))}
                  </div>
                  <span className="text-sm text-muted">
                    {aggregateRating.count} recenzii pe Google
                  </span>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            {topReviews.map((review, i) => (
              <AnimatedSection key={i} delay={0.15 + i * 0.1}>
                <Card>
                  <div
                    className="flex gap-0.5 mb-3"
                    role="img"
                    aria-label="5 din 5 stele"
                  >
                    {Array.from({ length: 5 }, (_, j) => (
                      <Star key={j} size={14} className="fill-star text-star" />
                    ))}
                  </div>
                  <blockquote className="text-sm text-foreground leading-relaxed mb-3">
                    &ldquo;{review.text}&rdquo;
                  </blockquote>
                  <p className="text-sm font-semibold text-primary">
                    {review.author}
                  </p>
                </Card>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.3}>
            <div className="text-center mt-8">
              <Button href="/recenzii" variant="secondary">
                {th("all_reviews")}
              </Button>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* FAQ Preview */}
      <section className="bg-surface py-20">
        <Container>
          <AnimatedSection>
            <SectionHeading
              title={th("faq_title")}
              subtitle={th("faq_subtitle")}
            />
          </AnimatedSection>

          <div className="max-w-3xl mx-auto space-y-3">
            {topFaqs.map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <details className="group rounded-xl border border-border bg-background overflow-hidden">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-foreground font-medium text-sm min-h-[44px] list-none [&::-webkit-details-marker]:hidden">
                    <span>{item.question}</span>
                    <span
                      className="shrink-0 text-muted transition-transform duration-200 group-open:rotate-45"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>
                  <div className="px-5 pb-4 text-sm text-muted leading-relaxed">
                    <p>{item.answer}</p>
                  </div>
                </details>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.3}>
            <div className="text-center mt-8">
              <Button href="/intrebari" variant="secondary">
                {th("all_faq")}
              </Button>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* Contact CTA */}
      <section className="py-20">
        <Container>
          <AnimatedSection>
            <SectionHeading
              title={th("contact_title")}
              subtitle={th("contact_subtitle")}
            />
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Button
                href={`tel:${CLINIC.phone}`}
                variant="primary"
                size="lg"
                aria-label="Sună acum"
              >
                <Phone size={20} />
                {th("call_now")}
              </Button>
              <Button
                href={CLINIC.whatsapp}
                variant="whatsapp"
                size="lg"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Scrie pe WhatsApp"
              >
                <MessageCircle size={20} />
                WhatsApp
              </Button>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
            <AnimatedSection delay={0.2}>
              <Card>
                <div className="flex items-start gap-3 mb-2">
                  <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                      {th("address")}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {CLINIC.address.street}
                      <br />
                      {CLINIC.address.city} {CLINIC.address.postalCode}
                    </p>
                  </div>
                </div>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={0.25}>
              <Card>
                <div className="flex items-start gap-3 mb-2">
                  <Clock size={18} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                      {th("schedule")}
                    </h3>
                    <p className="text-sm text-muted">
                      Luni – Vineri: {weekdaySchedule?.open} –{" "}
                      {weekdaySchedule?.close}
                    </p>
                    <p className="text-sm text-muted">
                      Sâmbătă: {saturdaySchedule?.open} –{" "}
                      {saturdaySchedule?.close}
                    </p>
                  </div>
                </div>
              </Card>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={0.35}>
            <div className="text-center mt-8">
              <Button href="/contact" variant="secondary">
                {th("all_contact")}
              </Button>
            </div>
          </AnimatedSection>
        </Container>
      </section>
    </>
  );
}
