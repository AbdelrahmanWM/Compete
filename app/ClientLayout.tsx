"use client";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Analytics } from "@vercel/analytics/next";
import Chatbot from "@/app/chatbot/chatbot";


function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && pathname !== "/auth") {
      router.replace("/auth");
    }
    if (!loading && user && pathname === "/auth") {
      router.replace("/");
    }
  }, [user, loading, pathname, router]);

  if (loading || (!user && pathname !== "/auth")) {
    return null;
  }
  return <>{children}</>;
}


export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = pathname !== "/auth";
  return (
    <AuthProvider>
      <RequireAuth>
        {showSidebar && <Sidebar />}
        <div className={showSidebar ? "ml-64" : ""}>
          {children}
          {showSidebar && (
            <div className="fixed bottom-4 right-4 z-50 w-96 max-w-full bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-4 border border-neutral-200 dark:border-neutral-800">
              <Chatbot />
            </div>
          )}
        </div>
        <Analytics />
      </RequireAuth>
    </AuthProvider>
  );
}
