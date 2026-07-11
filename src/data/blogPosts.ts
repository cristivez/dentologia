import type { ServicePageSlug } from "./servicePages";

export const BLOG_POST_SLUGS = [
  "periajul-corect",
  "detartrajul-cand-si-de-ce",
  "preventia-dentara",
  "aparatul-dentar-ghid",
  "mituri-sanatate-dentara",
  "sensibilitatea-dentara",
] as const;

export type BlogPostSlug = (typeof BLOG_POST_SLUGS)[number];

export type BlogPost = {
  slug: BlogPostSlug;
  title: string;
  metaDescription: string;
  h1: string;
  /** Card teaser on the blog index. One or two sentences. */
  excerpt: string;
  /** Hero image, 1200×627. Licensed from Pexels (free commercial use). */
  image: string;
  /** JPG copy of the hero for og:image — WhatsApp renders WebP unreliably. */
  ogImage: string;
  imageAlt: string;
  datePublished: string;
  sections: { heading: string; body: string }[];
  /** Service pages this article funnels readers toward. */
  relatedServiceSlugs: readonly ServicePageSlug[];
};

/**
 * Evergreen patient-education articles. Every medical claim is generic,
 * textbook dentistry — no clinic-specific promises, no invented numbers.
 * Prices are never stated here; articles link to the service pages instead,
 * so services.ts stays the single source of truth for figures.
 */
