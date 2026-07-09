export type Review = {
  rating: number;
  text: string;
  author: string;
};

export const reviews: Review[] = [
  {
    rating: 5,
    text: "Servicii de calitate, personal foarte amabil și profesionist. Recomand cu încredere Dentologia pentru orice problemă stomatologică!",
    author: "Andrei M.",
  },
  {
    rating: 5,
    text: "O clinică foarte modernă, curată și dotată cu aparatură de ultimă generație. Medicii au multă răbdare și explică totul pe înțeles.",
    author: "Elena I.",
  },
  {
    rating: 5,
    text: "Experiență plăcută, fără durere. Am venit cu teamă, dar echipa m-a făcut să mă simt relaxat. Mulțumesc întregii echipe!",
    author: "Cristian D.",
  },
  {
    rating: 5,
    text: "Profesionalism și atenție la detalii. Cel mai bun cabinet stomatologic din Câmpulung. Recomand tuturor celor care caută calitate.",
    author: "Maria P.",
  },
  {
    rating: 5,
    text: "Cea mai bună experiență la dentist! Personalul este extrem de calm și profesionist. Recomand cu drag locația din Câmpulung.",
    author: "Ioana G.",
  },
  {
    rating: 5,
    text: "Am rezolvat o urgență rapid și eficient. Un cabinet dotat la standarde înalte, unde te simți în siguranță. Mulțumim!",
    author: "Marius V.",
  },
  {
    rating: 5,
    text: "Curățenie exemplară și servicii de top. Totul a decurs perfect, de la recepție și până la finalizarea tratamentului.",
    author: "Simona L.",
  },
  {
    rating: 5,
    text: "Recomand Dentologia pentru răbdarea incredibilă pe care o au cu copiii. Fetița mea a plecat cu zâmbetul pe buze!",
    author: "Daniela R.",
  },
  {
    rating: 5,
    text: "Tehnologie de ultimă oră și medici pregătiți. Se vede că pun preț pe confortul pacientului. 5 stele merită din plin!",
    author: "George B.",
  },
];

export const aggregateRating = {
  value: 5.0,
  count: 12,
  best: 5,
  worst: 1,
};
