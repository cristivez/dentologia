import {
  itemsByName,
  type ServiceItem,
  type ServiceCategorySlug,
} from "./services";

export const SERVICE_PAGE_SLUGS = [
  "implant-dentar",
  "aparat-dentar",
  "albire-dentara",
  "detartraj-profesional",
  "urgente-stomatologice",
] as const;

export type ServicePageSlug = (typeof SERVICE_PAGE_SLUGS)[number];

/** A `MedicalProcedure` offer. `price` must be a bare number — schema.org rejects "250 lei". */
export type ServiceOffer = {
  name: string;
  price: string;
};

export type ServicePage = {
  slug: ServicePageSlug;
  /** Drives <h1>. Carries the city, because that is what people search for. */
  h1: string;
  title: string;
  metaDescription: string;
  /** Shown under the h1. Two or three sentences, plain Romanian. */
  intro: string;
  sections: { heading: string; body: string }[];
  /** Price rows pulled from services.ts by exact name. Never retyped here. */
  priceItemNames: readonly string[];
  /** Rendered when the clinic publishes no fixed price for the procedure. */
  priceNote?: string;
  offers: ServiceOffer[];
  faq: { question: string; answer: string }[];
  relatedSlugs: readonly ServicePageSlug[];
  /** The price category this service belongs to, for the "see full prices" link. */
  priceCategory: ServiceCategorySlug;
};

