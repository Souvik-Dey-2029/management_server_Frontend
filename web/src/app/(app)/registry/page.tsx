"use client";

import { useState } from "react";
import { EmptyState } from "@/components/ui";
import { Download } from "lucide-react";

interface TaskRow { task_name: string; completed_by: string; completed_date: string; remarks: string | null; }
interface MeetingRow { meeting: string; date: string; expected_member_count: number; absent_with_reason_count: number; absent_without_reason_names: string[]; }

export default function RegistryPage() {
  const [tab, setTab] = useState<"tasks" | "meetings">("tasks");
  const taskData = { rows: [] as TaskRow[] };
  const meetingData = { rows: [] as MeetingRow[] };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-lg font-semibold">Registry</h1>
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); console.log("Backend integration pending"); }}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border shrink-0"
          style={{ borderColor: "var(--color-line)" }}
        >
          <Download size={13} /> Export CSV
        </a>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setTab("tasks")} className="text-xs px-3 py-1.5 rounded-full border" style={{ borderColor: "var(--color-line)", background: tab === "tasks" ? "var(--color-blue)" : "transparent", color: tab === "tasks" ? "white" : "var(--color-ink)" }}>Completed tasks</button>
        <button onClick={() => setTab("meetings")} className="text-xs px-3 py-1.5 rounded-full border" style={{ borderColor: "var(--color-line)", background: tab === "meetings" ? "var(--color-blue)" : "transparent", color: tab === "meetings" ? "white" : "var(--color-ink)" }}>Completed meetings</button>
      </div>

      {tab === "tasks" && (
        <div className="animate-fade-in">
          {/* Desktop table */}
          <div className="card overflow-x-auto hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs border-b" style={{ color: "var(--color-muted)", borderColor: "var(--color-line)" }}>
                  <th className="px-4 py-3 font-medium">Task</th>
                  <th className="px-4 py-3 font-medium">Completed by</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {taskData?.rows.map((r, i) => (
                  <tr key={i} className="border-b last:border-0" style={{ borderColor: "var(--color-line)" }}>
                    <td className="px-4 py-3">{r.task_name}</td>
                    <td className="px-4 py-3">{r.completed_by}</td>
                    <td className="px-4 py-3">{new Date(r.completed_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3" style={{ color: "var(--color-muted)" }}>{r.remarks ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(taskData?.rows.length ?? 0) === 0 && <EmptyState title="No completed tasks yet" />}
          </div>
          {/* Mobile cards */}
          <div className="space-y-2.5 md:hidden">
            {taskData?.rows.map((r, i) => (
              <div key={i} className="card p-4">
                <p className="text-sm font-medium break-words">{r.task_name}</p>
                <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>
                  {r.completed_by} · {new Date(r.completed_date).toLocaleDateString()}
                </p>
                {r.remarks && <p className="text-xs mt-1.5 italic" style={{ color: "var(--color-muted)" }}>&ldquo;{r.remarks}&rdquo;</p>}
              </div>
            ))}
            {(taskData?.rows.length ?? 0) === 0 && <div className="card p-4"><EmptyState title="No completed tasks yet" /></div>}
          </div>
        </div>
      )}

      {tab === "meetings" && (
        <div className="animate-fade-in">
          {/* Desktop table */}
          <div className="card overflow-x-auto hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs border-b" style={{ color: "var(--color-muted)", borderColor: "var(--color-line)" }}>
                  <th className="px-4 py-3 font-medium">Meeting</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Expected</th>
                  <th className="px-4 py-3 font-medium">Absent (with reason)</th>
                  <th className="px-4 py-3 font-medium">Absent (no reason)</th>
                </tr>
              </thead>
              <tbody>
                {meetingData?.rows.map((r, i) => (
                  <tr key={i} className="border-b last:border-0" style={{ borderColor: "var(--color-line)" }}>
                    <td className="px-4 py-3">{r.meeting}</td>
                    <td className="px-4 py-3">{new Date(r.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{r.expected_member_count}</td>
                    <td className="px-4 py-3">{r.absent_with_reason_count}</td>
                    <td className="px-4 py-3" style={{ color: "var(--color-muted)" }}>{r.absent_without_reason_names.join(", ") || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(meetingData?.rows.length ?? 0) === 0 && <EmptyState title="No completed meetings yet" />}
          </div>
          {/* Mobile cards */}
          <div className="space-y-2.5 md:hidden">
            {meetingData?.rows.map((r, i) => (
              <div key={i} className="card p-4">
                <p className="text-sm font-medium break-words">{r.meeting}</p>
                <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>{new Date(r.date).toLocaleDateString()}</p>
                <div className="flex gap-4 mt-2 text-xs" style={{ color: "var(--color-muted)" }}>
                  <span>Expected: <strong style={{ color: "var(--color-ink)" }}>{r.expected_member_count}</strong></span>
                  <span>Absent w/ reason: <strong style={{ color: "var(--color-ink)" }}>{r.absent_with_reason_count}</strong></span>
                </div>
                {r.absent_without_reason_names.length > 0 && (
                  <p className="text-xs mt-1" style={{ color: "var(--color-red)" }}>Absent w/o reason: {r.absent_without_reason_names.join(", ")}</p>
                )}
              </div>
            ))}
            {(meetingData?.rows.length ?? 0) === 0 && <div className="card p-4"><EmptyState title="No completed meetings yet" /></div>}
          </div>
        </div>
      )}
    </div>
  );
}
