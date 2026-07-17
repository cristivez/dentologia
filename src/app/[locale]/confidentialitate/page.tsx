import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { generatePageMetadata } from "@/lib/metadata";
import { CLINIC } from "@/lib/constants";

export const metadata: Metadata = generatePageMetadata({
  title: "Politica de Confidențialitate | Dentologia",
  description:
    "Politica de confidențialitate și prelucrare a datelor cu caracter personal la Dentologia, Câmpulung Muscel.",
  path: "/confidentialitate",
});

export default function PrivacyPage() {
  return (
    <Container as="section" className="py-20 pt-28">
      <SectionHeading
        as="h1"
        title="Politica de confidențialitate"
        subtitle="Informații privind prelucrarea datelor cu caracter personal"
      />

      <div className="max-w-3xl mx-auto space-y-6 text-sm text-muted leading-relaxed">
        <section>
          <h3 className="text-base font-semibold text-foreground mb-2">
            1. Operator de date
          </h3>
          <p>
            Operatorul de date cu caracter personal este {CLINIC.fullName}, cu
            sediul în {CLINIC.address.full}, email:{" "}
            <a
              href={`mailto:${CLINIC.email}`}
              className="text-primary underline underline-offset-2"
            >
              {CLINIC.email}
            </a>
            , telefon: {CLINIC.phoneDisplay}.
          </p>
        </section>

        <section>
          <h3 className="text-base font-semibold text-foreground mb-2">
            2. Date colectate
          </h3>
          <p>
            Colectăm doar datele strict necesare pentru funcționarea site-ului:
            statistici de navigare anonime și agregate (prin Cloudflare Web
            Analytics, fără cookie-uri și fără date cu caracter personal) și
            datele pe care ni le furnizați voluntar prin telefon, WhatsApp sau
            email (nume, număr de telefon, detalii programare).
          </p>
        </section>

        <section>
          <h3 className="text-base font-semibold text-foreground mb-2">
            3. Scopul prelucrării
          </h3>
          <p>
            Datele sunt prelucrate exclusiv pentru: gestionarea programărilor,
            comunicarea cu pacienții, îmbunătățirea serviciilor și analiza
            anonimă a traficului pe site (statistici agregate, fără cookie-uri).
          </p>
        </section>

        <section>
          <h3 className="text-base font-semibold text-foreground mb-2">
            4. Cookie-uri
          </h3>
          <p>
            Site-ul nu folosește cookie-uri de urmărire sau de publicitate.
            Pentru statistici de trafic folosim Cloudflare Web Analytics, o
            soluție care nu plasează cookie-uri și nu colectează date cu
            caracter personal — de aceea nu este necesar un banner de
            consimțământ pentru cookie-uri.
          </p>
        </section>

        <section>
          <h3 className="text-base font-semibold text-foreground mb-2">
            5. Durata stocării
          </h3>
          <p>
            Statisticile de trafic sunt anonime și agregate, păstrate conform
            politicii Cloudflare. Datele de contact furnizate pentru programări
            sunt păstrate pe durata relației cu pacientul.
          </p>
        </section>

        <section>
          <h3 className="text-base font-semibold text-foreground mb-2">
            6. Drepturile dvs.
          </h3>
          <p>
            Conform Regulamentului GDPR (UE) 2016/679, aveți dreptul de acces,
            rectificare, ștergere, restricționare, portabilitate și opoziție.
            Pentru exercitarea acestor drepturi, contactați-ne la{" "}
            <a
              href={`mailto:${CLINIC.email}`}
              className="text-primary underline underline-offset-2"
            >
              {CLINIC.email}
            </a>
            .
          </p>
        </section>

        <section>
          <h3 className="text-base font-semibold text-foreground mb-2">
            7. Contact
          </h3>
          <p>
            Pentru orice întrebări privind prelucrarea datelor personale, ne
            puteți contacta la {CLINIC.phoneDisplay} sau pe email la{" "}
            <a
              href={`mailto:${CLINIC.email}`}
              className="text-primary underline underline-offset-2"
            >
              {CLINIC.email}
            </a>
            .
          </p>
        </section>
      </div>
    </Container>
  );
}
