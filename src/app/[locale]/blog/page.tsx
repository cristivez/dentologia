import { use } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { BreadcrumbJsonLd } from "@/components/shared/JsonLd";
import { AnimatedGroup, AnimatedItem } from "@/components/shared/AnimatedGroup";
import { generatePageMetadata } from "@/lib/metadata";
import { CLINIC } from "@/lib/constants";
import { blogPosts, readingTimeMinutes } from "@/data/blogPosts";

export const metadata: Metadata = generatePageMetadata({
  title: "Blog: Sfaturi de Sănătate Dentară | Dentologia Câmpulung",
  description:
    "Ghiduri și sfaturi de la Dentologia Câmpulung Muscel: periaj corect, detartraj, prevenție, aparat dentar, sensibilitate dentară și mituri demontate.",
  path: "/blog",
});

const dateFormat = new Intl.DateTimeFormat("ro-RO", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Acasă", url: CLINIC.url },
          { name: "Blog", url: `${CLINIC.url}/blog` },
        ]}
      />
      <Container as="section" className="py-20 pt-28">
        <div className="rise">
          <SectionHeading
            as="h1"
            title="Sfaturi de sănătate dentară"
            subtitle="Ghiduri scrise pe înțelesul tuturor: igienă, prevenție, ortodonție și răspunsuri la întrebările pe care le auzim des în cabinet"
          />
        </div>

        <AnimatedGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <AnimatedItem key={post.slug} className="h-full">
              <Link href={`/blog/${post.slug}`} className="block h-full">
                <Card hover className="h-full overflow-hidden !p-0">
                  <div className="overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.imageAlt}
                      width={1200}
                      height={627}
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                      className="block w-full object-cover transition-transform duration-700 ease-out [@media(hover:hover)]:hover:scale-[1.04]"
                    />
                  </div>
                  <div className="p-6">
                    <p className="mb-2 text-xs text-accent">
                      {dateFormat.format(new Date(post.datePublished))} ·{" "}
                      {readingTimeMinutes(post)} min citire
                    </p>
                    <h2 className="mb-2 text-lg font-bold text-foreground">
                      {post.h1}
                    </h2>
                    <p className="text-sm leading-relaxed text-muted line-clamp-3">
                      {post.excerpt}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      Citește articolul →
                    </span>
                  </div>
                </Card>
              </Link>
            </AnimatedItem>
          ))}
        </AnimatedGroup>
      </Container>
    </>
  );
}
