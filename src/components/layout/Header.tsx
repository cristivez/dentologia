"use client";

import { useState, useEffect, useCallback } from "react";
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
            className="rounded-lg"
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
          className="flex md:hidden min-h-[44px] min-w-[44px] items-center justify-center rounded-lg"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Închide meniul" : "Deschide meniul"}
          aria-expanded={menuOpen}
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
