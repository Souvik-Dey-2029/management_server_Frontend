"use client";
import LogoMark from "@/components/LogoMark";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  // TODO: Connect Backend API — Google OAuth is not implemented in this frontend-only build.
  const googleEnabled = false;

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      // TODO: Connect Backend API — demo login just redirects to the dashboard.
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--color-bg)" }}>
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <LogoMark size={30} />
          <p className="text-sm font-semibold">GDG On Campus HIT</p>
        </div>

        <div className="card p-6 shadow-sm">
          <h1 className="text-lg font-semibold mb-1">Sign in</h1>
          <p className="text-sm mb-5" style={{ color: "var(--color-muted)" }}>
            Use your club account to continue.
          </p>

          {error && (
            <p className="text-sm rounded-lg px-3 py-2 mb-4" style={{ background: "#fdecea", color: "var(--color-red)" }}>
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-medium block mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
                style={{ borderColor: "var(--color-line)" }}
                placeholder="you@gdghit.dev"
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
                style={{ borderColor: "var(--color-line)" }}
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-lg py-2 text-sm font-medium text-white disabled:opacity-60"
              style={{ background: "var(--color-blue)" }}
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="flex items-center gap-2 my-4">
            <div className="h-px flex-1" style={{ background: "var(--color-line)" }} />
            <span className="text-xs" style={{ color: "var(--color-muted)" }}>or</span>
            <div className="h-px flex-1" style={{ background: "var(--color-line)" }} />
          </div>

          <button
            type="button"
            disabled={!googleEnabled}
            onClick={() => console.log("Backend integration pending")}
            className="w-full rounded-lg py-2 text-sm font-medium border flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ borderColor: "var(--color-line)" }}
            title={googleEnabled ? "Continue with Google" : "Google OAuth is not configured on this server (see .env.example)"}
          >
            Continue with Google
          </button>
          {!googleEnabled && (
            <p className="text-[11px] mt-2 text-center" style={{ color: "var(--color-muted)" }}>
              Google sign-in requires server configuration — see .env.example
            </p>
          )}

          <p className="text-sm text-center mt-5" style={{ color: "var(--color-muted)" }}>
            New here? <Link href="/register" className="font-medium" style={{ color: "var(--color-blue)" }}>Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
