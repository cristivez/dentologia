import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dentologia - Clinică Stomatologică",
    short_name: "Dentologia",
    description:
      "Clinică stomatologică modernă în Câmpulung Muscel. Implant dentar, aparat dentar, albire, detartraj.",
    start_url: "/",
    display: "standalone",
    background_color: "#5f6361",
    theme_color: "#555a57",
    icons: [
      {
        src: "/favicon-48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        src: "/favicon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };
}
