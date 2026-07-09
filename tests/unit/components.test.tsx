import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Button } from "@/components/ui/Button";

describe("Button component", () => {
  it("renders as <a> when href is provided", () => {
    const { container } = render(<Button href="/test">Link</Button>);
    const el = container.firstElementChild;
    expect(el?.tagName).toBe("A");
    expect(el?.getAttribute("href")).toBe("/test");
  });

  it("renders as <button> when no href", () => {
    const { container } = render(<Button>Click</Button>);
    const el = container.firstElementChild;
    expect(el?.tagName).toBe("BUTTON");
  });

  it("applies primary variant classes by default", () => {
    const { container } = render(<Button>Test</Button>);
    const el = container.firstElementChild;
    expect(el?.className).toContain("bg-primary");
    expect(el?.className).toContain("text-primary-foreground");
  });

  it("applies whatsapp variant classes", () => {
    const { container } = render(<Button variant="whatsapp">WhatsApp</Button>);
    const el = container.firstElementChild;
    expect(el?.className).toContain("bg-whatsapp");
    expect(el?.className).toContain("text-whatsapp-foreground");
  });

  it("applies secondary variant classes", () => {
    const { container } = render(
      <Button variant="secondary">Secondary</Button>,
    );
    const el = container.firstElementChild;
    expect(el?.className).toContain("border");
  });

  it("applies size classes", () => {
    const { container } = render(<Button size="lg">Large</Button>);
    const el = container.firstElementChild;
    expect(el?.className).toContain("px-8");
    expect(el?.className).toContain("py-4");
  });

  it("has minimum touch target size", () => {
    const { container } = render(<Button>Touch</Button>);
    const el = container.firstElementChild;
    expect(el?.className).toContain("min-h-[44px]");
    expect(el?.className).toContain("min-w-[44px]");
  });

  it("passes target and rel to <a>", () => {
    const { container } = render(
      <Button href="/ext" target="_blank" rel="noopener noreferrer">
        External
      </Button>,
    );
    const el = container.firstElementChild;
    expect(el?.getAttribute("target")).toBe("_blank");
    expect(el?.getAttribute("rel")).toBe("noopener noreferrer");
  });
});
