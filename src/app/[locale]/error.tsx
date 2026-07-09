"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container as="section" className="py-20 pt-28 text-center">
      <h2 className="text-3xl font-bold mb-4">Ceva nu a mers bine</h2>
      <p className="text-muted mb-8">
        A apărut o eroare neașteptată. Încercați din nou.
      </p>
      <Button onClick={reset}>Încearcă din nou</Button>
    </Container>
  );
}
