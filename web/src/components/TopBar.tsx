"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, LogOut, Menu, Settings as SettingsIcon, User } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

interface Notif {
  id: string;
  title: string;
  body: string | null;
  link: string |null;
  read: number;
  created_at: string;
}

export default function TopBar({ onMenu }: { onMenu?: () => void }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Fixed hydration-safe values
  const [greeting, setGreeting] = useState("Welcome");
  const [shortDate, setShortDate] = useState("");
  const [longDate, setLongDate] = useState("");

  useEffect(() => {
    // Backend integration pending

    const now = new Date();

    const hour = now.getHours();

    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 17) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }

    setShortDate(
      new Intl.DateTimeFormat("en-GB", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }).format(now)
    );

    setLongDate(
      new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(now)
    );
  }, []);

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 md:px-6 py-3 border-b"
      style={{ background: "var(--color-surface-container-lowest)" }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <button
          className="md:hidden p-2 -ml-2 shrink-0"
          onClick={onMenu}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0">
          <p
            className="text-sm font-medium truncate"
            style={{ color: "var(--color-ink)" }}
          >
            {greeting}, {user?.name?.split(" ")[0] ?? "there"}
          </p>

          <p
            className="text-xs truncate"
            style={{ color: "var(--color-muted)" }}
          >
            <span className="sm:hidden">
              {shortDate || "Fri, 31 Jul"}
            </span>

            <span className="hidden sm:inline">
              {longDate || "Friday, 31 July 2026"}
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <div className="relative">
          <button
            className="relative p-2 rounded-full hover:bg-black/5"
            onClick={() => setOpen((o) => !o)}
            aria-label="Notifications"
          >
            <Bell size={19} />

            {unread > 0 && (
              <span
                className="absolute top-1 right-1 w-4 h-4 text-[10px] flex items-center justify-center rounded-full text-white"
                style={{ background: "var(--color-red)" }}
              >
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] card shadow-lg py-2 max-h-96 overflow-y-auto animate-slide-down origin-top-right">
              <div className="px-3 pb-2 flex items-center justify-between">
                <p className="text-sm font-semibold">Notifications</p>

                <button
                  className="text-xs"
                  style={{ color: "var(--color-blue)" }}
                  onClick={() => {
                    console.log("Backend integration pending");
                    setUnread(0);
                    setNotifs((n) => n.map((x) => ({ ...x, read: 1 })));
                  }}
                >
                  Mark all read
                </button>
              </div>

              {notifs.length === 0 && (
                <p
                  className="px-3 py-4 text-sm text-center"
                  style={{ color: "var(--color-muted)" }}
                >
                  No notifications
                </p>
              )}

              {notifs.map((n) => (
                <button
                  key={n.id}
                  className="w-full text-left px-3 py-2 hover:bg-black/5 block"
                  onClick={() => {
                    setOpen(false);
                    if (n.link) router.push(n.link);
                  }}
                >
                  <p
                    className="text-sm"
                    style={{ fontWeight: n.read ? 400 : 600 }}
                  >
                    {n.title}
                  </p>

                  {n.body && (
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "var(--color-muted)" }}
                    >
                      {n.body}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full hover:bg-black/5"
            onClick={() => setProfileOpen((o) => !o)}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
              style={{ background: "var(--color-blue)" }}
            >
              {user?.name?.[0]?.toUpperCase() ?? "?"}
            </div>

            <span className="hidden sm:block text-left leading-tight">
              <span
                className="block text-sm font-medium truncate max-w-[9rem]"
                style={{ color: "var(--color-ink)" }}
              >
                {user?.name}
              </span>

              <span
                className="block label-sm truncate max-w-[9rem]"
                style={{ color: "var(--color-muted)" }}
              >
                {user?.domain ?? user?.authority}
              </span>
            </span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 card shadow-lg py-1 animate-slide-down origin-top-right">
              <Link
                href="/profile"
                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-black/5"
              >
                <User size={15} /> Profile
              </Link>

              <Link
                href="/settings"
                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-black/5"
              >
                <SettingsIcon size={15} /> Settings
              </Link>

              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-black/5 text-left"
                style={{ color: "var(--color-red)" }}
                onClick={async () => {
                  await logout();
                  router.push("/login");
                }}
              >
                <LogOut size={15} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
