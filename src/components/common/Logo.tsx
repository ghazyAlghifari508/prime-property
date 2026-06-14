import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  href?: string;
  className?: string;
  /** tinggi logo dalam px */
  height?: number;
  priority?: boolean;
}

export function Logo({
  href = "/",
  className,
  height = 40,
  priority = false,
}: LogoProps) {
  const width = Math.round((height / 200) * 640); // rasio asli ~640x200

  const img = (
    <Image
      src="/logo-prime-property.png"
      alt="Prime Property"
      width={width}
      height={height}
      priority={priority}
      className="h-auto w-auto object-contain"
      style={{ height }}
    />
  );

  if (!href) return <span className={cn("inline-flex", className)}>{img}</span>;

  return (
    <Link
      href={href}
      className={cn("inline-flex items-center", className)}
      aria-label="Prime Property — Beranda"
    >
      {img}
    </Link>
  );
}
