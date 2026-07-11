import type { MetadataRoute } from "next";
import { CLINIC } from "@/lib/constants";
import { servicePages } from "@/data/servicePages";
import { serviceCategories } from "@/data/services";
import { blogPosts } from "@/data/blogPosts";

/**
 * Only Romanian routes are listed. The `/en` tree is a stub with Romanian body
 * copy and is marked `noindex` in the locale layout, so submitting it here
 * would ask Google to crawl pages we have told it to ignore.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/servicii", priority: 0.9 },
    { path: "/preturi", priority: 0.9 },
    { path: "/echipa", priority: 0.8 },
    { path: "/contact", priority: 0.8 },
    { path: "/intrebari", priority: 0.7 },
    { path: "/blog", priority: 0.7 },
    { path: "/recenzii", priority: 0.6 },
    { path: "/confidentialitate", priority: 0.3 },
  ];

  const serviceRoutes = servicePages.map((page) => ({
    path: `/servicii/${page.slug}`,
    priority: 0.9,
  }));

  const priceCategoryRoutes = serviceCategories.map((cat) => ({
    path: `/preturi/${cat.slug}`,
    priority: 0.8,
  }));

  const blogRoutes = blogPosts.map((post) => ({
    path: `/blog/${post.slug}`,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...priceCategoryRoutes,
    ...blogRoutes,
  ].map(({ path, priority }) => ({
    url: `${CLINIC.url}${path}`,
    lastModified,
    changeFrequency: path === "/preturi" ? "weekly" : "monthly",
    priority,
  }));
}
