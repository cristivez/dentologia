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
  "coroana-zirconiu",
  "fatete-dentare",
  "extractie-dentara",
  "tratament-canal",
  "proteza-dentara",
  "plomba-dentara",
  "dentist-copii",
] as const;

export type ServicePageSlug = (typeof SERVICE_PAGE_SLUGS)[number];

export type ServicePage = {
  slug: ServicePageSlug;
  /** Drives <h1>. Carries the city, because that is what people search for. */
  h1: string;
  title: string;
  metaDescription: string;
  /** Shown under the h1. Two or three sentences, plain Romanian. */
  intro: string;
  sections: { heading: string; body: string }[];
  /**
   * Price rows pulled from services.ts by exact name. Never retyped here.
   *
   * These drive both the rendered price table and the page's schema.org
   * offers. There used to be a parallel hand-typed `offers` array, which
   * drifted: it quoted Google a flat 300 lei for a root canal the table
   * showed as 300–500, and invented names ("Coroană zirconiu monolit") for
   * rows the catalogue calls something else. If a price needs to appear here,
   * add its row to services.ts and name it — do not restate the number.
   */
  priceItemNames: readonly string[];
  /** Rendered when the clinic publishes no fixed price for the procedure. */
  priceNote?: string;
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
    relatedSlugs: [
      "coroana-zirconiu",
      "proteza-dentara",
      "urgente-stomatologice",
    ],
    priceCategory: "protetica",
  },
  {
    slug: "aparat-dentar",
    h1: "Aparat dentar în Câmpulung Muscel",
    title: "Aparat Dentar Câmpulung | Prețuri Ortodonție | Dentologia",
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
    title: "Albire Dentară Câmpulung | Pachet 700 lei | Dentologia",
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
    relatedSlugs: ["fatete-dentare", "detartraj-profesional", "aparat-dentar"],
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
    relatedSlugs: ["dentist-copii", "albire-dentara", "urgente-stomatologice"],
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
    relatedSlugs: ["tratament-canal", "extractie-dentara", "implant-dentar"],
    priceCategory: "chirurgie",
  },
  {
    slug: "coroana-zirconiu",
    h1: "Coroană dentară din zirconiu în Câmpulung Muscel",
    title: "Coroană Zirconiu Câmpulung | de la 900 lei | Dentologia",
    metaDescription:
      "Coroană dentară din zirconiu în Câmpulung Muscel: de la 900 lei, zirconiu + ceramică 1.100 lei, metalo-ceramică 700 lei. Programări: 0750 486 564.",
    intro:
      "Coroana dentară acoperă și protejează un dinte grav deteriorat sau tratat pe canal, refăcându-i forma, rezistența și aspectul natural. La Dentologia, în Câmpulung Muscel, realizăm coroane din zirconiu monolit și stratificat, precum și din metalo-ceramică, cu prețuri afișate transparent.",
    sections: [
      {
        heading: "Când este nevoie de o coroană dentară",
        body: "Coroana se recomandă atunci când un dinte este prea distrus pentru a fi refăcut cu o obturație: după un tratament de canal, în urma unei fracturi mari sau când o carie a afectat o bună parte din dinte. Coroana îmbracă dintele complet și îi redă forma și funcția de masticație.",
      },
      {
        heading: "Zirconiu, ceramică sau metalo-ceramică",
        body: "Coroana din zirconiu monolit este foarte rezistentă și potrivită pentru zona laterală, unde presiunea de masticație este mare. Zirconiul stratificat cu ceramică oferă un aspect mai natural, ideal pentru dinții din față. Metalo-ceramica rămâne o variantă mai accesibilă. Vă recomandăm soluția potrivită la consultație, în funcție de dintele tratat.",
      },
      {
        heading: "Cât costă o coroană dentară",
        body: "La Dentologia, coroana din zirconiu monolit multistratificat pornește de la 900 lei pe element, varianta Dentsply Sirona de la 1.000 lei, iar zirconiul cu ceramică de la 1.100 lei. Coroana metalo-ceramică este 700 lei, iar cimentarea coroanei 80 lei. O coroană provizorie din PMMA, purtată între ședințe, costă 100 lei.",
      },
      {
        heading: "Cum decurge tratamentul",
        body: "Dintele este șlefuit ușor pentru a face loc coroanei, apoi luăm amprenta și montăm o coroană provizorie. În laborator se realizează coroana definitivă, pe care o probăm și o cimentăm la vizita următoare. De la pregătire până la cimentare sunt de obicei necesare două ședințe.",
      },
    ],
    priceItemNames: [
      "Element zirconiu monolit multistratificat",
      "Element zirconiu monolit multistratificat Dentsply Sirona",
      "Element zirconiu + ceramică",
      "Element zirconiu + ceramică Dentsply Sirona",
      "Element metalo-ceramică",
      "Coroană provizorie PMMA",
      "Cimentare coroană",
    ],
    faq: [
      {
        question: "Cât costă o coroană dentară în Câmpulung?",
        answer:
          "La Dentologia, coroana din zirconiu pornește de la 900 lei pe element, zirconiul cu ceramică de la 1.100 lei, iar coroana metalo-ceramică 700 lei. Cimentarea coroanei este 80 lei. Prețul final depinde de numărul de dinți și de materialul ales, pe care le stabilim la consultație.",
      },
      {
        question: "Cât rezistă o coroană din zirconiu?",
        answer:
          "Cu o igienă bună și controale periodice, o coroană din zirconiu poate rezista mulți ani. Zirconiul este unul dintre cele mai rezistente materiale folosite în stomatologie și nu se colorează în timp.",
      },
      {
        question: "Coroana de zirconiu se vede diferit de dinții naturali?",
        answer:
          "Nu. Zirconiul stratificat cu ceramică imită translucența smalțului natural, iar culoarea se alege pentru a se potrivi cu ceilalți dinți. Pentru dinții din față recomandăm varianta cu ceramică, tocmai pentru aspectul cât mai natural.",
      },
      {
        question: "Cum îngrijesc o coroană dentară?",
        answer:
          "Coroana se îngrijește ca un dinte natural: periaj de două ori pe zi, ață dentară zilnic și controale periodice. Evitați să roadeți obiecte foarte dure (gheață, capace), care pot fisura orice lucrare. Cu o igienă bună, coroana rezistă mulți ani.",
      },
    ],
    relatedSlugs: ["fatete-dentare", "implant-dentar"],
    priceCategory: "protetica",
  },
  {
    slug: "fatete-dentare",
    h1: "Fațete dentare în Câmpulung Muscel",
    title: "Fațete Dentare Câmpulung | Emax de la 1.800 lei | Dentologia",
    metaDescription:
      "Fațete dentare din ceramică Emax Ivoclar în Câmpulung Muscel: 1.800 lei/element. Corectează forma și culoarea dinților din față. Consultație 100 lei.",
    intro:
      "Fațetele dentare sunt lamele subțiri de ceramică aplicate pe fața vizibilă a dinților din față, care corectează forma, culoarea și micile neregularități, pentru un zâmbet armonios. La Dentologia, în Câmpulung Muscel, lucrăm cu fațete din ceramică Emax Ivoclar.",
    sections: [
      {
        heading: "Ce sunt fațetele dentare",
        body: "Fațeta este o lamelă fină de ceramică, lipită pe suprafața frontală a dintelui. Acoperă petele care nu răspund la albire, închide spațiile mici dintre dinți, corectează un dinte ușor rotit sau ciobit și uniformizează forma dinților din față. Este o soluție preponderent estetică.",
      },
      {
        heading: "Fațete din ceramică Emax",
        body: "Folosim ceramică Emax Ivoclar, apreciată pentru rezistență și pentru aspectul natural, translucent. Fiecare fațetă este realizată individual, pentru a se potrivi cu forma feței și cu ceilalți dinți. Rezultatul arată natural, nu artificial.",
      },
      {
        heading: "Cât costă fațetele dentare",
        body: "La Dentologia, o fațetă din Emax Ivoclar costă 1.800 lei pe element. Numărul de fațete necesare pentru un zâmbet uniform îl stabilim împreună la consultația de specialitate (100 lei), în funcție de dinții pe care doriți să îi corectați. Pentru zona laterală oferim și inlay-uri Emax, la 800 lei.",
      },
      {
        heading: "Fațete sau albire dentară",
        body: "Dacă dinții sunt sănătoși și doar închiși la culoare, albirea profesională este soluția mai simplă și mai accesibilă. Fațetele sunt indicate când doriți să schimbați și forma, să închideți spații sau să acoperiți pete care nu răspund la albire. La consultație vă spunem care variantă vi se potrivește.",
      },
    ],
    priceItemNames: [
      "Emax Ivoclar (fațete, punți, coroane)",
      "Inlay Emax Ivoclar",
      "Consultație de specialitate",
    ],
    faq: [
      {
        question: "Cât costă o fațetă dentară în Câmpulung?",
        answer:
          "La Dentologia, o fațetă din ceramică Emax Ivoclar costă 1.800 lei pe element. Numărul de fațete depinde de câți dinți doriți să corectați — îl stabilim la consultația de specialitate (100 lei).",
      },
      {
        question: "Fațetele dentare se strică sau se pătează?",
        answer:
          "Ceramica Emax nu se pigmentează așa cum se poate pigmenta smalțul natural și este rezistentă. Cu o igienă corectă și controale periodice, fațetele își păstrează aspectul mulți ani. Se recomandă evitarea roaderii obiectelor dure.",
      },
      {
        question: "Se șlefuiesc mult dinții pentru fațete?",
        answer:
          "Fațetele necesită o șlefuire minimă a smalțului de pe fața vizibilă a dintelui, mult mai puțin decât o coroană. La consultație evaluăm dinții și vă explicăm exact ce presupune cazul dumneavoastră.",
      },
      {
        question: "Fațetele dentare sunt definitive?",
        answer:
          "Aplicarea fațetelor presupune o șlefuire minimă, dar ireversibilă, a smalțului, așa că sunt o soluție de durată. În timp, o fațetă se poate uza sau desprinde și poate fi înlocuită. De aceea decizia se ia după o evaluare atentă la consultație.",
      },
    ],
    relatedSlugs: ["coroana-zirconiu", "albire-dentara"],
    priceCategory: "protetica",
  },
  {
    slug: "extractie-dentara",
    h1: "Extracție dentară și măsea de minte în Câmpulung Muscel",
    title: "Extracție Dentară Câmpulung | Măsea de Minte | Dentologia",
    metaDescription:
      "Extracție dentară în Câmpulung Muscel: monoradiculară 150–200 lei, molar de minte 400–600 lei. Sub anestezie locală. Programări: 0750 486 564.",
    intro:
      "Extracția dentară este ultima soluție, aleasă doar când dintele nu mai poate fi salvat prin tratament. La Dentologia, în Câmpulung Muscel, efectuăm extracții simple și extracții de măsea de minte, toate sub anestezie locală, cu prețuri transparente.",
    sections: [
      {
        heading: "Când se recomandă extracția",
        body: "Un dinte se extrage atunci când este distrus dincolo de posibilitatea de reconstrucție, când o infecție nu mai poate fi tratată sau în cazul măselelor de minte care creează probleme. Încercăm întotdeauna mai întâi să salvăm dintele; extracția rămâne ultima opțiune.",
      },
      {
        heading: "Extracția măselei de minte",
        body: "Măseaua de minte se extrage când erupe greșit, împinge ceilalți dinți, rămâne parțial acoperită de gingie (ceea ce favorizează infecțiile) sau nu are loc suficient pe arcadă. În funcție de poziție, extracția poate fi simplă sau mai laborioasă; evaluăm situația la consultație, uneori pe baza unei radiografii.",
      },
      {
        heading: "Cât costă o extracție dentară",
        body: "La Dentologia, extracția unui dinte monoradicular costă 150–200 lei, a unui dinte pluriradicular 250–300 lei, iar extracția molarului de minte 400–600 lei, în funcție de dificultate. Incizia și drenajul unui abces costă 200 lei, iar decapușonarea 150 lei.",
      },
      {
        heading: "După extracție",
        body: "Mușcați ferm pe compresa sterilă circa 30 de minute pentru a opri sângerarea. În primele zile evitați clătirile puternice, băuturile fierbinți, fumatul și efortul intens, pentru a proteja cheagul care ajută vindecarea. Dacă durerea sau umflătura se accentuează după câteva zile, sunați-ne.",
      },
    ],
    priceItemNames: [
      "Extracție monoradiculară",
      "Extracție pluriradiculară",
      "Extracție molar de minte",
      "Incizie + drenaj abces",
      "Decapușonare",
      "Consultație de specialitate",
    ],
    faq: [
      {
        question: "Cât costă o extracție dentară în Câmpulung?",
        answer:
          "La Dentologia, extracția unui dinte cu o rădăcină costă 150–200 lei, a unuia cu mai multe rădăcini 250–300 lei, iar extracția măselei de minte 400–600 lei, în funcție de dificultatea cazului. Consultația de specialitate este 100 lei.",
      },
      {
        question: "Doare extracția dentară?",
        answer:
          "Extracția se face sub anestezie locală, așa că nu veți simți durere în timpul procedurii, ci cel mult o senzație de presiune. După ce trece anestezia poate apărea un disconfort câteva zile, care se controlează cu medicația recomandată.",
      },
      {
        question: "Cât durează vindecarea după o extracție?",
        answer:
          "Gingia se închide în general în una–două săptămâni, iar osul se remodelează în lunile următoare. Respectarea recomandărilor din primele zile grăbește vindecarea. Dacă intenționați un implant, discutăm momentul potrivit încă de la extracție.",
      },
      {
        question: "Cât durează durerea după o extracție?",
        answer:
          "Disconfortul este de obicei cel mai pronunțat în primele 24–48 de ore și scade treptat în câteva zile, controlat cu medicația recomandată. Dacă durerea se accentuează după 2–3 zile în loc să scadă, sunați-ne — poate fi un semn care necesită o reevaluare.",
      },
    ],
    relatedSlugs: ["urgente-stomatologice", "implant-dentar"],
    priceCategory: "chirurgie",
  },
  {
    slug: "tratament-canal",
    h1: "Tratament de canal (endodonție) în Câmpulung Muscel",
    title: "Tratament de Canal Câmpulung | de la 250 lei | Dentologia",
    metaDescription:
      "Tratament de canal în Câmpulung Muscel cu instrumentar rotativ: de la 250 lei, pluriradicular 300–500 lei. Salvează dintele. Programări: 0750 486 564.",
    intro:
      "Tratamentul de canal (endodontic) salvează un dinte al cărui nerv este inflamat sau infectat, oprind durerea și evitând extracția. La Dentologia, în Câmpulung Muscel, lucrăm cu instrumentar rotativ, care scurtează durata ședinței și crește precizia tratamentului.",
    sections: [
      {
        heading: "Când ai nevoie de tratament de canal",
        body: "Tratamentul de canal devine necesar când nervul dintelui (pulpa) se inflamează sau se infectează — de obicei din cauza unei carii profunde, a unei fracturi sau a unei lucrări vechi. Semnele tipice sunt durerea spontană sau la cald, sensibilitatea prelungită și, uneori, un abces. Fără tratament, dintele ajunge de cele mai multe ori la extracție.",
      },
      {
        heading: "Cum decurge tratamentul endodontic",
        body: "Sub anestezie locală, curățăm canalele radiculare de țesutul infectat cu ajutorul instrumentarului rotativ, le dezinfectăm și le sigilăm. În funcție de caz, tratamentul se poate finaliza într-una sau mai multe ședințe. Un dinte tratat pe canal are adesea nevoie ulterior de o coroană pentru protecție.",
      },
      {
        heading: "Cât costă un tratament de canal",
        body: "La Dentologia, tratamentul endodontic rotativ pornește de la 250 lei pentru un dinte cu o singură rădăcină și 300–500 lei pentru un dinte cu mai multe rădăcini. Retratamentul unui tratament de canal vechi costă 300 lei pentru dinții monoradiculari și 400–600 lei pentru cei pluriradiculari. Drenajul endodontic, pentru a calma o urgență, este 100 lei.",
      },
      {
        heading: "Ce urmează după tratamentul de canal",
        body: "Un dinte tratat pe canal își pierde o parte din rezistență, așa că recomandăm frecvent o reconstrucție și o coroană, mai ales pentru molari. Astfel dintele rezistă la masticație pe termen lung. Vă explicăm la finalul tratamentului dacă este nevoie și de această etapă.",
      },
    ],
    priceItemNames: [
      "Tratament endodontic rotativ — dinte monoradicular",
      "Tratament endodontic rotativ — dinte pluriradicular",
      "Retratament — dinte monoradicular",
      "Retratament — dinte pluriradicular",
      "Consultație de urgență + pansament calmant",
      "Drenaj endodontic",
    ],
    faq: [
      {
        question: "Cât costă un tratament de canal în Câmpulung?",
        answer:
          "La Dentologia, tratamentul de canal cu instrumentar rotativ pornește de la 250 lei pentru un dinte cu o rădăcină și 300–500 lei pentru un dinte cu mai multe rădăcini. Retratamentul unui canal vechi costă între 300 și 600 lei, în funcție de numărul de canale.",
      },
      {
        question: "Doare tratamentul de canal?",
        answer:
          "Nu. Tratamentul se face sub anestezie locală, iar rolul lui este tocmai să elimine durerea provocată de nervul inflamat. După ședință poate apărea o sensibilitate ușoară câteva zile, care se calmează cu medicația recomandată.",
      },
      {
        question: "Cât rezistă un dinte după tratamentul de canal?",
        answer:
          "Un dinte tratat corect endodontic și protejat cu o reconstrucție sau o coroană poate funcționa mulți ani, la fel ca ceilalți dinți. Pentru molari recomandăm o coroană, pentru că dintele devine mai fragil după tratament.",
      },
      {
        question: "Pot mânca după tratamentul de canal?",
        answer:
          "Așteptați să treacă anestezia înainte de a mânca, ca să nu vă mușcați obrazul sau limba. Până la montarea restaurării finale, evitați să mestecați alimente dure pe dintele tratat, care este mai fragil. După restaurarea definitivă, puteți folosi dintele normal.",
      },
    ],
    relatedSlugs: ["urgente-stomatologice", "coroana-zirconiu"],
    priceCategory: "endodontie",
  },
  {
    slug: "proteza-dentara",
    h1: "Proteză dentară în Câmpulung Muscel",
    title: "Proteză Dentară Câmpulung | de la 1.500 lei | Dentologia",
    metaDescription:
      "Proteză dentară în Câmpulung Muscel: proteză totală de la 2.000 lei, parțială de la 1.500 lei, variante flexibile 2.200 lei. Programări: 0750 486 564.",
    intro:
      "Proteza dentară înlocuiește mai mulți dinți lipsă sau întreaga arcadă, redând masticația, vorbirea și aspectul zâmbetului. La Dentologia, în Câmpulung Muscel, realizăm proteze totale și parțiale, atât acrilice, cât și flexibile, cu prețuri afișate transparent.",
    sections: [
      {
        heading: "Tipuri de proteză dentară",
        body: "Proteza totală înlocuiește toți dinții unei arcade, atunci când nu mai există dinți naturali. Proteza parțială se sprijină pe dinții rămași și completează spațiile edentate. Fiecare poate fi realizată din acrilat (varianta clasică) sau din material flexibil, mai comod și mai discret, fără cârlige metalice vizibile.",
      },
      {
        heading: "Proteză acrilică sau flexibilă",
        body: "Proteza acrilică este soluția mai accesibilă și ușor de reparat sau rebazat. Proteza flexibilă este mai subțire, mai confortabilă și se fixează fără cârlige metalice, fiind mai estetică. La consultație vă recomandăm varianta potrivită, în funcție de numărul de dinți lipsă și de bugetul dumneavoastră.",
      },
      {
        heading: "Cât costă o proteză dentară",
        body: "La Dentologia, proteza totală acrilică costă 2.000 lei, iar cea flexibilă 2.200 lei. Proteza parțială acrilică este 1.500 lei, iar varianta flexibilă 2.200 lei. Rebazarea unei proteze existente (readaptarea la gingie) costă 250 lei.",
      },
      {
        heading: "Proteză sau implant",
        body: "Proteza este soluția cea mai accesibilă pentru mai mulți dinți lipsă, dar se sprijină pe gingie și necesită întreținere. Implanturile oferă o fixare stabilă și un confort apropiat de dinții naturali, la un cost mai mare. Uneori cele două se combină — o proteză stabilizată pe implanturi. Vă explicăm opțiunile la consultație.",
      },
    ],
    priceItemNames: [
      "Proteză totală acrilică",
      "Proteză totală flexibilă",
      "Proteză parțială acrilică",
      "Proteză parțială flexibilă",
      "Rebazare proteză",
    ],
    faq: [
      {
        question: "Cât costă o proteză dentară în Câmpulung?",
        answer:
          "La Dentologia, proteza totală acrilică costă 2.000 lei, iar cea flexibilă 2.200 lei. Proteza parțială pornește de la 1.500 lei (acrilică). Prețul final depinde de tipul protezei și de numărul de dinți de înlocuit, pe care le stabilim la consultație.",
      },
      {
        question: "Cât rezistă o proteză dentară?",
        answer:
          "Cu o întreținere corectă, o proteză poate fi purtată mai mulți ani. În timp, osul și gingia se modifică, așa că proteza poate necesita o rebazare (readaptare) pentru a rămâne stabilă și confortabilă.",
      },
      {
        question: "Cât timp mă obișnuiesc cu proteza?",
        answer:
          "Primele zile sunt de acomodare, mai ales la vorbire și masticație. Recomandăm alimente moi la început și controale de ajustare dacă apar puncte de presiune. Disconfortul inițial scade pe măsură ce vă obișnuiți.",
      },
      {
        question: "Cum întrețin proteza dentară?",
        answer:
          "Scoateți și curățați proteza zilnic, cu o perie moale și un produs dedicat, nu cu pastă de dinți abrazivă. Peste noapte păstrați-o într-un pahar cu apă, ca să nu se usuce. Curățați și gingiile și dinții rămași, iar la controalele periodice reajustăm proteza dacă este nevoie.",
      },
    ],
    relatedSlugs: ["implant-dentar", "coroana-zirconiu"],
    priceCategory: "protetica",
  },
  {
    slug: "plomba-dentara",
    h1: "Plombă dentară (obturație) în Câmpulung Muscel",
    title: "Plombă Dentară Câmpulung | de la 150 lei | Dentologia",
    metaDescription:
      "Plombă dentară (obturație fizionomică) în Câmpulung Muscel: de la 150 lei, obturație dinte frontal 350 lei. Tratarea cariilor. Programări: 0750 486 564.",
    intro:
      "Plomba dentară (obturația) tratează caria și reface forma și funcția dintelui afectat. La Dentologia, în Câmpulung Muscel, folosim obturații fizionomice din material compozit de culoarea dintelui, astfel încât plomba să fie cât mai discretă.",
    sections: [
      {
        heading: "Ce este o obturație fizionomică",
        body: "Obturația fizionomică este plomba modernă, din compozit de culoarea smalțului, care înlocuiește vechile plombe metalice. După îndepărtarea cariei, cavitatea este curățată și umplută cu compozit, apoi modelată și lustruită, refăcând forma naturală a dintelui.",
      },
      {
        heading: "Când ai nevoie de o plombă",
        body: "O plombă este necesară când o carie a afectat structura dintelui. Semnele pot fi o sensibilitate la dulce, cald sau rece, o pată închisă pe dinte sau o cavitate vizibilă. Tratată din timp, caria se rezolvă printr-o simplă obturație; ignorată, poate ajunge la nerv și la nevoia unui tratament de canal.",
      },
      {
        heading: "Cât costă o plombă dentară",
        body: "La Dentologia, obturația fizionomică pornește de la 200 lei (cavitate mică), 250 lei (medie) și 300 lei (mare). Obturația pe un dinte frontal este 350 lei, iar obturația cu ciment (CIS) 150 lei. Reconstrucția unui dinte fracturat costă 200–300 lei, în funcție de cât material s-a pierdut.",
      },
      {
        heading: "Cum previi cariile",
        body: "Cel mai bun tratament pentru carie este prevenția: periaj corect de două ori pe zi, folosirea aței dentare și igienizări profesionale periodice. Pentru copii, sigilarea șanțurilor și fluorizarea reduc mult riscul de carie. O carie depistată devreme, la un control de rutină, se rezolvă rapid și ieftin.",
      },
    ],
    priceItemNames: [
      "Obturație fizionomică mică",
      "Obturație fizionomică medie",
      "Obturație fizionomică mare",
      "Obturație dinte frontal",
      "Obturație CIS",
      "Reconstrucție dinte fracturat",
    ],
    faq: [
      {
        question: "Cât costă o plombă dentară în Câmpulung?",
        answer:
          "La Dentologia, o obturație fizionomică (plombă) pornește de la 200 lei pentru o cavitate mică, 250 lei medie și 300 lei mare. Plomba pe un dinte din față costă 350 lei. Prețul depinde de mărimea cariei și de poziția dintelui.",
      },
      {
        question: "Doare punerea unei plombe?",
        answer:
          "De regulă tratamentul unei carii se face sub anestezie locală, așa că nu veți simți durere. Pentru cariile mici, superficiale, uneori nu este nevoie de anestezie. O sensibilitate ușoară câteva zile după tratament este normală.",
      },
      {
        question: "Cât rezistă o plombă?",
        answer:
          "O obturație fizionomică bine făcută rezistă mulți ani, dacă îngrijiți dinții corect. În timp, orice plombă se poate uza sau se poate infiltra o carie pe margine, de aceea controalele periodice ajută la depistarea din timp a problemelor.",
      },
      {
        question: "Trebuie să înlocuiesc plombele vechi din amalgam?",
        answer:
          "Nu neapărat. O plombă de amalgam funcțională, fără carie pe margine sau fisuri, poate rămâne pe loc. Înlocuirea cu o obturație fizionomică se face de obicei din motive estetice sau atunci când plomba veche s-a deteriorat. Evaluăm situația la un control.",
      },
    ],
    relatedSlugs: ["tratament-canal", "detartraj-profesional"],
    priceCategory: "odontoterapie",
  },
  {
    slug: "dentist-copii",
    h1: "Dentist pentru copii în Câmpulung Muscel",
    title: "Dentist pentru Copii Câmpulung | Dentologia",
    metaDescription:
      "Dentist pentru copii în Câmpulung Muscel: consultație, sigilări 200 lei, fluorizare 150 lei, tratament blând și prietenos. Programări: 0750 486 564.",
    intro:
      "Prima experiență la dentist contează pentru o viață întreagă. La Dentologia, în Câmpulung Muscel, ne ocupăm de sănătatea dinților celor mici cu răbdare și blândețe — de la primul control și prevenție (sigilări, fluorizare) până la tratarea cariilor la dinții de lapte.",
    sections: [
      {
        heading: "Prima vizită la dentist",
        body: "Recomandăm prima vizită în jurul vârstei de 1 an sau la apariția primilor dinți, apoi controale regulate. Prima întâlnire este, de obicei, una de acomodare: copilul cunoaște cabinetul, iar noi verificăm dinții fără grabă. Scopul este ca micuțul să asocieze dentistul cu o experiență pozitivă, nu cu frica.",
      },
      {
        heading: "Prevenție: sigilări și fluorizare",
        body: "Cele mai bune tratamente la copii sunt cele care previn caria. Sigilarea acoperă șanțurile adânci ale măselelor cu un strat protector (200 lei pe dinte), iar fluorizarea întărește smalțul (150 lei pentru ambele arcade). Ambele sunt rapide, nedureroase și reduc semnificativ riscul de carie.",
      },
      {
        heading: "Tratarea cariilor la dinții de lapte",
        body: "Dinții de lapte sunt importanți: țin locul dinților permanenți și ajută la vorbire și masticație. O carie netratată la un dinte de lapte poate afecta dintele permanent de dedesubt. De aceea îi tratăm din timp, cu tehnici blânde, adaptate celor mici.",
      },
      {
        heading: "Ortodonție la momentul potrivit",
        body: "Prima consultație ortodontică este recomandată în jurul vârstei de 7 ani, când se pot depista din timp problemele de creștere a maxilarelor. Pentru cei mici oferim aparate mobile, traineri și disjunctoare, care ghidează dezvoltarea înainte ca problema să se agraveze.",
      },
    ],
    priceItemNames: [
      "Consultație de specialitate",
      "Sigilare dinte temporar",
      "Sigilare dinte definitiv",
      "Fluorizare",
      "Detartraj",
    ],
    faq: [
      {
        question: "De la ce vârstă duc copilul la dentist?",
        answer:
          "Ideal, în jurul vârstei de 1 an sau la apariția primilor dinți de lapte, apoi la controale regulate. Vizitele timpurii ajută copilul să se obișnuiască cu cabinetul și ne permit să prevenim problemele din timp.",
      },
      {
        question: "Cât costă sigilarea și fluorizarea?",
        answer:
          "La Dentologia, sigilarea unui dinte costă 200 lei, iar fluorizarea 150 lei pentru ambele arcade. Sunt proceduri rapide și nedureroase, care reduc mult riscul de carie la copii. Consultația de specialitate este 100 lei.",
      },
      {
        question: "Cum îmi pregătesc copilul pentru vizită?",
        answer:
          "Vorbiți despre vizită într-un mod pozitiv, fără cuvinte care sperie. Programați vizita când copilul este odihnit. Prima întâlnire este una de acomodare, fără tratamente invazive, tocmai pentru a construi încredere.",
      },
      {
        question: "Cum spăl corect dinții copilului?",
        answer:
          "Curățați dinții copilului de la apariția primului dinte, cu o periuță moale și o cantitate mică de pastă cu fluor — cât un bob de orez la bebeluși și cât un bob de mazăre după vârsta de 3 ani. Până în jurul vârstei de 6–7 ani, copilul are nevoie de ajutorul unui adult la periaj.",
      },
    ],
    relatedSlugs: ["detartraj-profesional", "aparat-dentar"],
    priceCategory: "profilaxie",
  },
];

export function getServicePage(slug: string): ServicePage | undefined {
  return servicePages.find((page) => page.slug === slug);
}

/** Price rows for a service page, resolved from services.ts at call time. */
export function priceItemsFor(page: ServicePage): ServiceItem[] {
  return itemsByName(page.priceItemNames);
}
