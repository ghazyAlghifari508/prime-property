"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Beranda" },
  { href: "/about", label: "Tentang Kami" },
  { href: "/contact", label: "Kontak" },
];

export function PublicHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Landing punya hero gelap → header transparan; halaman lain → solid gelap.
  const isLanding = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || !isLanding || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        solid
          ? "border-b border-white/10 bg-prime-black/90 backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="Prime Property — Beranda"
          className="flex items-center"
        >
          <Image
            src="/logo-prime-property.png"
            alt="Prime Property"
            width={160}
            height={44}
            priority
            className="h-9 w-auto object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-10 md:flex">
          {NAV.map((item) => {
            const active = item.href === pathname;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-sm tracking-wide transition-colors",
                  active ? "text-prime-gold" : "text-white/80 hover:text-white",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute -bottom-1.5 left-0 h-px bg-prime-gold transition-all duration-300",
                    active ? "w-full" : "w-0",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block w-32" />

        {/* Mobile toggle */}
        <button
          type="button"
          className="inline-flex items-center justify-center p-2 text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/10 bg-prime-black md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {NAV.map((item) => {
              const active = item.href === pathname;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "py-3 text-sm tracking-wide transition-colors",
                    active ? "text-prime-gold" : "text-white/80",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
