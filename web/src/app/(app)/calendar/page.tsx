"use client";

import { useMemo, useState } from "react";
import { atLeast, useAuth } from "@/components/AuthProvider";
import Modal from "@/components/Modal";
import UserPicker from "@/components/UserPicker";
import { Badge, EmptyState, statusTone } from "@/components/ui";
import { Plus, ChevronLeft, ChevronRight, Repeat2 } from "lucide-react";

interface Task {
  id: string;
  name: string;
  domain: string | null;
  deadline: string;
  status: string;
  type: string;
  assignees: { user_id: string; name: string }[];
}

function isoDateOnly(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function CalendarPage() {
  const { user } = useAuth();
  const data = { tasks: [] as Task[] };
  const mutate = () => {};
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreate, setShowCreate] = useState(false);
  const [reassignTask, setReassignTask] = useState<Task | null>(null);
  const [monthOffset, setMonthOffset] = useState(0);

  const tasks = useMemo(() => data?.tasks ?? [], [data?.tasks]);
  const filtered = statusFilter === "all" ? tasks : tasks.filter((t) => t.status === statusFilter);

  const viewDate = new Date();
  viewDate.setMonth(viewDate.getMonth() + monthOffset);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = firstDay.getDay();

  const tasksByDate = useMemo(() => {
    const map: Record<string, number> = {};
    for (const t of tasks) {
      const key = isoDateOnly(new Date(t.deadline));
      map[key] = (map[key] ?? 0) + 1;
    }
    return map;
  }, [tasks]);

  const cells: (number | null)[] = [...Array(startWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Calendar</h1>
        {atLeast(user?.authority, "admin") && (
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-white"
            style={{ background: "var(--color-blue)" }}
          >
            <Plus size={15} /> New task
          </button>
        )}
      </div>

      {/* F007: visual calendar */}
      <div className="card p-3 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setMonthOffset((o) => o - 1)} className="p-1.5 rounded hover:bg-black/5" aria-label="Previous month"><ChevronLeft size={16} /></button>
          <p className="text-sm font-medium">{viewDate.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</p>
          <button onClick={() => setMonthOffset((o) => o + 1)} className="p-1.5 rounded hover:bg-black/5" aria-label="Next month"><ChevronRight size={16} /></button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] mb-1" style={{ color: "var(--color-muted)" }}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (!day) return <div key={i} />;
            const key = isoDateOnly(new Date(year, month, day));
            const count = tasksByDate[key] ?? 0;
            return (
              <div key={i} className="aspect-square rounded-lg border flex flex-col items-center justify-center gap-0.5 transition-colors hover:bg-black/5" style={{ borderColor: "var(--color-line)" }}>
                <span className="text-xs">{day}</span>
                {count > 0 && (
                  <span className="text-[10px] rounded-full px-1.5" style={{ background: "var(--color-blue)", color: "white" }}>{count}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* F010: filters */}
      <div className="flex gap-2">
        {["all", "not_started", "in_progress", "submitted", "rejected", "completed"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className="text-xs px-3 py-1.5 rounded-full border"
            style={{
              borderColor: "var(--color-line)",
              background: statusFilter === s ? "var(--color-blue)" : "transparent",
              color: statusFilter === s ? "white" : "var(--color-ink)",
            }}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* F008: task list view */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold mb-3">Tasks</h2>
        {filtered.length === 0 && <EmptyState title="No tasks match this filter" />}
        <div className="space-y-2">
          {filtered.map((t) => (
            <div key={t.id} className="flex items-center justify-between rounded-lg border px-3 py-2.5" style={{ borderColor: "var(--color-line)" }}>
              <div>
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>
                  {t.domain ?? "General"} · due {new Date(t.deadline).toLocaleDateString()} · {t.assignees.map((a) => a.name).join(", ") || "Unassigned"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={statusTone(t.status)}>{t.status.replace("_", " ")}</Badge>
                {atLeast(user?.authority, "admin") && (
                  <button onClick={() => setReassignTask(t)} className="p-1.5 rounded hover:bg-black/5" title="Reassign">
                    <Repeat2 size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCreate && <CreateTaskModal onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); mutate(); }} />}
      {reassignTask && (
        <ReassignModal
          task={reassignTask}
          onClose={() => setReassignTask(null)}
          onDone={() => { setReassignTask(null); mutate(); }}
        />
      )}
    </div>
  );
}

function CreateTaskModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState("");
  const [deadline, setDeadline] = useState("");
  const [type, setType] = useState<"individual" | "team">("individual");
  const [assignees, setAssignees] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (assignees.length === 0) {
      setError("Select at least one member to assign.");
      return;
    }
    setBusy(true);
    try {
      // TODO: Connect Backend API
      console.log("Backend integration pending", { name, description, domain, deadline, type, assignees });
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title="Create task" onClose={onClose} wide>
      <form onSubmit={submit} className="space-y-3">
        {error && <p className="text-sm rounded-lg px-3 py-2" style={{ background: "#fdecea", color: "var(--color-red)" }}>{error}</p>}
        <div>
          <label className="text-xs font-medium block mb-1">Task name</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--color-line)" }} />
        </div>
        <div>
          <label className="text-xs font-medium block mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--color-line)" }} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium block mb-1">Domain / post</label>
            <input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="Web, App, Design…" className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--color-line)" }} />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1">Deadline</label>
            <input required type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--color-line)" }} />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium block mb-1">Type</label>
          <div className="flex gap-2">
            <button type="button" onClick={() => setType("individual")} className="text-xs px-3 py-1.5 rounded-full border" style={{ borderColor: "var(--color-line)", background: type === "individual" ? "var(--color-blue)" : "transparent", color: type === "individual" ? "white" : "var(--color-ink)" }}>Individual</button>
            <button type="button" onClick={() => setType("team")} className="text-xs px-3 py-1.5 rounded-full border" style={{ borderColor: "var(--color-line)", background: type === "team" ? "var(--color-blue)" : "transparent", color: type === "team" ? "white" : "var(--color-ink)" }}>Team</button>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium block mb-1">Assign to {type === "team" ? "(select multiple)" : ""}</label>
          <UserPicker selected={assignees} onChange={setAssignees} multiple={type === "team"} />
        </div>
        <button type="submit" disabled={busy} className="w-full rounded-lg py-2 text-sm font-medium text-white disabled:opacity-60" style={{ background: "var(--color-blue)" }}>
          {busy ? "Creating…" : "Create task"}
        </button>
      </form>
    </Modal>
  );
}

function ReassignModal({ task, onClose, onDone }: { task: Task; onClose: () => void; onDone: () => void }) {
  const [selected, setSelected] = useState<string[]>(task.assignees.map((a) => a.user_id));
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    try {
      // TODO: Connect Backend API
      console.log("Backend integration pending", task.id, { newAssigneeIds: selected });
      onDone();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title={`Reassign: ${task.name}`} onClose={onClose}>
      <UserPicker selected={selected} onChange={setSelected} />
      <button onClick={submit} disabled={busy || selected.length === 0} className="w-full mt-3 rounded-lg py-2 text-sm font-medium text-white disabled:opacity-60" style={{ background: "var(--color-blue)" }}>
        {busy ? "Saving…" : "Save assignment"}
      </button>
    </Modal>
  );
}
