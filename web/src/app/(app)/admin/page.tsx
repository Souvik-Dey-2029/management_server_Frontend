"use client";

import Link from "next/link";
import { Users, FileCheck } from "lucide-react";

interface Stats {
  stats: { totalMembers: number; activeMembers: number };
}

export default function AdminHomePage() {
  const data: Stats = { stats: { totalMembers: 0, activeMembers: 0 } };
  const pending = 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-lg font-semibold">Admin dashboard</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <Link href="/admin/authority" className="card p-5 hover:shadow-md transition-shadow">
          <Users size={20} style={{ color: "var(--color-blue)" }} />
          <p className="text-sm font-semibold mt-3">Authority management</p>
          <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>
            {data?.stats.totalMembers ?? 0} members · {data?.stats.activeMembers ?? 0} active
          </p>
        </Link>
        <Link href="/admin/application" className="card p-5 hover:shadow-md transition-shadow">
          <FileCheck size={20} style={{ color: "var(--color-blue)" }} />
          <p className="text-sm font-semibold mt-3">Applications</p>
          <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>{pending} pending review</p>
        </Link>
      </div>
    </div>
  );
}
