import type { MetadataRoute } from "next";
import { CLINIC } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/servicii",
    "/preturi",
    "/recenzii",
    "/intrebari",
    "/contact",
    "/confidentialitate",
  ];

  return routes.map((route) => ({
    url: `${CLINIC.url}${route}`,
    lastModified: new Date("2026-04-12"),
    changeFrequency: route === "/preturi" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/preturi" ? 0.9 : 0.7,
  }));
}
