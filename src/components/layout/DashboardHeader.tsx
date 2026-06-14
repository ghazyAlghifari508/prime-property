"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  ChevronDown,
  Crown,
  LogOut,
  ScrollText,
  ShieldUser,
  Users,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/lib/actions/auth";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/agent/dashboard", label: "Properti", icon: Building2, superadmin: false },
  { href: "/agent/dashboard/admins", label: "Admin", icon: Users, superadmin: true },
  { href: "/agent/dashboard/audit-log", label: "Audit Log", icon: ScrollText, superadmin: true },
];

export function DashboardHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isSuperadmin } = useAuth();

  async function handleLogout() {
    await logoutAction();
    router.push("/agent/login");
  }

  const initials = user?.nama
    ? user.nama
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "PP";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-prime-white shadow-sm">
      <div className="h-0.5 bg-gradient-to-r from-prime-gold/0 via-prime-gold to-prime-gold/0" />
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Logo href="/agent/dashboard" height={32} priority />
          <span className="hidden h-6 w-px bg-border md:block" />
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.filter((n) => !n.superadmin || isSuperadmin).map((item) => {
              const active =
                item.href === "/agent/dashboard"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-prime-gold/10 text-prime-black"
                      : "text-muted-foreground hover:bg-soft-gray hover:text-prime-black",
                  )}
                >
                  <item.icon
                    className={cn(
                      "size-4",
                      active && "text-prime-gold-dark",
                    )}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 outline-none transition-colors hover:bg-soft-gray">
              <span className="flex size-8 items-center justify-center rounded-full bg-prime-black text-xs font-semibold text-prime-white">
                {initials}
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-medium leading-tight text-prime-black">
                  {user?.nama}
                </span>
                <span className="flex items-center gap-1 text-xs leading-tight text-muted-foreground">
                  {isSuperadmin ? (
                    <Crown className="size-3 text-prime-gold-dark" />
                  ) : (
                    <ShieldUser className="size-3" />
                  )}
                  {isSuperadmin ? "Superadmin" : "Admin"}
                </span>
              </span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <span className="block font-medium">{user?.nama}</span>
                <span className="block text-xs font-normal text-muted-foreground">
                  {user?.email}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-prime-red focus:text-prime-red"
              >
                <LogOut className="size-4" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Nav mobile */}
      <nav className="flex items-center gap-1 overflow-x-auto border-t border-border px-4 py-2 md:hidden">
        {NAV.filter((n) => !n.superadmin || isSuperadmin).map((item) => {
          const active =
            item.href === "/agent/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium",
                active
                  ? "bg-soft-gray text-prime-black"
                  : "text-muted-foreground",
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
