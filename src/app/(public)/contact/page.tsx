import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone, Clock, ArrowUpRight } from "lucide-react";
import { ContactFormLux } from "@/components/public/ContactFormLux";
import { KONTAK } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Kontak",
  description:
    "Hubungi Prime Property — alamat kantor, telepon, email, dan WhatsApp. Tim kami siap membantu kebutuhan properti Anda.",
};

const CONTACT_ITEMS = [
  {
    icon: MapPin,
    label: "Alamat Kantor",
    value: KONTAK.alamat,
  },
  {
    icon: Phone,
    label: "Telepon",
    value: KONTAK.telepon,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Chat via WhatsApp",
    href: `https://wa.me/${KONTAK.whatsapp}`,
    external: true,
  },
  {
    icon: Mail,
    label: "Email",
    value: KONTAK.email,
    href: `mailto:${KONTAK.email}`,
  },
  {
    icon: Clock,
    label: "Jam Operasional",
    value: KONTAK.jam,
  },
];

export default function ContactPage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-prime-black pb-20 pt-36 lg:pb-28 lg:pt-44">
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 h-[60%] w-1/3 bg-gradient-to-l from-prime-gold/10 to-transparent blur-2xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow text-prime-gold">Kontak</p>
          <h1 className="mt-5 max-w-4xl font-display text-4xl font-medium leading-[1.1] text-white sm:text-5xl lg:text-6xl">
            Mari <span className="text-gold-gradient">Terhubung</span> dengan
            Kami
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/60">
            Punya pertanyaan atau ingin konsultasi properti? Tim kami siap
            mendampingi Anda.
          </p>
          <div className="gold-rule mt-8 w-32" />
        </div>
      </section>

      {/* ===== KONTEN ===== */}
      <section className="bg-prime-black py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:px-8">
          {/* Informasi kontak */}
          <div className="space-y-10">
            <div>
              <p className="eyebrow text-prime-gold">Informasi</p>
              <h2 className="mt-4 font-display text-3xl font-medium text-white">
                Temukan Kami
              </h2>
            </div>

            <ul className="space-y-6">
              {CONTACT_ITEMS.map((item) => (
                <li key={item.label} className="flex gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center border border-prime-gold/30">
                    <item.icon className="size-5 text-prime-gold" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-white/40">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        className="mt-0.5 inline-flex items-center gap-1 text-sm text-white transition-colors hover:text-prime-gold"
                      >
                        {item.value}
                        {item.external && (
                          <ArrowUpRight className="size-3.5" />
                        )}
                      </a>
                    ) : (
                      <p className="mt-0.5 text-sm text-white/80">
                        {item.value}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {/* Embed Maps */}
            <div className="overflow-hidden border border-white/10">
              <iframe
                title="Lokasi Kantor Prime Property"
                src="https://www.google.com/maps?q=Medan&output=embed"
                className="h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Form */}
          <div className="border border-white/10 bg-[#111] p-7 sm:p-10">
            <p className="eyebrow text-prime-gold">Formulir</p>
            <h2 className="mt-4 font-display text-3xl font-medium text-white">
              Kirim Pesan
            </h2>
            <p className="mt-2 text-sm text-white/50">
              Isi formulir di bawah, tim kami akan segera menghubungi Anda.
            </p>
            <div className="gold-rule mt-5 mb-7 w-24" />
            <ContactFormLux />
          </div>
        </div>
      </section>
    </>
  );
}
