"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Code2, Moon, Sun } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [dark, setDark] = useState(false);
  const [devMode, setDevMode] = useState(false);

  // localStorage only exists in the browser, not during server rendering, so reading it must
  // happen post-mount. This is the one legitimate case for setState-in-an-effect: syncing
  // React state from an external browser API that isn't available during the render that
  // produces the initial (server-matching) HTML.
  useEffect(() => {
    const stored = localStorage.getItem("gdg-dark-mode") === "1";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDark(stored);
    document.documentElement.classList.toggle("dark", stored);
    const storedDev = localStorage.getItem("gdg-dev-mode") === "1";
    setDevMode(storedDev);
  }, []);

  async function toggleDark() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("gdg-dark-mode", next ? "1" : "0");
    // TODO: Connect Backend API
    console.log("Backend integration pending", { darkMode: next });
  }

  async function toggleDev() {
    const next = !devMode;
    setDevMode(next);
    localStorage.setItem("gdg-dev-mode", next ? "1" : "0");
    // TODO: Connect Backend API
    console.log("Backend integration pending", { developerMode: next });
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-lg font-semibold">Settings</h1>

      {/* F026: dark/light mode */}
      <div className="card p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {dark ? <Moon size={18} /> : <Sun size={18} />}
          <div>
            <p className="text-sm font-medium">Appearance</p>
            <p className="text-xs" style={{ color: "var(--color-muted)" }}>Switch between light and dark mode</p>
          </div>
        </div>
        <button
          onClick={toggleDark}
          className="w-11 h-6 rounded-full relative transition-colors"
          style={{ background: dark ? "var(--color-blue)" : "#d1d5db" }}
        >
          <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform" style={{ transform: dark ? "translateX(22px)" : "translateX(2px)" }} />
        </button>
      </div>

      {/* F027: developer mode */}
      <div className="card p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Code2 size={18} />
          <div>
            <p className="text-sm font-medium">Developer mode</p>
            <p className="text-xs" style={{ color: "var(--color-muted)" }}>Shows raw IDs and API response metadata. Does not bypass permissions.</p>
          </div>
        </div>
        <button
          onClick={toggleDev}
          className="w-11 h-6 rounded-full relative transition-colors"
          style={{ background: devMode ? "var(--color-blue)" : "#d1d5db" }}
        >
          <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform" style={{ transform: devMode ? "translateX(22px)" : "translateX(2px)" }} />
        </button>
      </div>

      {devMode && (
        <div className="card p-5 font-mono-ui text-xs" style={{ color: "var(--color-muted)" }}>
          <p>user.id = {user?.id}</p>
          <p>user.authority = {user?.authority}</p>
          <p>session cookie = gdg_session (httpOnly, 7d expiry)</p>
        </div>
      )}

      {/* F025: sidebar options are just the nav — link back for convenience */}
      <div className="card p-5">
        <p className="text-sm font-medium mb-1">Sidebar options</p>
        <p className="text-xs" style={{ color: "var(--color-muted)" }}>
          Navigation items are shown based on your authority level (nonmember / member / admin / superadmin).
        </p>
      </div>
    </div>
  );
}
