import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFoundPage() {
  return (
    <Container as="section" className="py-20 pt-28 text-center">
      <h2 className="text-5xl font-bold mb-4">404</h2>
      <p className="text-xl text-muted mb-8">Pagina nu a fost găsită.</p>
      <Button href="/">Înapoi acasă</Button>
    </Container>
  );
}
