"use client";

import { useAuth } from "@/components/AuthProvider";
import { Badge, statusTone } from "@/components/ui";

interface Task {
  id: string; name: string; status: string; deadline: string; domain: string | null;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const data = { tasks: [] as Task[] };

  const tasks = data?.tasks ?? [];
  const completed = tasks.filter((t) => t.status === "completed").length;
  const rejected = tasks.filter((t) => t.status === "rejected").length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="card p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-semibold" style={{ background: "var(--color-blue)" }}>
          {user?.name?.[0]?.toUpperCase() ?? "?"}
        </div>
        <div>
          <h1 className="text-lg font-semibold">{user?.name}</h1>
          <p className="text-sm" style={{ color: "var(--color-muted)" }}>{user?.email}</p>
          <div className="flex gap-2 mt-2">
            <Badge tone="blue">{user?.domain ?? "No domain set"}</Badge>
            <Badge tone="neutral">{user?.authority}</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="card p-4 text-center">
          <p className="text-2xl font-semibold">{tasks.length}</p>
          <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>Lifetime tasks</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-semibold" style={{ color: "var(--color-green)" }}>{completed}</p>
          <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>Completed</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-semibold" style={{ color: "var(--color-red)" }}>{rejected}</p>
          <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>Rejected (pending resubmit)</p>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-sm font-semibold mb-3">Task history</h2>
        <div className="space-y-2">
          {tasks.map((t) => (
            <div key={t.id} className="flex items-center justify-between border-b last:border-0 py-2" style={{ borderColor: "var(--color-line)" }}>
              <div>
                <p className="text-sm">{t.name}</p>
                <p className="text-xs" style={{ color: "var(--color-muted)" }}>{t.domain ?? "General"}</p>
              </div>
              <Badge tone={statusTone(t.status)}>{t.status.replace("_", " ")}</Badge>
            </div>
          ))}
          {tasks.length === 0 && <p className="text-sm" style={{ color: "var(--color-muted)" }}>No task history yet.</p>}
        </div>
      </div>
    </div>
  );
}