export const servicePages: ServicePage[] = [
  {
    slug: "implant-dentar",
    h1: "Implant dentar în Câmpulung Muscel",
    title: "Implant Dentar Câmpulung Muscel | Preț și Etape | Dentologia",
    metaDescription:
      "Implant dentar în Câmpulung Muscel la Dentologia. Consultație de specialitate 100 lei, coroană zirconiu pe implant de la 1.000 lei. Programări: 0750 486 564.",
    intro:
      "Implantul dentar este soluția cea mai apropiată de un dinte natural atunci când ați pierdut unul sau mai mulți dinți. La Dentologia, în Câmpulung Muscel, montăm implanturi dentare și realizăm coroana finală din zirconiu în cabinetul nostru, folosind aparatură modernă.",
    sections: [
      {
        heading: "Ce este un implant dentar",
        body: "Implantul dentar este o rădăcină artificială din titan care se inserează în osul maxilar și înlocuiește rădăcina dintelui pierdut. Peste implant se fixează un bont (tibase) și, în final, o coroană dentară — de obicei din zirconiu — care arată și funcționează ca un dinte natural.",
      },
      {
        heading: "Etapele tratamentului",
        body: "Totul începe cu o consultație de specialitate (100 lei), în cadrul căreia evaluăm starea osului și stabilim planul de tratament. Urmează inserarea implantului, apoi o perioadă de vindecare (osteointegrare) de câteva luni. La final cimentăm bontul și coroana definitivă. Numărul de vizite și durata totală depind de fiecare caz în parte.",
      },
      {
        heading: "Cât costă un implant dentar",
        body: "Prețul lucrării complete depinde de tipul implantului ales, de starea osului și de coroana finală, așa că îl stabilim la consultație. Prețurile pentru partea protetică — coroana care se montează pe implant — sunt însă publice și le găsiți mai jos.",
      },
      {
        heading: "De ce implant și nu punte dentară",
        body: "O punte dentară necesită șlefuirea dinților vecini, sănătoși. Implantul se sprijină pe os, nu pe dinții alăturați, și previne resorbția osoasă care apare în timp după pierderea unui dinte. Este soluția care păstrează cel mai bine structura naturală a gurii.",
      },
    ],
    priceItemNames: [
      "Consultație de specialitate",
      "Element zirconiu implant",
      "Element zirconiu implant Dentsply Sirona",
      "Element zirconiu + ceramică implant",
      "Element zirconiu + ceramică implant Dentsply Sirona",
      "Cimentare bont (tibase) implant",
    ],
    priceNote:
      "Prețul inserării implantului se stabilește la consultația de specialitate (100 lei), în funcție de caz. Prețurile de mai jos acoperă partea protetică — bontul și coroana montate pe implant.",
    offers: [
      { name: "Consultație de specialitate", price: "100" },
      { name: "Element zirconiu implant", price: "1000" },
      { name: "Element zirconiu + ceramică implant", price: "1700" },
      { name: "Cimentare bont (tibase) implant", price: "100" },
    ],
    faq: [
      {
        question: "Cât costă un implant dentar la Dentologia în Câmpulung?",
        answer:
          "Prețul inserării implantului se stabilește la consultația de specialitate (100 lei), pentru că depinde de tipul implantului și de starea osului. Partea protetică are prețuri fixe: coroana din zirconiu pe implant pornește de la 1.000 lei, coroana din zirconiu + ceramică de la 1.700 lei, iar cimentarea bontului (tibase) este 100 lei.",
      },
      {
        question: "Doare montarea unui implant dentar?",
        answer:
          "Procedura se face sub anestezie locală, așa că nu veți simți durere în timpul intervenției. După intervenție pot apărea disconfort și o ușoară inflamație câteva zile, care se gestionează cu medicația recomandată de medic.",
      },
      {
        question: "Cât durează până am dintele final?",
        answer:
          "După inserarea implantului este nevoie de o perioadă de vindecare (osteointegrare) de câteva luni, în care implantul se integrează în os. Abia apoi se montează coroana definitivă. Durata exactă depinde de caz și v-o comunicăm la consultație.",
      },
    ],
    relatedSlugs: ["aparat-dentar", "urgente-stomatologice"],
    priceCategory: "protetica",
  },
  {
    slug: "aparat-dentar",
    h1: "Aparat dentar în Câmpulung Muscel",
    title: "Aparat Dentar Câmpulung Muscel | Prețuri Ortodonție | Dentologia",
    metaDescription:
      "Aparat dentar în Câmpulung Muscel: metalic 2.700 lei/arcadă, autoligaturant 3.200 lei, Damon 4.500 lei, gutiere Spark de la 1.600 €. Consultație 100 lei.",
    intro:
      "Ortodonția aliniază dinții și corectează mușcătura, la copii și la adulți deopotrivă. La Dentologia oferim toate tipurile de aparat dentar — de la aparatul metalic clasic până la gutierele transparente Spark — cu prețuri afișate transparent.",
    sections: [
      {
        heading: "Tipuri de aparat dentar",
        body: "Aparatul metalic este varianta clasică și cea mai accesibilă. Aparatul autoligaturant reduce frecarea și numărul de vizite de control. Aparatul autoligaturant Damon este o variantă premium a acestuia. Gutierele transparente Spark sunt alternativa aproape invizibilă, potrivită mai ales adulților.",
      },
      {
        heading: "Cât durează tratamentul ortodontic",
        body: "În general între 12 și 24 de luni, în funcție de complexitatea cazului și de tipul aparatului. Pe parcurs sunt necesare controale periodice, la care se ajustează aparatul. La final se aplică un retainer sau o gutieră de contenție, care menține rezultatul obținut.",
      },
      {
        heading: "Ortodonție pentru copii",
        body: "Prima consultație ortodontică este recomandată în jurul vârstei de 7 ani, când se pot depista din timp problemele de creștere a maxilarelor. Pentru cei mici oferim aparate mobile, traineri și disjunctoare, care ghidează dezvoltarea osoasă înainte ca problema să se agraveze.",
      },
      {
        heading: "Ce urmează după scoaterea aparatului",
        body: "Contenția este obligatorie: fără ea dinții tind să revină la poziția inițială. Pachetul de îndepărtare a aparatului include retainerul și gutiera de contenție (1.200 lei).",
      },
    ],
    priceItemNames: [
      "Consultație",
      "Plan de tratament + Modele de studiu",
      "Aparat metalic",
      "Aparat autoligaturant",
      "Aparat autoligaturant Damon",
      "Aparat mobil",
      "Trainer",
      "Control aparat o arcadă",
      "Control aparat două arcade",
      "Gutieră de contenție",
      "Retainer",
      "Îndepărtare aparat + retainer + gutieră",
      "Spark 10 / ambele arcade",
      "Spark 20 / ambele arcade",
      "Spark Advance / ambele arcade",
    ],
    offers: [
      { name: "Consultație ortodontică", price: "100" },
      { name: "Aparat dentar metalic (o arcadă)", price: "2700" },
      { name: "Aparat autoligaturant (o arcadă)", price: "3200" },
      { name: "Aparat autoligaturant Damon (o arcadă)", price: "4500" },
    ],
    faq: [
      {
        question: "Cât costă un aparat dentar în Câmpulung?",
        answer:
          "La Dentologia: aparat metalic 2.700 lei/arcadă, aparat autoligaturant 3.200 lei/arcadă, aparat autoligaturant Damon 4.500 lei/arcadă. Gutierele transparente Spark pornesc de la 1.600 € pentru ambele arcade. Consultația ortodontică este 100 lei, iar planul de tratament cu modele de studiu 200 lei.",
      },
      {
        question: "De la ce vârstă se poate pune aparat dentar?",
        answer:
          "Prima consultație ortodontică este recomandată în jurul vârstei de 7 ani. Aparatul fix se aplică de obicei după schimbarea dinților de lapte, însă pentru copii mai mici există aparate mobile, traineri și disjunctoare care ghidează creșterea maxilarelor.",
      },
      {
        question: "Cât de des trebuie să vin la control?",
        answer:
          "De regulă o dată la 4–8 săptămâni, în funcție de tipul aparatului. Controlul pentru o arcadă costă 110 lei, pentru două arcade 170 lei, iar pentru aparatul mobil 100 lei.",
      },
    ],
    relatedSlugs: ["albire-dentara", "implant-dentar"],
    priceCategory: "ortodontie",
  },
  {
    slug: "albire-dentara",
    h1: "Albire dentară profesională în Câmpulung Muscel",
    title: "Albire Dentară Câmpulung Muscel | 700 lei Pachet | Dentologia",
    metaDescription:
      "Albire dentară profesională în Câmpulung Muscel. Pachet detartraj + periaj + AirFlow + albire cu gutiere pentru acasă: 700 lei. Gutiere de albire 350 lei.",
    intro:
      "Albirea dentară profesională îndepărtează petele acumulate în timp de la cafea, ceai, vin sau tutun și redă dinților o nuanță mai deschisă. La Dentologia lucrăm cu gutiere personalizate, realizate după amprenta dumneavoastră.",
    sections: [
      {
        heading: "Cum decurge albirea",
        body: "Înainte de albire este obligatorie o igienizare profesională — detartraj, periaj și AirFlow — pentru ca substanța de albire să acționeze uniform pe smalț curat. Apoi luăm amprenta și realizăm gutierele personalizate, pe care le veți purta acasă, după indicațiile medicului.",
      },
      {
        heading: "Pachetul complet",
        body: "Recomandăm pachetul care include detartraj, periaj profesional, AirFlow și albire cu gutiere pentru acasă, la 700 lei. Dacă aveți deja o igienizare recentă, gutierele de albire se pot realiza separat, la 350 lei.",
      },
      {
        heading: "Cât rezistă rezultatul",
        body: "Depinde în mare măsură de obiceiuri. Cafeaua, ceaiul negru, vinul roșu și fumatul repigmentează smalțul. Cu o igienă bună și igienizări profesionale periodice, rezultatul se menține luni bune, iar gutierele pot fi reutilizate pentru ședințe de întreținere.",
      },
      {
        heading: "Este sigură albirea dentară",
        body: "Da, atunci când este făcută sub supraveghere stomatologică, cu concentrații controlate. Poate apărea o sensibilitate temporară la rece, care dispare de la sine. Albirea nu se recomandă în timpul sarcinii sau pe dinți cu carii netratate — de aceea consultația prealabilă este necesară.",
      },
    ],
    priceItemNames: [
      "Detartraj + Periaj + AirFlow + Albire cu gutiere",
      "Gutiere albire",
      "Pachet complet: Detartraj + Periaj + AirFlow",
      "Consultație de specialitate",
    ],
    offers: [
      {
        name: "Detartraj + Periaj + AirFlow + Albire cu gutiere",
        price: "700",
      },
      { name: "Gutiere albire", price: "350" },
    ],
    faq: [
      {
        question: "Cât costă albirea dentară în Câmpulung?",
        answer:
          "Pachetul complet — detartraj, periaj, AirFlow și albire cu gutiere pentru acasă — costă 700 lei la Dentologia. Gutierele de albire realizate separat costă 350 lei.",
      },
      {
        question: "Albirea dentară slăbește smalțul?",
        answer:
          "Nu, atunci când este realizată profesional, cu concentrații controlate și sub supravegherea medicului stomatolog. Poate apărea o sensibilitate temporară la rece, care trece de la sine după câteva zile.",
      },
      {
        question: "Pot albi dinții dacă am obturații sau coroane?",
        answer:
          "Substanța de albire acționează doar pe smalțul natural — obturațiile, coroanele și fațetele nu își schimbă culoarea. Dacă aveți lucrări pe dinții din față, vă recomandăm să discutați la consultație ordinea tratamentelor.",
      },
    ],
    relatedSlugs: ["detartraj-profesional", "aparat-dentar"],
    priceCategory: "profilaxie",
  },
  {
    slug: "detartraj-profesional",
    h1: "Detartraj și igienizare profesională în Câmpulung Muscel",
    title: "Detartraj Câmpulung Muscel | de la 150 lei | Dentologia",
    metaDescription:
      "Detartraj profesional în Câmpulung Muscel: 150 lei. Pachet complet detartraj + periaj + AirFlow 250 lei. Fluorizare și sigilări. Programări: 0750 486 564.",
    intro:
      "Detartrajul îndepărtează tartrul și placa bacteriană pe care periajul zilnic nu le mai poate curăța. Este cea mai simplă măsură de prevenție împotriva cariilor și a bolii parodontale, și o recomandăm o dată la șase luni.",
    sections: [
      {
        heading: "Detartraj, periaj și AirFlow",
        body: "Detartrajul cu ultrasunete desprinde tartrul de pe suprafața dintelui și de sub gingie. Periajul profesional lustruiește apoi smalțul, iar AirFlow-ul, un jet fin de bicarbonat, îndepărtează petele de pe suprafețele greu accesibile. Cele trei se completează, de aceea le oferim și ca pachet.",
      },
      {
        heading: "Cât de des este nevoie",
        body: "Pentru majoritatea pacienților, o dată la șase luni. Fumătorii, consumatorii frecvenți de cafea sau ceai și pacienții cu aparat dentar au nevoie de igienizări mai dese, pentru că tartrul se depune mai rapid.",
      },
      {
        heading: "Doare detartrajul",
        body: "În general nu. Puteți simți o sensibilitate ușoară, mai ales dacă tartrul s-a acumulat mult timp sau dacă gingia este inflamată. Cu cât veniți mai regulat, cu atât procedura este mai rapidă și mai confortabilă.",
      },
      {
        heading: "Prevenție pentru copii",
        body: "Pe lângă detartraj oferim fluorizare (150 lei pentru ambele arcade) și sigilarea șanțurilor și fosetelor (200 lei pe dinte), două proceduri simple care reduc semnificativ riscul de carie la copii.",
      },
    ],
    priceItemNames: [
      "Detartraj",
      "Pachet complet: Detartraj + Periaj + AirFlow",
      "Periaj profesional",
      "AirFlow",
      "Fluorizare",
      "Sigilare dinte temporar",
      "Sigilare dinte definitiv",
    ],
    offers: [
      { name: "Detartraj", price: "150" },
      { name: "Pachet complet: Detartraj + Periaj + AirFlow", price: "250" },
      { name: "Fluorizare", price: "150" },
    ],
    faq: [
      {
        question: "Cât costă un detartraj în Câmpulung?",
        answer:
          "Detartrajul costă 150 lei la Dentologia. Pachetul complet de igienizare — detartraj, periaj profesional și AirFlow — costă 250 lei. Periajul profesional separat este 100 lei pentru ambele arcade, iar AirFlow-ul 100 lei.",
      },
      {
        question: "Cât de des trebuie făcut detartrajul?",
        answer:
          "O dată la șase luni pentru majoritatea pacienților. Dacă fumați, consumați multă cafea sau purtați aparat dentar, tartrul se depune mai repede și igienizarea trebuie făcută mai des.",
      },
      {
        question: "Detartrajul îmi subțiază smalțul?",
        answer:
          "Nu. Detartrajul cu ultrasunete acționează asupra tartrului, nu asupra smalțului. Senzația de dinte „mai neted” sau ușor sensibil imediat după procedură este normală și dispare în câteva zile.",
      },
    ],
    relatedSlugs: ["albire-dentara", "urgente-stomatologice"],
    priceCategory: "profilaxie",
  },
  {
    slug: "urgente-stomatologice",
    h1: "Urgențe stomatologice în Câmpulung Muscel",
    title: "Urgențe Stomatologice Câmpulung Muscel | Dentologia",
    metaDescription:
      "Urgențe stomatologice în Câmpulung Muscel. Tratament de urgență 250 lei, consultație de urgență cu pansament calmant 250 lei. Sunați: 0750 486 564.",
    intro:
      "Durerea de dinți nu așteaptă. La Dentologia tratăm urgențele stomatologice în Câmpulung Muscel — durere acută, abces, dinte fracturat sau lucrare desprinsă. Sunați la 0750 486 564 și vă programăm cât putem de repede.",
    sections: [
      {
        heading: "Când este o urgență stomatologică",
        body: "Durerea puternică sau pulsatilă, umflarea gingiei sau a obrazului, un dinte fracturat în urma unui accident, sângerarea care nu se oprește după o extracție sau o coroană care s-a desprins — toate necesită o vizită rapidă la stomatolog.",
      },
      {
        heading: "Ce facem la prima vizită",
        body: "Prioritatea este să oprim durerea. Consultația de urgență include un pansament calmant. Dacă există un abces, îl incizăm și drenăm. Abia după ce durerea este sub control stabilim împreună planul de tratament definitiv.",
      },
      {
        heading: "Până ajungeți la cabinet",
        body: "Clătiți gura cu apă călduță sărată și aplicați o compresă rece pe obraz, din exterior, pentru a reduce inflamația. Nu aplicați aspirină direct pe gingie și nu încălziți zona. Dacă un dinte a fost expulzat complet în urma unui accident, păstrați-l în lapte și veniți imediat.",
      },
      {
        heading: "Program",
        body: "Suntem deschiși de luni până vineri, între 09:00 și 18:00. Sâmbăta și duminica cabinetul este închis. Pentru urgențe, sunați înainte de a veni: vom încerca să vă preluăm în aceeași zi.",
      },
    ],
    priceItemNames: [
      "Tratament de urgență",
      "Consultație de urgență + pansament calmant",
      "Incizie + drenaj abces",
      "Drenaj endodontic",
      "Extracție monoradiculară",
      "Extracție pluriradiculară",
      "Reconstrucție dinte fracturat",
    ],
    offers: [
      { name: "Tratament de urgență", price: "250" },
      { name: "Consultație de urgență + pansament calmant", price: "250" },
      { name: "Incizie + drenaj abces", price: "200" },
    ],
    faq: [
      {
        question: "Oferiți urgențe stomatologice în Câmpulung?",
        answer:
          "Da. Tratamentul de urgență costă 250 lei, iar consultația de urgență cu pansament calmant este tot 250 lei. Sunați la 0750 486 564 sau scrieți-ne pe WhatsApp și vom încerca să vă preluăm în aceeași zi.",
      },
      {
        question: "Ce fac dacă mă doare dintele noaptea sau în weekend?",
        answer:
          "Clătiți cu apă călduță sărată și aplicați o compresă rece pe obraz, din exterior. Evitați aspirina aplicată direct pe gingie. Sunați-ne la prima oră a programului: luni–vineri, de la 09:00.",
      },
      {
        question: "Mi s-a rupt un dinte. Se mai poate salva?",
        answer:
          "În multe cazuri, da. Reconstrucția unui dinte fracturat costă între 200 și 300 lei, în funcție de cât material s-a pierdut. Dacă fractura afectează nervul, poate fi nevoie și de tratament endodontic. Veniți cât mai repede — șansele de salvare scad cu timpul.",
      },
    ],
    relatedSlugs: ["implant-dentar", "detartraj-profesional"],
    priceCategory: "chirurgie",
  },
];

export function getServicePage(slug: string): ServicePage | undefined {
  return servicePages.find((page) => page.slug === slug);
}

/** Price rows for a service page, resolved from services.ts at call time. */
export function priceItemsFor(page: ServicePage): ServiceItem[] {
  return itemsByName(page.priceItemNames);
}
