import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { KONTAK } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-prime-black text-white">

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        {/* Brand */}
        <div className="space-y-5">
          <span className="inline-block rounded-sm bg-white px-3 py-2">
            <Image
              src="/logo-prime-property.png"
              alt="Prime Property"
              width={150}
              height={40}
              className="h-9 w-auto object-contain"
            />
          </span>
          <p className="max-w-xs text-sm leading-relaxed text-white/60">
            Properti pilihan, investasi terpercaya. Koleksi ruko dan villa
            terkurasi di kawasan paling strategis.
          </p>
        </div>

        {/* Kontak */}
        <div className="space-y-4">
          <h3 className="eyebrow text-prime-gold">Kontak</h3>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-prime-gold" />
              <span>{KONTAK.alamat}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="size-4 shrink-0 text-prime-gold" />
              <span>{KONTAK.telepon}</span>
            </li>
            <li className="flex items-center gap-3">
              <MessageCircle className="size-4 shrink-0 text-prime-gold" />
              <a
                href={`https://wa.me/${KONTAK.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-prime-gold"
              >
                WhatsApp
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="size-4 shrink-0 text-prime-gold" />
              <a
                href={`mailto:${KONTAK.email}`}
                className="transition-colors hover:text-prime-gold"
              >
                {KONTAK.email}
              </a>
            </li>
          </ul>
        </div>

        {/* Navigasi */}
        <div className="space-y-4">
          <h3 className="eyebrow text-prime-gold">Navigasi</h3>
          <ul className="space-y-3 text-sm text-white/70">
            {[
              { href: "/", label: "Beranda" },
              { href: "/about", label: "Tentang Kami" },
              { href: "/contact", label: "Kontak" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex items-center gap-1 transition-colors hover:text-prime-gold"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs tracking-wide text-white/40 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Prime Property. Seluruh hak cipta
          dilindungi.
        </div>
      </div>
    </footer>
  );
}
