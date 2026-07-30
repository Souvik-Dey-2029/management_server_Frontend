"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import MobileNav from "@/components/MobileNav";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/components/AuthProvider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="gdg-dots loading">
          <span /><span /><span /><span />
        </span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {mobileOpen && <MobileNav onClose={() => setMobileOpen(false)} />}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onMenu={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">{children}</main>
      </div>
      <BottomNav onMore={() => setMobileOpen(true)} />
    </div>
  );
}
