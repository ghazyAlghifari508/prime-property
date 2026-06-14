import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { AuthProvider } from "@/lib/auth-context";
import { getCurrentUser } from "@/lib/auth";

// Dashboard layout (Server Component). Validasi auth di server.
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Guard: token tidak ada/expired/invalid → login
  if (!user) {
    redirect("/agent/login");
  }

  return (
    <AuthProvider user={user}>
      <div className="flex min-h-screen flex-col bg-soft-gray">
        <DashboardHeader />
        <main className="flex-1">
          <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}
