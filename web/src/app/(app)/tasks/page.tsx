"use client";

import { useState } from "react";
import { atLeast, useAuth } from "@/components/AuthProvider";
import Modal from "@/components/Modal";
import { Badge, EmptyState, statusTone } from "@/components/ui";
import AvatarStack from "@/components/AvatarStack";
import { Search } from "lucide-react";

interface Task {
  id: string;
  name: string;
  domain: string | null;
  deadline: string;
  status: string;
  progress: number;
  assignees: { user_id: string; name: string }[];
}

interface Task {
  id: string;
  name: string;
  domain: string | null;
  deadline: string;
  status: string;
  type: string;
  assignees: { user_id: string; name: string }[];
}

export default function TasksPage() {
  const { user } = useAuth();
  const data = { tasks: [] as Task[] };
  const mutate = () => {};
  const [submitTask, setSubmitTask] = useState<Task | null>(null);
  const [reviewTask, setReviewTask] = useState<Task | null>(null);
  const [query, setQuery] = useState("");
  const [statusTab, setStatusTab] = useState<"all" | "in_progress" | "not_started" | "completed">("all");

  const allTasks = data?.tasks ?? [];
  const tasks = allTasks.filter((t) => {
    if (statusTab !== "all" && t.status !== statusTab) return false;
    if (query && !t.name.toLowerCase().includes(query.toLowerCase()) && !(t.domain ?? "").toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  function actionsFor(t: Task) {
    const isAssignee = t.assignees.some((a) => a.user_id === user?.id);
    return (
      <>
        {isAssignee && (t.status === "not_started" || t.status === "in_progress" || t.status === "rejected") && (
          <button onClick={() => setSubmitTask(t)} className="text-xs font-medium" style={{ color: "var(--color-blue)" }}>Submit</button>
        )}
        {atLeast(user?.authority, "admin") && t.status === "submitted" && (
          <button onClick={() => setReviewTask(t)} className="text-xs font-medium" style={{ color: "var(--color-blue)" }}>Review submission</button>
        )}
      </>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <h1 className="text-lg font-semibold">Tasks</h1>

      <div className="flex flex-wrap gap-2">
        {([
          { key: "all", label: "All Tasks" },
          { key: "in_progress", label: "In Progress" },
          { key: "not_started", label: "Not Started" },
          { key: "completed", label: "Completed" },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => setStatusTab(t.key)}
            className="text-xs px-3 py-1.5 rounded-full border font-medium"
            style={{
              borderColor: "var(--color-line)",
              background: statusTab === t.key ? "var(--color-blue)" : "transparent",
              color: statusTab === t.key ? "white" : "var(--color-ink)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-muted)" }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tasks..."
          className="w-full sm:w-72 rounded-lg border pl-9 pr-3 py-2 text-sm"
          style={{ borderColor: "var(--color-line)", background: "var(--color-surface-container-lowest)" }}
        />
      </div>

      {/* Desktop/tablet: full table */}
      <div className="card overflow-x-auto hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs border-b" style={{ color: "var(--color-muted)", borderColor: "var(--color-line)" }}>
              <th className="px-4 py-3 font-medium">Task name</th>
              <th className="px-4 py-3 font-medium">Assigned to</th>
              <th className="px-4 py-3 font-medium">Progress</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t.id} className="border-b last:border-0" style={{ borderColor: "var(--color-line)" }}>
                <td className="px-4 py-3">
                  <p className="font-medium">{t.name}</p>
                  <p className="text-xs" style={{ color: "var(--color-muted)" }}>{t.domain ?? "General"} · due {new Date(t.deadline).toLocaleDateString()}</p>
                </td>
                <td className="px-4 py-3"><AvatarStack names={t.assignees.map((a) => a.name)} /></td>
                <td className="px-4 py-3">
                  <div className="w-28 h-1.5 rounded-full bg-black/10 overflow-hidden">
                    <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${t.progress}%`, background: "var(--color-blue)" }} />
                  </div>
                </td>
                <td className="px-4 py-3"><Badge tone={statusTone(t.status)}>{t.status.replace("_", " ")}</Badge></td>
                <td className="px-4 py-3 space-x-2">{actionsFor(t)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {tasks.length === 0 && <EmptyState title="No tasks yet" body="Tasks assigned to the team will show up here." />}
      </div>

      {/* Mobile: stacked cards instead of a cramped horizontally-scrolling table */}
      <div className="space-y-2.5 md:hidden">
        {tasks.map((t) => (
          <div key={t.id} className="card p-4 animate-fade-in">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium text-sm min-w-0 break-words">{t.name}</p>
              <Badge tone={statusTone(t.status)}>{t.status.replace("_", " ")}</Badge>
            </div>
            <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>
              {t.domain ?? "General"} · due {new Date(t.deadline).toLocaleDateString()}
            </p>
            <div className="mt-2"><AvatarStack names={t.assignees.map((a) => a.name)} /></div>
            <div className="w-full h-1.5 rounded-full bg-black/10 overflow-hidden mt-2">
              <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${t.progress}%`, background: "var(--color-blue)" }} />
            </div>
            <div className="flex gap-3 mt-3">{actionsFor(t)}</div>
          </div>
        ))}
        {tasks.length === 0 && <div className="card p-4"><EmptyState title="No tasks yet" body="Tasks assigned to the team will show up here." /></div>}
      </div>

      {submitTask && <SubmitModal task={submitTask} onClose={() => setSubmitTask(null)} onDone={() => { setSubmitTask(null); mutate(); }} />}
      {reviewTask && <ReviewModal task={reviewTask} onClose={() => setReviewTask(null)} onDone={() => { setReviewTask(null); mutate(); }} />}
    </div>
  );
}

function SubmitModal({ task, onClose, onDone }: { task: Task; onClose: () => void; onDone: () => void }) {
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      // TODO: Connect Backend API
      console.log("Backend integration pending", task.id, { content, link });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title={`Submit: ${task.name}`} onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        {error && <p className="text-sm rounded-lg px-3 py-2" style={{ background: "#fdecea", color: "var(--color-red)" }}>{error}</p>}
        <div>
          <label className="text-xs font-medium block mb-1">Notes</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={3} className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--color-line)" }} />
        </div>
        <div>
          <label className="text-xs font-medium block mb-1">Link (Drive, GitHub, Figma…)</label>
          <input type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://" className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--color-line)" }} />
        </div>
        <button type="submit" disabled={busy} className="w-full rounded-lg py-2 text-sm font-medium text-white disabled:opacity-60" style={{ background: "var(--color-blue)" }}>
          {busy ? "Submitting…" : "Submit for review"}
        </button>
      </form>
    </Modal>
  );
}

function ReviewModal({ task, onClose, onDone }: { task: Task; onClose: () => void; onDone: () => void }) {
  const [remarks, setRemarks] = useState("");
  const [busy, setBusy] = useState(false);

  async function decide(decision: "accept" | "reject") {
    setBusy(true);
    try {
      // TODO: Connect Backend API
      console.log("Backend integration pending", task.id, { decision, remarks });
      onDone();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title={`Review: ${task.name}`} onClose={onClose}>
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium block mb-1">Remarks (optional)</label>
          <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={3} className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--color-line)" }} />
        </div>
        <div className="flex gap-2">
          <button disabled={busy} onClick={() => decide("accept")} className="flex-1 rounded-lg py-2 text-sm font-medium text-white disabled:opacity-60" style={{ background: "var(--color-green)" }}>Accept</button>
          <button disabled={busy} onClick={() => decide("reject")} className="flex-1 rounded-lg py-2 text-sm font-medium text-white disabled:opacity-60" style={{ background: "var(--color-red)" }}>Reject</button>
        </div>
      </div>
    </Modal>
  );
}
