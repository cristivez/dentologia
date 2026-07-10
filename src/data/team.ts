export type TeamMember = {
  /** URL slug, if the member ever gets a dedicated page. */
  slug: string;
  name: string;
  /** Role shown to visitors, e.g. "Medic ortodont · Fondator". */
  role: string;
  /** One or two sentences. Kept factual — no invented credentials. */
  bio: string;
  photo: string;
  /**
   * Colegiul Medicilor Dentiști din România registration number, if provided.
   * Emitted in Physician schema when present. Never invent one.
   */
  cmdr?: string;
};

/**
 * Named practitioners. Google treats dentistry as YMYL content and weights
 * real, credentialed people heavily — this is one of the strongest on-site
 * ranking levers a clinic has. Only add a member with a real name and role.
 */
export const team: TeamMember[] = [
  {
    slug: "alexandra-zemeleaga-ciobotea",
    name: "Dr. Alexandra Zemeleaga-Ciobotea",
    role: "Medic ortodont · Fondator Dentologia",
    bio: "Alexandra este medic ortodont și fondatoarea clinicii Dentologia din Câmpulung Muscel. Se ocupă de tratamentele ortodontice — aparate dentare fixe și mobile, gutiere transparente — pentru copii și adulți, punând accent pe un plan de tratament explicat clar și pe confortul fiecărui pacient.",
    photo: "/photos/echipa-portret.webp",
  },
];
