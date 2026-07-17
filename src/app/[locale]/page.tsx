import { use, type CSSProperties } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CLINIC, SCHEDULE, formatHours } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { AnimatedGroup, AnimatedItem } from "@/components/shared/AnimatedGroup";
import { Parallax } from "@/components/shared/Parallax";
import { GoogleRating } from "@/components/shared/GoogleRating";
import { PriceTabs } from "@/components/shared/PriceTabs";
import { FaqItem } from "@/components/shared/FaqItem";
import { faqItems } from "@/data/faq";
import {
  ChevronDown,
  FileText,
  Smile,
  Star,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";

const servicePreview = [
  {
    Icon: FileText,
    titleKey: "card1_title" as const,
    descKey: "card1_description" as const,
    slug: "urgente-stomatologice",
  },
  {
    Icon: Star,
    titleKey: "card2_title" as const,
    descKey: "card2_description" as const,
    slug: "implant-dentar",
  },
  {
    Icon: Smile,
    titleKey: "card3_title" as const,
    descKey: "card3_description" as const,
    slug: "aparat-dentar",
  },
];

export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // Opting this page into static rendering. Without it next-intl marks the
  // route dynamic and Cloudflare re-renders it on every request.
  const { locale } = use(params);
  setRequestLocale(locale);

  const t = useTranslations("Hero");
  const ts = useTranslations("Services");
  const th = useTranslations("Home");

  const topFaqs = faqItems.slice(0, 3);

  const weekdaySchedule = SCHEDULE.find((s) => s.day === "Luni");
  const saturdaySchedule = SCHEDULE.find((s) => s.day === "Sâmbătă");
  const sundaySchedule = SCHEDULE.find((s) => s.day === "Duminică");

  return (
    <>
      {/* Hero — server-rendered, no JS gate. Entrance is CSS transform only. */}
      <section className="flex min-h-dvh flex-col items-center justify-center px-4 py-24 text-center">
        <div
          className="rise"
          style={{ "--rise-delay": "0ms" } as CSSProperties}
        >
          <Image
            src="/logo.webp"
            alt={`${CLINIC.name} - Logo`}
            width={120}
            height={120}
            className="logo-glow mb-6 rounded-full"
            priority
          />
        </div>

        <p
          className="rise text-sm font-semibold uppercase tracking-[0.2em] text-accent mb-3"
          style={{ "--rise-delay": "60ms" } as CSSProperties}
        >
          {t("brand")}
        </p>

        <h1
          className="rise max-w-4xl text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 text-balance"
          style={{ "--rise-delay": "120ms" } as CSSProperties}
        >
          {t("title")}
        </h1>

        <p
          className="rise text-lg sm:text-xl text-muted mb-4"
          style={{ "--rise-delay": "180ms" } as CSSProperties}
        >
          {t("subtitle")}
        </p>

        <p
          className="rise max-w-xl text-base text-accent mb-8 leading-relaxed"
          style={{ "--rise-delay": "220ms" } as CSSProperties}
        >
          {t("tagline")}
        </p>

        <div
          className="rise flex flex-col sm:flex-row gap-4"
          style={{ "--rise-delay": "260ms" } as CSSProperties}
        >
          <Button href="/servicii" size="lg">
            {t("cta_services")}
          </Button>
          <Button href={`tel:${CLINIC.phone}`} variant="secondary" size="lg">
            <Phone size={20} aria-hidden="true" />
            {CLINIC.phoneDisplay}
          </Button>
        </div>

        <div
          className="rise mt-10"
          style={{ "--rise-delay": "300ms" } as CSSProperties}
        >
          <GoogleRating size="sm" />
        </div>

        <a
          href="#servicii-preview"
          className="mt-12 animate-bounce text-muted min-h-[44px] flex items-center"
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
          <AnimatedGroup className="grid gap-6 md:grid-cols-3">
            {servicePreview.map((svc) => (
              <AnimatedItem key={svc.slug} className="h-full">
                <Card hover className="h-full flex flex-col">
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
                  <Link
                    href={`/servicii/${svc.slug}`}
                    className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-primary [@media(hover:hover)]:hover:underline"
                  >
                    {th("see_prices")}
                  </Link>
                </Card>
              </AnimatedItem>
            ))}
          </AnimatedGroup>
          <AnimatedSection>
            <div className="text-center mt-8">
              <Button href="/servicii" variant="secondary">
                {th("all_services")}
              </Button>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* Prices — one category at a time. Full list lives at /preturi. */}
      <section className="py-20">
        <Container>
          <AnimatedSection>
            <SectionHeading
              title={th("prices_title")}
              subtitle={th("prices_subtitle")}
            />
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="mx-auto max-w-3xl">
              <PriceTabs seePricesLabel={th("see_category_prices")} />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="mt-8 text-center">
              <Button href="/preturi" variant="secondary">
                {th("all_prices")}
              </Button>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* About */}
      <section className="bg-surface py-20">
        <Container>
          <AnimatedSection>
            <SectionHeading
              title={th("about_title")}
              subtitle={th("about_subtitle")}
            />
          </AnimatedSection>
          <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
            <AnimatedSection delay={0.1}>
              <Parallax className="rounded-2xl border border-border" amount={6}>
                <Image
                  src="/photos/receptie.webp"
                  alt="Recepția clinicii Dentologia din Câmpulung Muscel"
                  width={1152}
                  height={1475}
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="block w-full object-cover transition-transform duration-700 ease-out [@media(hover:hover)]:hover:scale-[1.03]"
                />
              </Parallax>
            </AnimatedSection>

            <AnimatedGroup className="space-y-4">
              {(["about_p1", "about_p2", "about_p3"] as const).map((key) => (
                <AnimatedItem key={key}>
                  <p className="text-muted leading-relaxed">{th(key)}</p>
                </AnimatedItem>
              ))}
            </AnimatedGroup>
          </div>
        </Container>
      </section>

      {/* Gallery — real clinic-in-action photos (staff consent on record) */}
      <section className="py-20">
        <Container>
          <AnimatedSection>
            <SectionHeading
              title={th("gallery_title")}
              subtitle={th("gallery_subtitle")}
            />
          </AnimatedSection>
          <AnimatedGroup className="grid gap-4 sm:grid-cols-3">
            {[
              {
                src: "/photos/galerie-1.webp",
                alt: "Medic stomatolog în timpul unui tratament la Dentologia",
              },
              {
                src: "/photos/galerie-2.webp",
                alt: "Echipa Dentologia în timpul unei intervenții stomatologice",
              },
              {
                src: "/photos/galerie-3.webp",
                alt: "Tratament ortodontic la clinica Dentologia din Câmpulung Muscel",
              },
            ].map((img) => (
              <AnimatedItem key={img.src}>
                <Parallax
                  className="h-full rounded-2xl border border-border"
                  amount={8}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={760}
                    height={950}
                    sizes="(min-width: 640px) 30vw, 100vw"
                    className="block w-full object-cover transition-transform duration-700 ease-out [@media(hover:hover)]:hover:scale-[1.04]"
                  />
                </Parallax>
              </AnimatedItem>
            ))}
          </AnimatedGroup>
          <AnimatedSection delay={0.2}>
            <div className="mt-8 text-center">
              <Button href="/echipa" variant="secondary">
                {th("team_link")}
              </Button>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* Reviews Preview */}
      <section className="bg-surface py-20">
        <Container>
          <AnimatedSection>
            <SectionHeading
              title={th("reviews_title")}
              subtitle={th("reviews_subtitle")}
            />
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <GoogleRating size="md" />
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="text-center mt-8">
              <Button href="/recenzii" variant="secondary">
                {th("all_reviews")}
              </Button>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* FAQ Preview */}
      <section className="py-20">
        <Container>
          <AnimatedSection>
            <SectionHeading
              title={th("faq_title")}
              subtitle={th("faq_subtitle")}
            />
          </AnimatedSection>

          <AnimatedGroup className="max-w-3xl mx-auto space-y-3">
            {topFaqs.map((item) => (
              <AnimatedItem key={item.question}>
                <FaqItem question={item.question} answer={item.answer} />
              </AnimatedItem>
            ))}
          </AnimatedGroup>

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
      <section className="bg-surface py-20">
        <Container>
          <AnimatedSection>
            <SectionHeading
              title={th("contact_title")}
              subtitle={th("contact_subtitle")}
            />
          </AnimatedSection>

          <AnimatedGroup className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
            <AnimatedItem className="h-full">
              <Card className="h-full">
                <div className="flex items-start gap-3">
                  <MapPin
                    size={18}
                    className="text-primary shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
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
            </AnimatedItem>

            <AnimatedItem className="h-full">
              <Card className="h-full">
                <div className="flex items-start gap-3">
                  <Clock
                    size={18}
                    className="text-primary shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                      {th("schedule")}
                    </h3>
                    <p className="text-sm text-muted">
                      Luni – Vineri: {formatHours(weekdaySchedule)}
                    </p>
                    <p className="text-sm text-muted">
                      Sâmbătă: {formatHours(saturdaySchedule)}
                    </p>
                    <p className="text-sm text-muted">
                      Duminică: {formatHours(sundaySchedule)}
                    </p>
                  </div>
                </div>
              </Card>
            </AnimatedItem>
          </AnimatedGroup>

          <AnimatedSection delay={0.35}>
            <div className="text-center mt-8">
              <Button href="/contact" variant="secondary">
                {th("all_contact")}
                <ArrowRight size={18} aria-hidden="true" />
              </Button>
            </div>
          </AnimatedSection>
        </Container>
      </section>
    </>
  );
}
