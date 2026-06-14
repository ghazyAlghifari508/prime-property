import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Serif display mewah untuk heading editorial (luxury real estate).
const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Prime Property — Properti Pilihan, Investasi Terpercaya",
    template: "%s · Prime Property",
  },
  description:
    "Prime Property menghadirkan listing properti pilihan — ruko dan villa di kawasan strategis. Temukan properti impian Anda bersama tim profesional kami.",
  icons: { icon: "/logo-prime-property.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${cormorant.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
