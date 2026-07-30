"use client";

import { Badge } from "@/components/ui";
import { useAuth } from "@/components/AuthProvider";

interface UserRow {
  id: string; name: string; email: string; domain: string | null;
  authority: string; status: string; task_count: number;
}

const AUTHORITIES = ["nonmember", "member", "admin", "superadmin"];
const STATUSES = ["active", "on_leave", "alumni", "suspended"];

export default function AuthorityPage() {
  const { user: me } = useAuth();
  const data = { users: [] as UserRow[] };
  const mutate = () => {};

  async function update(id: string, patch: Partial<{ authority: string; status: string }>) {
    // TODO: Connect Backend API
    console.log("Backend integration pending", id, patch);
    mutate();
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <h1 className="text-lg font-semibold">Authority management</h1>
      <p className="text-sm" style={{ color: "var(--color-muted)" }}>
        Only superadmins can grant admin or superadmin authority.
      </p>

      {/* Desktop table */}
      <div className="card overflow-x-auto hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs border-b" style={{ color: "var(--color-muted)", borderColor: "var(--color-line)" }}>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Domain</th>
              <th className="px-4 py-3 font-medium">Authority</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Tasks</th>
            </tr>
          </thead>
          <tbody>
            {data?.users.map((u) => (
              <tr key={u.id} className="border-b last:border-0" style={{ borderColor: "var(--color-line)" }}>
                <td className="px-4 py-3">
                  <p className="font-medium">{u.name}</p>
                  <p className="text-xs" style={{ color: "var(--color-muted)" }}>{u.email}</p>
                </td>
                <td className="px-4 py-3">{u.domain ?? "—"}</td>
                <td className="px-4 py-3">
                  <select
                    value={u.authority}
                    disabled={u.id === me?.id}
                    onChange={(e) => update(u.id, { authority: e.target.value })}
                    className="rounded border px-2 py-1.5 text-xs"
                    style={{ borderColor: "var(--color-line)" }}
                  >
                    {AUTHORITIES.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={u.status}
                    onChange={(e) => update(u.id, { status: e.target.value })}
                    className="rounded border px-2 py-1.5 text-xs"
                    style={{ borderColor: "var(--color-line)" }}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3"><Badge tone="neutral">{u.task_count}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-2.5 md:hidden">
        {data?.users.map((u) => (
          <div key={u.id} className="card p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{u.name}</p>
                <p className="text-xs truncate" style={{ color: "var(--color-muted)" }}>{u.email}</p>
              </div>
              <Badge tone="neutral">{u.task_count} tasks</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div>
                <label className="label-sm block mb-1" style={{ color: "var(--color-muted)" }}>Authority</label>
                <select
                  value={u.authority}
                  disabled={u.id === me?.id}
                  onChange={(e) => update(u.id, { authority: e.target.value })}
                  className="w-full rounded border px-2 py-1.5 text-xs"
                  style={{ borderColor: "var(--color-line)" }}
                >
                  {AUTHORITIES.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="label-sm block mb-1" style={{ color: "var(--color-muted)" }}>Status</label>
                <select
                  value={u.status}
                  onChange={(e) => update(u.id, { status: e.target.value })}
                  className="w-full rounded border px-2 py-1.5 text-xs"
                  style={{ borderColor: "var(--color-line)" }}
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            {u.domain && <p className="text-xs mt-2" style={{ color: "var(--color-muted)" }}>Domain: {u.domain}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
