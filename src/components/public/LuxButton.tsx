import Link from "next/link";
import { cn } from "@/lib/utils";

// Tombol mewah untuk halaman publik (tanpa shadcn).
type Variant = "gold" | "outline-light" | "outline-dark" | "ghost-light";
type Size = "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-prime-gold disabled:pointer-events-none disabled:opacity-60";

const sizes: Record<Size, string> = {
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-sm",
};

const variants: Record<Variant, string> = {
  gold: "bg-prime-gold text-prime-black hover:bg-[#d9bd78] hover:shadow-[0_8px_30px_-8px_rgba(201,169,97,0.6)]",
  "outline-light":
    "border border-white/30 text-white hover:border-prime-gold hover:text-prime-gold",
  "outline-dark":
    "border border-prime-black/20 text-prime-black hover:border-prime-gold hover:text-prime-gold-dark",
  "ghost-light": "text-white/80 hover:text-prime-gold",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

export function LuxLink({
  href,
  variant = "gold",
  size = "md",
  className,
  children,
  external,
}: CommonProps & { href: string; external?: boolean }) {
  const cls = cn(base, sizes[size], variants[variant], className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function LuxButton({
  variant = "gold",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, sizes[size], variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
