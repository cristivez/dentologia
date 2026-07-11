import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { Phone, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import {
  BlogPostingJsonLd,
  BreadcrumbJsonLd,
} from "@/components/shared/JsonLd";
import { generatePageMetadata } from "@/lib/metadata";
import { CLINIC } from "@/lib/constants";
import { routing } from "@/i18n/routing";
import { blogPosts, getBlogPost, readingTimeMinutes } from "@/data/blogPosts";
import { getServicePage } from "@/data/servicePages";

/** Fixed set of articles known at build time — unknown slugs get a real 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    blogPosts.map((post) => ({ locale, slug: post.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return generatePageMetadata({
    title: post.title,
    description: post.metaDescription,
    path: `/blog/${post.slug}`,
    ogImage: { url: post.ogImage, alt: post.imageAlt },
  });
}

const dateFormat = new Intl.DateTimeFormat("ro-RO", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  // dynamicParams=false guarantees the slug exists; the bang keeps TS happy.
  const post = getBlogPost(slug)!;
  const related = post.relatedServiceSlugs
    .map((s) => getServicePage(s))
    .filter((p) => p !== undefined);

  return (
    <>
      <BlogPostingJsonLd
        headline={post.h1}
        description={post.metaDescription}
        path={`/blog/${post.slug}`}
        image={post.image}
        datePublished={post.datePublished}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Acasă", url: CLINIC.url },
          { name: "Blog", url: `${CLINIC.url}/blog` },
          { name: post.h1, url: `${CLINIC.url}/blog/${post.slug}` },
        ]}
      />
      <Container as="article" className="py-20 pt-28">
        <nav
          aria-label="Breadcrumb"
          className="rise mb-6 text-sm text-muted"
          style={{ "--rise-delay": "0ms" } as CSSProperties}
        >
          <Link href="/" className="[@media(hover:hover)]:hover:text-primary">
            Acasă
          </Link>
          <span aria-hidden="true"> / </span>
          <Link
            href="/blog"
            className="[@media(hover:hover)]:hover:text-primary"
          >
            Blog
          </Link>
        </nav>

        <h1
          className="rise mb-4 max-w-3xl text-3xl font-bold tracking-tight md:text-4xl"
          style={{ "--rise-delay": "60ms" } as CSSProperties}
        >
          {post.h1}
        </h1>

        <p
          className="rise mb-8 text-sm text-accent"
          style={{ "--rise-delay": "120ms" } as CSSProperties}
        >
          {dateFormat.format(new Date(post.datePublished))} ·{" "}
          {readingTimeMinutes(post)} min citire · {CLINIC.name}
        </p>

        <div
          className="rise mb-12 max-w-3xl overflow-hidden rounded-2xl border border-border"
          style={{ "--rise-delay": "180ms" } as CSSProperties}
        >
          <Image
            src={post.image}
            alt={post.imageAlt}
            width={1200}
            height={627}
            sizes="(min-width: 768px) 48rem, 100vw"
            priority
            className="block w-full object-cover"
          />
        </div>

        <div className="max-w-3xl">
          <p
            className="rise mb-10 text-lg leading-relaxed text-muted"
            style={{ "--rise-delay": "240ms" } as CSSProperties}
          >
            {post.excerpt}
          </p>

          {post.sections.map((section, i) => (
            <AnimatedSection key={section.heading} delay={i * 0.05}>
              <section className="mb-10">
                <h2 className="mb-3 text-2xl font-bold">{section.heading}</h2>
                <p className="leading-relaxed text-muted">{section.body}</p>
              </section>
            </AnimatedSection>
          ))}

          <AnimatedSection>
            <div className="mt-12 rounded-2xl border border-border bg-surface p-6 sm:p-8">
              <h2 className="mb-2 text-xl font-bold">
                Ai o întrebare despre dinții tăi?
              </h2>
              <p className="mb-5 text-sm leading-relaxed text-muted">
                Un articol nu înlocuiește un consult. Pentru un răspuns aplicat
                cazului tău, programează o consultație la {CLINIC.name}, în
                Câmpulung Muscel.
              </p>
              <Button href={`tel:${CLINIC.phone}`}>
                <Phone size={18} aria-hidden="true" />
                Programează o consultație
              </Button>

              {related.length > 0 && (
                <ul className="mt-6 space-y-2 border-t border-border pt-5">
                  {related.map((rel) => (
                    <li key={rel.slug}>
                      <Link
                        href={`/servicii/${rel.slug}`}
                        className="inline-flex items-center gap-1 text-sm text-muted transition-colors [@media(hover:hover)]:hover:text-primary"
                      >
                        {rel.h1}
                        <ArrowRight size={14} aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </AnimatedSection>
        </div>
      </Container>
    </>
  );
}
