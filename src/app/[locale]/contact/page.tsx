import type { Metadata } from "next";
import { Phone, MessageCircle, MapPin, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { generatePageMetadata } from "@/lib/metadata";
import { CLINIC, SCHEDULE } from "@/lib/constants";

export const metadata: Metadata = generatePageMetadata({
  title: "Contact Dentist Câmpulung Muscel | Dentologia",
  description:
    "Contactează Dentologia: telefon 0750 486 564, WhatsApp, adresă Strada General Iosif Teodorescu 2, Câmpulung 115100. Program Luni-Vineri 09:00-19:00.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <Container as="section" className="py-20 pt-28">
      <AnimatedSection>
        <SectionHeading
          title="Contact"
          subtitle="Sunați sau scrieți-ne pentru programări"
        />
      </AnimatedSection>

      {/* CTA Buttons */}
      <AnimatedSection delay={0.1}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button
            href={`tel:${CLINIC.phone}`}
            variant="primary"
            size="lg"
            aria-label="Sună acum"
          >
            <Phone size={20} />
            Sună acum
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

      {/* Info Grid */}
      <AnimatedSection delay={0.2}>
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto mb-12">
          {/* Address */}
          <div className="rounded-2xl bg-surface border border-border p-6">
            <div className="flex items-start gap-3 mb-3">
              <MapPin size={20} className="text-primary shrink-0 mt-0.5" />
              <h3 className="text-base font-semibold text-foreground">
                Adresă
              </h3>
            </div>
            <p className="text-sm text-muted leading-relaxed mb-3">
              {CLINIC.address.street}
              <br />
              {CLINIC.address.city} {CLINIC.address.postalCode}
              <br />
              Jud. {CLINIC.address.county}
            </p>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${CLINIC.coordinates.lat},${CLINIC.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary underline underline-offset-2 [@media(hover:hover)]:hover:opacity-80 transition-opacity"
            >
              Deschide în Google Maps →
            </a>
          </div>

          {/* Schedule */}
          <div className="rounded-2xl bg-surface border border-border p-6">
            <div className="flex items-start gap-3 mb-3">
              <Clock size={20} className="text-primary shrink-0 mt-0.5" />
              <h3 className="text-base font-semibold text-foreground">
                Program
              </h3>
            </div>
            <table className="w-full text-sm" role="table">
              <tbody>
                {SCHEDULE.map((entry) => (
                  <tr key={entry.day} className="flex justify-between py-1.5">
                    <td className="text-muted">{entry.day}</td>
                    <td className="text-foreground font-medium">
                      {entry.open && entry.close
                        ? `${entry.open} – ${entry.close}`
                        : "Închis"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phone & Email */}
          <div className="rounded-2xl bg-surface border border-border p-6">
            <div className="flex items-start gap-3 mb-3">
              <Phone size={20} className="text-primary shrink-0 mt-0.5" />
              <h3 className="text-base font-semibold text-foreground">
                Telefon
              </h3>
            </div>
            <a
              href={`tel:${CLINIC.phone}`}
              className="text-sm text-foreground [@media(hover:hover)]:hover:text-primary transition-colors"
            >
              {CLINIC.phoneDisplay}
            </a>
            <p className="text-sm text-muted mt-2">{CLINIC.email}</p>
          </div>

          {/* Social */}
          <div className="rounded-2xl bg-surface border border-border p-6">
            <h3 className="text-base font-semibold text-foreground mb-4">
              Social
            </h3>
            <div className="flex gap-4">
              <a
                href={CLINIC.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex items-center justify-center w-11 h-11 min-h-[44px] min-w-[44px] rounded-full bg-surface-elevated text-foreground [@media(hover:hover)]:hover:text-primary transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href={CLINIC.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex items-center justify-center w-11 h-11 min-h-[44px] min-w-[44px] rounded-full bg-surface-elevated text-foreground [@media(hover:hover)]:hover:text-primary transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Google Maps Embed */}
      <AnimatedSection delay={0.3}>
        <div className="rounded-2xl overflow-hidden border border-border max-w-4xl mx-auto">
          <iframe
            src={CLINIC.googleMapsEmbed}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Locația Dentologia pe Google Maps"
          />
        </div>
      </AnimatedSection>
    </Container>
  );
}
