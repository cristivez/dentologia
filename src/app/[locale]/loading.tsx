import { Container } from "@/components/ui/Container";

export default function Loading() {
  return (
    <Container className="py-20 pt-28">
      <div className="animate-pulse space-y-6">
        {/* Heading skeleton */}
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-48 rounded-lg bg-surface-elevated" />
          <div className="h-4 w-72 rounded-lg bg-surface-elevated" />
        </div>

        {/* Content skeleton */}
        <div className="grid gap-6 md:grid-cols-3 mt-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-surface-elevated" />
          ))}
        </div>
      </div>
    </Container>
  );
}
