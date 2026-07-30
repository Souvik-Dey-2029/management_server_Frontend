"use client";
import LogoMark from "@/components/LogoMark";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [domain, setDomain] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      // TODO: Connect Backend API — demo registration just redirects to the dashboard.
      await register(name, email, password, domain || undefined);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
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
          <h1 className="text-lg font-semibold mb-1">Create your account</h1>
          <p className="text-sm mb-5" style={{ color: "var(--color-muted)" }}>
            New accounts start as <strong>Nonmember</strong> until an admin grants access.
          </p>
          {error && (
            <p className="text-sm rounded-lg px-3 py-2 mb-4" style={{ background: "#fdecea", color: "var(--color-red)" }}>
              {error}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-medium block mb-1">Full name</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--color-line)" }} />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--color-line)" }} />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Domain (optional)</label>
              <input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="Web, App, Design…" className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--color-line)" }} />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Password (min 8 characters)</label>
              <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--color-line)" }} />
            </div>
            <button type="submit" disabled={busy} className="w-full rounded-lg py-2 text-sm font-medium text-white disabled:opacity-60" style={{ background: "var(--color-blue)" }}>
              {busy ? "Creating account…" : "Create account"}
            </button>
          </form>
          <p className="text-sm text-center mt-5" style={{ color: "var(--color-muted)" }}>
            Already have an account? <Link href="/login" className="font-medium" style={{ color: "var(--color-blue)" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
