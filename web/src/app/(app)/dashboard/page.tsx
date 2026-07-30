"use client";

import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { CalendarPlus, ClipboardList, ListChecks, Users, UserCheck, UserMinus, GraduationCap, ListTodo, type LucideIcon } from "lucide-react";
import { useAuth, atLeast } from "@/components/AuthProvider";

interface DashboardData {
  stats: { activeMembers: number; onLeave: number; alumni: number; activeTasks: number; totalMembers: number };
  todaysMeetings: { id: string; title: string; starts_at: string; agenda: string | null }[];
  myTasks: { id: string; name: string; domain: string | null; status: string; deadline: string }[];
  updates: { id: string; title: string; body: string; posted_by_name: string; created_at: string }[];
  taskLoadByDomain: { domain: string; count: number }[];
}

function StatCard({ label, value, icon: Icon, tint }: { label: string; value: number; icon: LucideIcon; tint: string }) {
  return (
    <div className="card p-4 flex items-center gap-3">
      <span
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `color-mix(in srgb, ${tint} 14%, transparent)`, color: tint }}
      >
        <Icon size={17} />
      </span>
      <div className="min-w-0">
        <p className="text-xl font-semibold leading-tight">{value}</p>
        <p className="label-sm truncate" style={{ color: "var(--color-muted)" }}>{label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const data: DashboardData = {
    stats: { activeMembers: 0, onLeave: 0, alumni: 0, activeTasks: 0, totalMembers: 0 },
    todaysMeetings: [],
    myTasks: [],
    updates: [],
    taskLoadByDomain: [],
  };
  const isLoading = false;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* F002: stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard label="Total members" value={data?.stats.totalMembers ?? 0} icon={Users} tint="var(--color-primary)" />
        <StatCard label="Active members" value={data?.stats.activeMembers ?? 0} icon={UserCheck} tint="var(--color-secondary)" />
        <StatCard label="On leave" value={data?.stats.onLeave ?? 0} icon={UserMinus} tint="var(--color-quaternary)" />
        <StatCard label="Alumni" value={data?.stats.alumni ?? 0} icon={GraduationCap} tint="var(--color-on-surface-variant)" />
        <StatCard label="Active tasks" value={data?.stats.activeTasks ?? 0} icon={ListTodo} tint="var(--color-tertiary)" />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* F003: today's meeting */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold mb-3">Today&apos;s meetings</h2>
            {isLoading && <p className="text-sm" style={{ color: "var(--color-muted)" }}>Loading…</p>}
            {!isLoading && (data?.todaysMeetings.length ?? 0) === 0 && (
              <p className="text-sm" style={{ color: "var(--color-muted)" }}>No meetings scheduled for today.</p>
            )}
            <div className="space-y-2">
              {data?.todaysMeetings.map((m) => (
                <Link
                  key={m.id}
                  href={`/meetings/${m.id}`}
                  className="block rounded-lg border px-3 py-2 hover:bg-black/5"
                  style={{ borderColor: "var(--color-line)" }}
                >
                  <p className="text-sm font-medium">{m.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>
                    {new Date(m.starts_at).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                    {m.agenda ? ` · ${m.agenda}` : ""}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* F006: task load graph */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold mb-3">Active task load by domain</h2>
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <BarChart data={data?.taskLoadByDomain ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" />
                  <XAxis dataKey="domain" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="var(--color-blue)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* F006: community updates */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold mb-3">Community updates</h2>
            <div className="space-y-3">
              {data?.updates.map((u) => (
                <div key={u.id} className="border-b last:border-0 pb-3 last:pb-0" style={{ borderColor: "var(--color-line)" }}>
                  <p className="text-sm font-medium">{u.title}</p>
                  <p className="text-sm mt-0.5" style={{ color: "var(--color-muted)" }}>{u.body}</p>
                  <p className="text-[11px] mt-1" style={{ color: "var(--color-muted)" }}>
                    {u.posted_by_name} · {new Date(u.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* F005: quick actions */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold mb-3">Quick actions</h2>
            <div className="grid grid-cols-2 gap-2">
              {atLeast(user?.authority, "admin") && (
                <Link href="/calendar" className="flex flex-col items-center gap-1 rounded-lg border px-3 py-3 text-xs hover:bg-black/5" style={{ borderColor: "var(--color-line)" }}>
                  <ListChecks size={18} /> New task
                </Link>
              )}
              {atLeast(user?.authority, "admin") && (
                <Link href="/meetings" className="flex flex-col items-center gap-1 rounded-lg border px-3 py-3 text-xs hover:bg-black/5" style={{ borderColor: "var(--color-line)" }}>
                  <CalendarPlus size={18} /> New meeting
                </Link>
              )}
              <Link href="/application" className="flex flex-col items-center gap-1 rounded-lg border px-3 py-3 text-xs hover:bg-black/5" style={{ borderColor: "var(--color-line)" }}>
                <ClipboardList size={18} /> Apply for leave
              </Link>
              {atLeast(user?.authority, "admin") && (
                <Link href="/admin/authority" className="flex flex-col items-center gap-1 rounded-lg border px-3 py-3 text-xs hover:bg-black/5" style={{ borderColor: "var(--color-line)" }}>
                  <Users size={18} /> Manage members
                </Link>
              )}
            </div>
          </div>

          {/* F004: my tasks */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold mb-3">My tasks</h2>
            {(data?.myTasks.length ?? 0) === 0 && (
              <p className="text-sm" style={{ color: "var(--color-muted)" }}>No active tasks. 🎉</p>
            )}
            <div className="space-y-2">
              {data?.myTasks.map((t) => (
                <Link key={t.id} href="/tasks" className="block rounded-lg border px-3 py-2 hover:bg-black/5" style={{ borderColor: "var(--color-line)" }}>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>
                    {t.domain ?? "General"} · due {new Date(t.deadline).toLocaleDateString()}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
