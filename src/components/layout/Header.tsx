"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { CLINIC } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navItems = [
  { href: "/", label: "Acasă" },
  { href: "/servicii", label: "Servicii" },
  { href: "/preturi", label: "Prețuri" },
  { href: "/echipa", label: "Echipa" },
  { href: "/recenzii", label: "Recenzii" },
  { href: "/intrebari", label: "Întrebări" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const { scrollDirection, isAtTop } = useScrollDirection();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const panelRef = useRef<HTMLElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Close the mobile menu on route change, including browser back/forward.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  // iOS scroll lock
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      document.body.style.overscrollBehavior = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      document.body.style.overscrollBehavior = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      document.body.style.overscrollBehavior = "";
    };
  }, [menuOpen]);

  // Close on Escape
  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeMenu();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, closeMenu]);

  // Modal focus management: the panel is a scroll-locked overlay, so focus has
  // to move into it, stay trapped while it is open, and return to the trigger
  // on close — otherwise a keyboard user tabs onto the page hidden behind it.
  useEffect(() => {
    const panel = panelRef.current;
    if (!menuOpen || !panel) return;

    const focusable = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
    // Move focus to the dialog container itself (it carries tabindex=-1), not a
    // child control. WebKit ignores a programmatic .focus() on a button/link
    // raised outside the click's own gesture, but honours it on the container —
    // and focusing the container is the WAI-ARIA dialog pattern anyway.
    panel.focus();

    // Document-level so it still fires if focus has already slipped out of the
    // panel — WebKit, unlike Chromium, tabs straight off the tabindex=-1
    // container instead of into its first child, so the trap has to pull focus
    // back rather than only wrap at the first/last element.
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (!active || active === panel || !panel.contains(active)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      // Return focus to the trigger. Restored via ref, not a captured
      // activeElement — WebKit never focuses the button on click, so the
      // active element at open time was <body>, not the hamburger.
      hamburgerRef.current?.focus();
    };
  }, [menuOpen]);

  const isHidden = scrollDirection === "down" && !isAtTop && !menuOpen;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-transform duration-300",
        isHidden && "-translate-y-full",
        !isAtTop && "bg-surface/90 backdrop-blur-lg shadow-lg",
        isAtTop && "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" aria-label="Acasă">
          <Image
            src="/logo.webp"
            alt={`${CLINIC.name} logo`}
            width={36}
            height={36}
            className="logo-glow rounded-full"
            priority
          />
          <span className="text-lg font-bold text-foreground hidden sm:inline">
            {CLINIC.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Navigare principală"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] flex items-center",
                "[@media(hover:hover)]:hover:bg-surface-elevated active:bg-surface-elevated",
                pathname === item.href ? "text-primary" : "text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          ref={hamburgerRef}
          className="flex md:hidden min-h-[44px] min-w-[44px] items-center justify-center rounded-lg"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Închide meniul" : "Deschide meniul"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? (
            <X size={24} aria-hidden="true" />
          ) : (
            <Menu size={24} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 top-0 bg-black/50 z-40 md:hidden"
            onClick={closeMenu}
            aria-hidden="true"
          />
          <nav
            ref={panelRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            className="fixed top-0 right-0 bottom-0 w-72 bg-surface z-50 flex flex-col p-6 pt-20 shadow-2xl md:hidden"
            aria-label="Meniu mobil"
          >
            <button
              className="absolute top-4 right-4 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg"
              onClick={closeMenu}
              aria-label="Închide meniul"
            >
              <X size={24} aria-hidden="true" />
            </button>

            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "py-3 px-4 rounded-lg text-base font-medium min-h-[44px] flex items-center",
                  "active:bg-surface-elevated",
                  pathname === item.href
                    ? "text-primary bg-surface-elevated"
                    : "text-foreground",
                )}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-auto pt-6 border-t border-border">
              <a
                href={`tel:${CLINIC.phone}`}
                className="flex items-center gap-2 py-3 px-4 text-primary font-semibold min-h-[44px]"
              >
                📞 {CLINIC.phoneDisplay}
              </a>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