export const blogPosts: BlogPost[] = [
  {
    slug: "periajul-corect",
    title: "Cum te speli corect pe dinți: ghid complet | Dentologia",
    metaDescription:
      "Tehnica corectă de periaj, cât durează, ce periuță și pastă alegi, plus greșelile frecvente care îți afectează smalțul. Ghid simplu de la Dentologia.",
    h1: "Cum te speli corect pe dinți: ghidul complet",
    excerpt:
      "De două ori pe zi nu este suficient dacă tehnica e greșită. Cum ții periuța, cât perii și ce greșeli îți erodează smalțul fără să știi.",
    image: "/photos/blog/periaj.webp",
    ogImage: "/photos/blog/periaj-og.jpg",
    imageAlt: "Femeie care se spală pe dinți în fața oglinzii din baie",
    datePublished: "2026-07-11",
    sections: [
      {
        heading: "De două ori pe zi, câte două minute",
        body: "Regula de bază este simplă: periaj dimineața și seara, câte două minute. Seara este cel mai important — peste noapte saliva scade, iar bacteriile rămase au ore întregi în care acționează nestingherite. Două minute par puține, dar cronometrate sunt mai mult decât periajul grăbit al majorității oamenilor, care durează în realitate 30–45 de secunde.",
      },
      {
        heading: "Tehnica: unghi de 45° și mișcări scurte",
        body: "Așezați periuța la un unghi de aproximativ 45° față de gingie, astfel încât perii să curețe și șanțul dintre dinte și gingie. Faceți mișcări scurte, blânde, dinspre gingie spre dinte — nu frecați orizontal cu putere. Curățați metodic: fețele exterioare, cele interioare, apoi suprafețele de masticație. La final, periați ușor și limba — pe ea se acumulează multe bacterii.",
      },
      {
        heading: "Ața dentară nu este opțională",
        body: "Periuța nu ajunge între dinți, iar exact acolo apar multe carii. Ața dentară sau periuțele interdentare, folosite o dată pe zi, curăță aceste suprafețe. Dacă gingia sângerează la primele utilizări, nu renunțați: sângerarea este de obicei semn de inflamație existentă și scade pe măsură ce igiena se îmbunătățește. Dacă persistă, discutați cu medicul stomatolog.",
      },
      {
        heading: "Ce periuță și ce pastă alegi",
        body: "Pentru majoritatea oamenilor, o periuță cu peri moi este alegerea corectă — perii duri, combinați cu presiune mare, uzează smalțul și retrag gingia. Pasta de dinți trebuie să conțină fluor, ingredientul cu cea mai solidă dovadă științifică în prevenirea cariilor. Periuța electrică poate ajuta, mai ales dacă aveți tendința să grăbiți periajul, dar și cea manuală folosită corect este suficientă.",
      },
      {
        heading: "Greșelile frecvente",
        body: "Nu periați imediat după alimente sau băuturi acide (citrice, sucuri, vin) — smalțul este temporar înmuiat și se uzează; așteptați circa 30 de minute. Nu apăsați tare: curăță mișcarea, nu forța. Schimbați periuța la aproximativ trei luni sau când perii se deformează. Și nu uitați că periajul, oricât de corect, nu îndepărtează tartrul deja format — pentru el este nevoie de detartraj profesional.",
      },
    ],
    relatedServiceSlugs: ["detartraj-profesional", "dentist-copii"],
  },
  {
    slug: "detartrajul-cand-si-de-ce",
    title: "Detartrajul: când și de ce este necesar | Dentologia",
    metaDescription:
      "Ce este tartrul, de ce nu poate fi îndepărtat acasă, la ce interval se face detartrajul și cum decurge o ședință de igienizare profesională.",
    h1: "Detartrajul: când și de ce este necesar",
    excerpt:
      "Tartrul nu se îndepărtează cu periuța, oricât de bine te speli. Ce este, ce probleme provoacă și la ce interval e recomandată igienizarea profesională.",
    image: "/photos/blog/detartraj.webp",
    ogImage: "/photos/blog/detartraj-og.jpg",
    imageAlt:
      "Medic stomatolog efectuând o procedură de igienizare unui pacient",
    datePublished: "2026-07-11",
    sections: [
      {
        heading: "Ce este tartrul și de ce apare",
        body: "Placa bacteriană este pelicula moale care se formează zilnic pe dinți. Dacă nu este îndepărtată complet prin periaj, se mineralizează cu sărurile din salivă și devine tartru — un depozit dur, aderent, pe care periuța nu îl mai poate desprinde. Tartrul apare mai repede la fumători, la consumatorii frecvenți de cafea și ceai și la persoanele cu aparat dentar, unde igiena este mai dificilă.",
      },
      {
        heading: "De ce este o problemă",
        body: "Suprafața rugoasă a tartrului este un adăpost ideal pentru bacterii, chiar la marginea gingiei. Consecințele apar treptat: gingie inflamată care sângerează la periaj (gingivită), respirație neplăcută, iar în timp retragerea gingiei și afectarea osului care susține dintele (parodontoză). Boala parodontală avansată este una dintre principalele cauze de pierdere a dinților la adulți — iar începutul ei este, de multe ori, banalul tartru neîndepărtat.",
      },
      {
        heading: "La ce interval se face detartrajul",
        body: "Pentru majoritatea pacienților, o dată la șase luni este un ritm bun. Dacă fumați, beți multă cafea, purtați aparat dentar sau aveți tendință de acumulare rapidă a tartrului, medicul poate recomanda igienizări mai dese, la trei–patru luni. Intervalul potrivit este individual — se stabilește la control, în funcție de viteza cu care se depune tartrul în cazul dumneavoastră.",
      },
      {
        heading: "Cum decurge o ședință",
        body: "Detartrajul se face cu ultrasunete: vârful aparatului vibrează și desprinde tartrul de pe dinte și de sub marginea gingiei, fără să taie și fără să afecteze smalțul. Urmează periajul profesional, care lustruiește suprafețele, și, ideal, AirFlow — un jet fin de pulbere care îndepărtează petele din zonele greu accesibile. O ședință completă durează de regulă 30–45 de minute și nu necesită anestezie.",
      },
      {
        heading: "După detartraj",
        body: "O sensibilitate ușoară la rece, câteva zile, este normală — mai ales acolo unde tartrul acoperea de mult timp suprafața dintelui. Senzația de dinți „mai netezi” sau de spații ușor mai vizibile între dinți nu înseamnă că detartrajul a subțiat smalțul: pur și simplu depozitele care ocupau acele spații au dispărut. Din acest motiv, detartrajul regulat este mult mai confortabil decât cel amânat ani de zile.",
      },
    ],
    relatedServiceSlugs: ["detartraj-profesional", "albire-dentara"],
  },
  {
    slug: "preventia-dentara",
    title: "Prevenția dentară: cel mai ieftin tratament | Dentologia",
    metaDescription:
      "De ce controlul periodic și igienizarea costă de zece ori mai puțin decât tratamentul amânat. Sigilări, fluorizare și semnele care nu trebuie ignorate.",
    h1: "Prevenția: cel mai ieftin tratament stomatologic",
    excerpt:
      "O carie prinsă la timp înseamnă o obturație simplă. Aceeași carie, ignorată doi ani, înseamnă tratament de canal și coroană. Matematica prevenției e simplă.",
    image: "/photos/blog/preventie.webp",
    ogImage: "/photos/blog/preventie-og.jpg",
    imageAlt: "Pacient la un control stomatologic de rutină",
    datePublished: "2026-07-11",
    sections: [
      {
        heading: "Matematica simplă a prevenției",
        body: "O carie superficială, depistată la un control de rutină, se rezolvă într-o singură ședință, cu o obturație simplă. Aceeași carie, lăsată să avanseze, ajunge la nerv: atunci vorbim despre tratament de canal, reconstrucție și, de multe ori, o coroană — de câteva ori mai mult timp, disconfort și cost. Aproape orice problemă dentară este mai ieftin de prevenit sau de tratat devreme decât târziu.",
      },
      {
        heading: "Controlul periodic: de două ori pe an",
        body: "Multe probleme dentare nu dor în fazele incipiente. Caria mică, gingivita, uzura smalțului — toate evoluează tăcut, iar durerea apare abia când afecțiunea este avansată. Controlul la șase luni permite medicului să le depisteze când sunt încă simple de rezolvat. Este cea mai bună investiție de câteva zeci de minute pe care o puteți face pentru sănătatea dinților.",
      },
      {
        heading: "Igienizarea profesională",
        body: "Controlul merge mână în mână cu igienizarea: detartraj, periaj profesional și AirFlow, de regulă la același interval de șase luni. Igienizarea îndepărtează tartrul și placa bacteriană pe care igiena de acasă nu le poate elimina, prevenind gingivita și boala parodontală — principala cauză de pierdere a dinților la adulți.",
      },
      {
        heading: "Pentru copii: sigilări și fluorizare",
        body: "La copii, prevenția are două instrumente extrem de eficiente. Sigilarea acoperă șanțurile adânci ale măselelor — locul preferat al cariilor — cu un strat protector, într-o procedură rapidă și complet nedureroasă. Fluorizarea întărește smalțul dinților în creștere. Împreună cu periajul corect supravegheat de părinți, aceste două proceduri reduc dramatic riscul de carii în copilărie.",
      },
      {
        heading: "Semne care nu trebuie să aștepte controlul",
        body: "Între controale, mergeți la medic fără să amânați dacă observați: sângerare constantă a gingiilor, sensibilitate care persistă peste două săptămâni, o pată închisă sau o cavitate pe dinte, durere la masticație sau respirație neplăcută persistentă. Toate sunt semnale timpurii — iar la stadiul de semnal, rezolvarea este aproape întotdeauna simplă.",
      },
    ],
    relatedServiceSlugs: [
      "detartraj-profesional",
      "dentist-copii",
      "plomba-dentara",
    ],
  },
  {
    slug: "aparatul-dentar-ghid",
    title: "Aparatul dentar: ghid pentru începători | Dentologia",
    metaDescription:
      "Când e nevoie de aparat dentar, la ce vârstă, ce tipuri există și cum arată tratamentul de la prima consultație până la contenție. Ghid pe înțelesul tuturor.",
    h1: "Aparatul dentar: ghid pentru începători",
    excerpt:
      "Cine are nevoie de aparat, la ce vârstă se pune, ce opțiuni există și ce se întâmplă de fapt în cele 12–24 de luni de tratament ortodontic.",
    image: "/photos/blog/ortodontie.webp",
    ogImage: "/photos/blog/ortodontie-og.jpg",
    imageAlt: "Tânără zâmbind cu aparat dentar fix",
    datePublished: "2026-07-11",
    sections: [
      {
        heading: "Când este nevoie de aparat dentar",
        body: "Aparatul dentar corectează dinții înghesuiți sau rotați, spațiile prea mari dintre dinți și mușcătura incorectă — situația în care dinții de sus și de jos nu se întâlnesc cum trebuie. Dincolo de estetică, alinierea corectă contează funcțional: dinții drepți se curăță mai ușor, se uzează uniform și distribuie corect forțele de masticație, protejând articulația maxilarului.",
      },
      {
        heading: "La ce vârstă se pune aparatul",
        body: "Primul consult ortodontic este recomandat în jurul vârstei de 7 ani — nu pentru că atunci se pune aparat fix, ci pentru că problemele de creștere a maxilarelor se pot depista și ghida din timp, cu aparate simple. Aparatul fix se aplică de obicei după schimbarea dinților de lapte. Iar pentru adulți, vestea bună: dinții se pot alinia la orice vârstă — tratamentul ortodontic la 30, 40 sau 50 de ani este astăzi ceva obișnuit.",
      },
      {
        heading: "Ce tipuri de aparat există",
        body: "Aparatul metalic clasic rămâne varianta cea mai accesibilă și foarte eficientă. Aparatele autoligaturante reduc frecarea și pot rări vizitele de control. Gutierele transparente — purtate aproape invizibil și detașabile la masă și periaj — sunt alternativa preferată de mulți adulți. Care variantă vi se potrivește depinde de complexitatea cazului, de buget și de stilul de viață; se stabilește la consultația ortodontică.",
      },
      {
        heading: "Cum decurge tratamentul",
        body: "După consultație și planul de tratament (cu radiografii și modele de studiu), aparatul se montează într-o ședință obișnuită, nedureroasă. Urmează controale periodice, de regulă la 4–8 săptămâni, în care aparatul se ajustează. O presiune sau o jenă de câteva zile după fiecare ajustare este normală. Durata totală este în general între 12 și 24 de luni, în funcție de caz.",
      },
      {
        heading: "Igiena și alimentația cu aparat fix",
        body: "Aparatul fix cere o igienă mai atentă: periaj după fiecare masă, periuțe interdentare pentru zonele din jurul bracketurilor și igienizări profesionale mai dese. La alimente, regula de aur este să evitați ce e foarte dur (nuci întregi, coajă de pâine tare, gheață) și foarte lipicios (caramele, gumă) — acestea pot desprinde bracketurile și prelungesc tratamentul.",
      },
      {
        heading: "Contenția: partea pe care mulți o ignoră",
        body: "După îndepărtarea aparatului, dinții au tendința naturală de a migra înapoi spre poziția inițială. Contenția — un retainer fix discret pe spatele dinților sau o gutieră purtată noaptea — menține rezultatul obținut. Este parte din tratament, nu o opțiune: fără contenție, luni întregi de tratament ortodontic se pot pierde treptat.",
      },
    ],
    relatedServiceSlugs: ["aparat-dentar", "dentist-copii"],
  },
  {
    slug: "mituri-sanatate-dentara",
    title: "6 mituri despre sănătatea dentară | Dentologia",
    metaDescription:
      "Dacă nu doare, e sănătos? Dinții de lapte nu contează? Detartrajul slăbește smalțul? Şase mituri dentare frecvente, demontate pe scurt.",
    h1: "6 mituri despre sănătatea dentară",
    excerpt:
      "„Dacă nu doare, nu am nimic”, „dinții de lapte oricum se schimbă”, „detartrajul subțiază smalțul” — mituri auzite des în cabinet, demontate unul câte unul.",
    image: "/photos/blog/mituri.webp",
    ogImage: "/photos/blog/mituri-og.jpg",
    imageAlt: "Zâmbet apropiat cu dinți sănătoși",
    datePublished: "2026-07-11",
    sections: [
      {
        heading: "Mitul 1: „Dacă nu mă doare, dinții sunt sănătoși”",
        body: "Durerea este un semnal târziu, nu unul timpuriu. Caria nu doare cât timp afectează doar smalțul — devine dureroasă abia când se apropie de nerv, adică exact atunci când tratamentul devine complicat. Gingivita și boala parodontală evoluează, la rândul lor, aproape fără durere ani de zile. De aceea controalele periodice găsesc problemele înaintea durerii.",
      },
      {
        heading: "Mitul 2: „Dinții de lapte oricum se schimbă”",
        body: "Dinții de lapte țin locul celor permanenți, ghidează erupția lor corectă și susțin dezvoltarea vorbirii și a masticației. O carie netratată la un dinte de lapte poate afecta mugurele dintelui permanent de dedesubt, iar pierderea prematură a unui dinte de lapte lasă loc înghesuirilor de mai târziu. Da, se schimbă — dar până atunci merită tratați ca dinții „adevărați”.",
      },
      {
        heading: "Mitul 3: „Detartrajul slăbește smalțul”",
        body: "Detartrajul cu ultrasunete desprinde tartrul, nu stratul de smalț. Senzația de dinți „subțiați” sau spațiile mai vizibile după procedură apar pentru că depozitele de tartru — care ocupau acele locuri — au dispărut. Adevăratul pericol pentru dinte este tartrul lăsat pe loc, care întreține inflamația gingiei și duce, în timp, la parodontoză.",
      },
      {
        heading: "Mitul 4: „Albirea distruge dinții”",
        body: "Albirea profesională, făcută sub controlul medicului stomatolog, cu substanțe dozate corect și pe dinți sănătoși, nu distruge smalțul. Poate apărea o sensibilitate temporară, care trece de la sine. Problemele apar la produsele agresive folosite pe cont propriu, fără un consult prealabil — de aceea albirea se face după o evaluare, nu înaintea ei.",
      },
      {
        heading: "Mitul 5: „Mai bine scot dintele decât să-l tratez pe canal”",
        body: "Extracția pare soluția rapidă, dar dintele lipsă lasă în urmă probleme noi: dinții vecini migrează, osul se resoarbe, masticația se dezechilibrează, iar înlocuirea (implant sau punte) costă în final mai mult decât tratamentul de canal care ar fi salvat dintele. Regula în stomatologia modernă este simplă: dintele natural care poate fi salvat merită salvat.",
      },
      {
        heading: "Mitul 6: „Cu cât perii mai tare, cu atât mai curat”",
        body: "Curățenia vine din tehnică și regularitate, nu din forță. Periajul agresiv, mai ales cu o periuță dură, uzează smalțul la coletul dintelui și retrage gingia — daune ireversibile care aduc sensibilitate. Periuță moale, presiune blândă, două minute, de două ori pe zi: atât cer dinții, dar zi de zi.",
      },
    ],
    relatedServiceSlugs: [
      "tratament-canal",
      "albire-dentara",
      "detartraj-profesional",
    ],
  },
  {
    slug: "sensibilitatea-dentara",
    title: "Sensibilitatea dentară: cauze și soluții | Dentologia",
    metaDescription:
      "De ce apare durerea scurtă la rece, cald sau dulce, ce poți face acasă împotriva sensibilității dentare și când e cazul să mergi la medic.",
    h1: "Sensibilitatea dentară: cauze și soluții",
    excerpt:
      "Junghiul scurt la înghețată, cafea fierbinte sau aer rece are întotdeauna o cauză. Care sunt cele mai frecvente și ce funcționează cu adevărat împotriva lor.",
    image: "/photos/blog/sensibilitate.webp",
    ogImage: "/photos/blog/sensibilitate-og.jpg",
    imageAlt: "Femeie care își ține obrazul din cauza unei dureri dentare",
    datePublished: "2026-07-11",
    sections: [
      {
        heading: "Ce este, de fapt, sensibilitatea",
        body: "Sub smalț se află dentina, un strat străbătut de mii de canale microscopice care duc direct la nervul dintelui. Cât timp smalțul și gingia acoperă dentina, nervul este izolat. Când dentina rămâne expusă — prin uzura smalțului sau retragerea gingiei — stimulii ca recele, dulcele sau acrul ajung la nerv și apare junghiul scurt și ascuțit, tipic sensibilității.",
      },
      {
        heading: "Cauzele frecvente",
        body: "Cele mai des întâlnite: periajul agresiv cu periuță dură, care uzează smalțul și retrage gingia; consumul frecvent de alimente și băuturi acide (sucuri carbogazoase, citrice), care erodează smalțul; bruxismul — scrâșnitul dinților în somn; retracția gingivală din boala parodontală; și, desigur, cariile sau obturațiile deteriorate. Uneori sensibilitatea apare temporar după detartraj sau albire și trece de la sine.",
      },
      {
        heading: "Ce poți face acasă",
        body: "Treceți la o periuță cu peri moi și la un periaj blând, cu pastă de dinți desensibilizantă folosită constant — efectul se instalează în câteva săptămâni, nu peste noapte. Reduceți frecvența acizilor și nu vă periați imediat după ei. Evitați „soluțiile” abrazive de albire de pe cont propriu. Dacă scrâșniți din dinți noaptea, semnele tipice sunt tensiunea în maxilar dimineața și marginile uzate ale dinților.",
      },
      {
        heading: "Când mergi la medic",
        body: "Dacă sensibilitatea persistă peste două săptămâni în ciuda măsurilor de acasă, dacă este localizată mereu la același dinte, dacă durerea devine spontană sau prelungită ori dacă apare la masticație — este momentul unui consult. Aceste semne pot indica o carie, o fisură sau o problemă a nervului, care nu se rezolvă cu pastă desensibilizantă.",
      },
      {
        heading: "Cum se tratează în cabinet",
        body: "Tratamentul depinde de cauză: fluorizarea profesională întărește smalțul și sigilează canalele dentinare expuse; o carie sau o obturație veche se tratează prin obturație nouă; pentru bruxism se realizează o gutieră purtată noaptea, care protejează dinții de uzură. La consult identificăm întâi cauza — abia apoi soluția are efect de durată.",
      },
    ],
    relatedServiceSlugs: ["plomba-dentara", "detartraj-profesional"],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

/** Rough reading time in minutes, from the article's full text. */
export function readingTimeMinutes(post: BlogPost): number {
  const words = [post.excerpt, ...post.sections.map((s) => s.body)]
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
