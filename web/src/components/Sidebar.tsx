"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";
import { atLeast, useAuth } from "@/components/AuthProvider";
import LogoMark from "@/components/LogoMark";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside
      className="hidden md:flex md:flex-col w-64 shrink-0 h-screen sticky top-0 px-3 py-5 border-r"
      style={{ background: "var(--color-surface-container-lowest)", borderColor: "var(--color-outline-variant)" }}
    >
      <Link href="/dashboard" className="flex items-center gap-2.5 px-3 pb-6">
        <LogoMark size={34} />
        <div className="leading-tight">
          <p className="label-lg" style={{ color: "var(--color-on-surface)" }}>GDG On Campus</p>
          <p className="label-sm" style={{ color: "var(--color-on-surface-variant)" }}>HIT Management Portal</p>
        </div>
      </Link>

      <nav className="flex-1 flex flex-col gap-0.5">
        {NAV_ITEMS.filter((item) => atLeast(user?.authority, item.minAuthority)).map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 text-sm transition-colors"
              style={{
                borderRadius: "var(--radius-md)",
                background: active ? "color-mix(in srgb, var(--color-primary) 10%, transparent)" : "transparent",
                color: active ? "var(--color-primary)" : "var(--color-on-surface-variant)",
                fontWeight: active ? 600 : 400,
              }}
            >
              <Icon size={17} strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pt-4 border-t" style={{ borderColor: "var(--color-outline-variant)" }}>
        <p className="label-sm capitalize" style={{ color: "var(--color-on-surface-variant)" }}>
          Signed in as <span style={{ color: "var(--color-on-surface)" }}>{user?.authority}</span>
        </p>
      </div>
    </aside>
  );
}
