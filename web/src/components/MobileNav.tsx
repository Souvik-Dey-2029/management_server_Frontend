"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";
import { atLeast, useAuth } from "@/components/AuthProvider";

// The remaining nav items not already covered by the bottom tab bar's 4 primary slots.
const PRIMARY_HREFS = new Set(["/dashboard", "/calendar", "/tasks", "/meetings"]);

export default function MobileNav({ onClose }: { onClose: () => void }) {
  const { user, logout } = useAuth();
  const moreItems = NAV_ITEMS.filter((item) => !PRIMARY_HREFS.has(item.href));

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={onClose} />
      <div
        className="absolute left-0 right-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-2xl animate-slide-up"
        style={{ background: "var(--color-surface-container-lowest)", paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex justify-center pt-2">
          <span className="w-9 h-1 rounded-full" style={{ background: "var(--color-outline-variant)" }} />
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-sm font-semibold">More</p>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-black/5" aria-label="Close" style={{ color: "var(--color-on-surface-variant)" }}>
            <X size={18} />
          </button>
        </div>
        <nav className="px-2 pb-2 grid grid-cols-3 gap-1">
          {moreItems
            .filter((item) => atLeast(user?.authority, item.minAuthority))
            .map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex flex-col items-center justify-center gap-1.5 rounded-xl py-4 text-center hover:bg-black/5"
                >
                  <span
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: "var(--color-primary-fixed)", color: "var(--color-primary)" }}
                  >
                    <Icon size={18} />
                  </span>
                  <span className="label-sm" style={{ color: "var(--color-on-surface-variant)" }}>{item.label}</span>
                </Link>
              );
            })}
        </nav>
        <div className="border-t mx-4" style={{ borderColor: "var(--color-outline-variant)" }} />
        <button
          onClick={async () => { onClose(); await logout(); window.location.href = "/login"; }}
          className="w-full text-left px-6 py-4 text-sm font-medium"
          style={{ color: "var(--color-tertiary)" }}
        >
          Log out
        </button>
      </div>
    </div>
  );
}
