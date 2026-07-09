export type ServiceItem = {
  name: string;
  price: string;
};

export type ServiceCategory = {
  slug: string;
  tabLabel: string;
  items: ServiceItem[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    slug: "general",
    tabLabel: "Consultații",
    items: [
      { name: "Consultație de specialitate", price: "100 lei" },
      { name: "Tratament de urgență", price: "250 lei" },
    ],
  },
  {
    slug: "profilaxie",
    tabLabel: "Profilaxie",
    items: [
      {
        name: "Pachet complet: Detartraj + Periaj + AirFlow",
        price: "250 lei",
      },
      {
        name: "Detartraj + Periaj + AirFlow + Albire cu gutiere",
        price: "700 lei",
      },
      { name: "Periaj profesional", price: "100 lei / ambele arcade" },
      { name: "Fluorizare", price: "150 lei / ambele arcade" },
      { name: "Detartraj", price: "150 lei" },
      { name: "AirFlow", price: "100 lei" },
      {
        name: "Aplicare bijuterie dentară (include bijuteria)",
        price: "300 lei",
      },
      { name: "Sigilare dinte temporar", price: "200 lei" },
      { name: "Sigilare dinte definitiv", price: "200 lei" },
    ],
  },
  {
    slug: "odontoterapie",
    tabLabel: "Odontoterapie",
    items: [
      { name: "Obturație fizionomică mică", price: "200 lei" },
      { name: "Obturație fizionomică medie", price: "250 lei" },
      { name: "Obturație fizionomică mare", price: "300 lei" },
      { name: "Obturație dinte frontal", price: "350 lei" },
      { name: "Obturație CIS", price: "150 lei" },
      { name: "Reconstrucție dinte fracturat", price: "200 – 300 lei" },
    ],
  },
  {
    slug: "endodontie",
    tabLabel: "Endodonție",
    items: [
      {
        name: "Consultație de urgență + pansament calmant",
        price: "250 lei",
      },
      {
        name: "Tratament endodontic rotativ — dinte monoradicular",
        price: "250 lei",
      },
      {
        name: "Tratament endodontic rotativ — dinte pluriradicular",
        price: "300 – 500 lei",
      },
      { name: "Retratament — dinte monoradicular", price: "300 lei" },
      {
        name: "Retratament — dinte pluriradicular",
        price: "400 – 600 lei",
      },
      { name: "Drenaj endodontic", price: "100 lei" },
      { name: "Tratament Hidroxid de Calciu", price: "150 lei" },
      { name: "Reconstrucție perete", price: "150 lei" },
      { name: "Ablație pivot", price: "200 lei" },
    ],
  },
  {
    slug: "chirurgie",
    tabLabel: "Chirurgie",
    items: [
      { name: "Extracție monoradiculară", price: "150 – 200 lei" },
      { name: "Extracție pluriradiculară", price: "250 – 300 lei" },
      { name: "Extracție molar de minte", price: "400 – 600 lei" },
      { name: "Incizie + drenaj abces", price: "200 lei" },
      { name: "Decapușonare", price: "150 lei" },
    ],
  },
  {
    slug: "ortodontie",
    tabLabel: "Ortodonție",
    items: [
      { name: "Consultație", price: "100 lei" },
      { name: "Plan de tratament + Modele de studiu", price: "200 lei" },
      { name: "Aparat metalic", price: "2.700 lei / arcadă" },
      { name: "Aparat autoligaturant", price: "3.200 lei / arcadă" },
      {
        name: "Aparat autoligaturant Damon",
        price: "4.500 lei / arcadă",
      },
      { name: "Aparat metalic segmentar", price: "1.500 lei" },
      { name: "Disjunctor", price: "1.600 lei" },
      { name: "Disjunctor pe 2 miniimplanturi", price: "3.200 lei" },
      { name: "Disjunctor pe 4 miniimplanturi", price: "4.000 lei" },
      { name: "Arc lingual", price: "800 lei" },
      { name: "Arc transpalatinal", price: "800 lei" },
      { name: "Trainer", price: "1.000 lei" },
      { name: "Aparat mobil", price: "1.000 lei" },
      { name: "Control aparat o arcadă", price: "110 lei" },
      { name: "Control aparat două arcade", price: "170 lei" },
      { name: "Control aparat mobil", price: "100 lei" },
      { name: "Recolare bracket metalic", price: "50 lei" },
      { name: "Recolare tub", price: "75 lei" },
      {
        name: "Recolare bracket autoligaturant / Damon",
        price: "75 lei",
      },
      { name: "Inel ortodontic", price: "100 lei" },
      { name: "Gutieră de contenție", price: "350 lei" },
      { name: "Gutieră de bruxism", price: "350 lei" },
      { name: "Retainer", price: "350 lei" },
      {
        name: "Îndepărtare aparat + retainer + gutieră",
        price: "1.200 lei",
      },
      { name: "Spark 10 / ambele arcade", price: "1.600 EUR" },
      { name: "Spark 20 / ambele arcade", price: "2.800 EUR" },
      { name: "Spark Advance / ambele arcade", price: "3.500 EUR" },
    ],
  },
  {
    slug: "protetica",
    tabLabel: "Protetică",
    items: [
      {
        name: "Element zirconiu monolit multistratificat",
        price: "900 lei",
      },
      {
        name: "Element zirconiu monolit multistratificat Dentsply Sirona",
        price: "1.000 lei",
      },
      { name: "Element zirconiu + ceramică", price: "1.100 lei" },
      {
        name: "Element zirconiu + ceramică Dentsply Sirona",
        price: "1.500 lei",
      },
      { name: "Element zirconiu implant", price: "1.000 lei" },
      {
        name: "Element zirconiu implant Dentsply Sirona",
        price: "1.600 lei",
      },
      {
        name: "Element zirconiu + ceramică implant",
        price: "1.700 lei",
      },
      {
        name: "Element zirconiu + ceramică implant Dentsply Sirona",
        price: "2.000 lei",
      },
      { name: "Cimentare bont (tibase) implant", price: "100 lei" },
      {
        name: "Emax Ivoclar (fațete, punți, coroane)",
        price: "1.800 lei / element",
      },
      { name: "Inlay Emax Ivoclar", price: "800 lei" },
      { name: "RCR zirconiu", price: "300 lei" },
      {
        name: "Reconstrucție gingivală roz element",
        price: "80 lei",
      },
      { name: "Gutiere albire", price: "350 lei" },
      { name: "Gutieră bruxism", price: "350 lei" },
      { name: "Element Weisser Crom", price: "350 lei" },
      { name: "Cimentare coroană", price: "80 lei" },
      { name: "RCR metalic (crom)", price: "200 lei" },
      { name: "Element metalo-ceramică", price: "700 lei" },
      { name: "Proteză totală acrilică", price: "2.000 lei" },
      { name: "Proteză totală flexibilă", price: "2.200 lei" },
      { name: "Proteză parțială acrilică", price: "1.500 lei" },
      { name: "Proteză parțială flexibilă", price: "2.200 lei" },
      { name: "Rebazare proteză", price: "250 lei" },
      { name: "Element coroană acrilat", price: "200 lei" },
      { name: "Coroană provizorie PMMA", price: "100 lei" },
      { name: "Ablație / dinte", price: "100 lei" },
    ],
  },
];

export const totalServiceItems = serviceCategories.reduce(
  (sum, cat) => sum + cat.items.length,
  0,
);
