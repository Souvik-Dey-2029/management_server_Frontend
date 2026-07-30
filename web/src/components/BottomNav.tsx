"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarDays, ListChecks, Video, Grid2x2 } from "lucide-react";

const PRIMARY_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/tasks", label: "Tasks", icon: ListChecks },
  { href: "/meetings", label: "Meetings", icon: Video },
];

export default function BottomNav({ onMore }: { onMore: () => void }) {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t flex items-stretch"
      style={{
        background: "var(--color-surface-container-lowest)",
        borderColor: "var(--color-outline-variant)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {PRIMARY_ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2"
          >
            <Icon
              size={20}
              strokeWidth={active ? 2.4 : 2}
              style={{ color: active ? "var(--color-primary)" : "var(--color-on-surface-variant)" }}
            />
            <span
              className="label-sm"
              style={{ color: active ? "var(--color-primary)" : "var(--color-on-surface-variant)", fontWeight: active ? 600 : 500 }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
      <button onClick={onMore} className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2" aria-label="More">
        <Grid2x2 size={20} style={{ color: "var(--color-on-surface-variant)" }} />
        <span className="label-sm" style={{ color: "var(--color-on-surface-variant)", fontWeight: 500 }}>More</span>
      </button>
    </nav>
  );
}
