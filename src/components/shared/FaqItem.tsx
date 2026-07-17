/**
 * One native <details> disclosure, shared by the homepage FAQ preview, the
 * /intrebari page, and each /servicii/[slug] page — the markup was copy-pasted
 * identically across all three. Stays a server component: it is plain
 * details/summary with a CSS-only open indicator, no client JavaScript.
 *
 * The list wrapper and any entrance animation belong at the call site, since
 * those differ per page (AnimatedGroup vs AnimatedSection vs a plain list).
 */
export function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <details className="group rounded-xl border border-border bg-surface overflow-hidden">
      <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-foreground font-medium text-sm min-h-[44px] list-none [&::-webkit-details-marker]:hidden">
        <span>{question}</span>
        <span
          className="shrink-0 text-muted transition-transform duration-200 group-open:rotate-45"
          aria-hidden="true"
        >
          +
        </span>
      </summary>
      <div className="px-5 pb-4 text-sm text-muted leading-relaxed">
        <p>{answer}</p>
      </div>
    </details>
  );
}
