import { use, type CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { BreadcrumbJsonLd, PhysicianJsonLd } from "@/components/shared/JsonLd";
import { generatePageMetadata } from "@/lib/metadata";
import { CLINIC } from "@/lib/constants";
import { routing } from "@/i18n/routing";
import { team } from "@/data/team";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = generatePageMetadata({
  title: "Echipa Dentologia — Medici Stomatologi în Câmpulung Muscel",
  description:
    "Cunoaște echipa clinicii Dentologia din Câmpulung Muscel. Medic ortodont și fondator: Dr. Alexandra Zemeleaga-Ciobotea. Tratamente ortodontice pentru copii și adulți.",
  path: "/echipa",
});

export default function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Acasă", url: CLINIC.url },
          { name: "Echipa", url: `${CLINIC.url}/echipa` },
        ]}
      />
      <PhysicianJsonLd members={team} />

      <Container as="section" className="py-20 pt-28">
        <div
          className="rise"
          style={{ "--rise-delay": "0ms" } as CSSProperties}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Echipa Dentologia
          </h1>
          <p className="text-muted text-lg text-center max-w-2xl mx-auto mb-16">
            Medici cu experiență, dedicați sănătății zâmbetului tău în Câmpulung
            Muscel.
          </p>
        </div>

        <div className="mx-auto max-w-4xl space-y-16">
          {team.map((member, i) => (
            <AnimatedSection key={member.slug} delay={i * 0.1}>
              <article
                id={member.slug}
                className="grid gap-8 md:grid-cols-[300px_1fr] md:items-center scroll-mt-28"
              >
                <Image
                  src={member.photo}
                  alt={`${member.name} — ${member.role}`}
                  width={800}
                  height={1174}
                  sizes="(min-width: 768px) 300px, 100vw"
                  className="rounded-2xl border border-border object-cover"
                />
                <div>
                  <h2 className="text-2xl font-bold mb-1">{member.name}</h2>
                  <p className="text-primary font-semibold mb-4">
                    {member.role}
                  </p>
                  <p className="text-muted leading-relaxed">{member.bio}</p>
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.2}>
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href={`tel:${CLINIC.phone}`} size="lg">
              <Phone size={20} aria-hidden="true" />
              Programează o consultație
            </Button>
          </div>
        </AnimatedSection>
      </Container>
    </>
  );
}
