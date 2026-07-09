export const CLINIC = {
  name: "Dentologia",
  fullName: "Dentologia - Clinică Stomatologică",
  phone: "+40750486564",
  phoneDisplay: "0750 486 564",
  email: "contact@dentologia.ro",
  whatsapp: "https://wa.me/40750486564",
  address: {
    street: "Strada General Iosif Teodorescu 2",
    city: "Câmpulung",
    county: "Argeș",
    postalCode: "115100",
    country: "RO",
    full: "Strada General Iosif Teodorescu 2, Câmpulung 115100",
  },
  coordinates: {
    lat: 45.2654,
    lng: 25.0441,
  },
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61575751498702",
    instagram: "https://www.instagram.com/dentologia.ro/",
    google:
      "https://www.google.com/maps/place/Dentologia+-+Clinica+Stomatologica/@45.2654,25.0441,17z/",
  },
  googleMapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2823.123!2d25.0441!3d45.2654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sDentologia!5e0!3m2!1sro!2sro!4v1",
  domain: "dentologia.ro",
  url: "https://dentologia.ro",
} as const;

export type ScheduleEntry = {
  day: string;
  open: string | null;
  close: string | null;
};

export const SCHEDULE: ScheduleEntry[] = [
  { day: "Luni", open: "09:00", close: "19:00" },
  { day: "Marți", open: "09:00", close: "19:00" },
  { day: "Miercuri", open: "09:00", close: "19:00" },
  { day: "Joi", open: "09:00", close: "19:00" },
  { day: "Vineri", open: "09:00", close: "19:00" },
  { day: "Sâmbătă", open: "09:00", close: "14:00" },
  { day: "Duminică", open: null, close: null },
];
