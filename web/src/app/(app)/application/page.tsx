"use client";

import { useState } from "react";
import { atLeast, useAuth } from "@/components/AuthProvider";
import { Badge, EmptyState, statusTone } from "@/components/ui";
import { Plus } from "lucide-react";
import Modal from "@/components/Modal";

interface Application {
  id: string; type: string; reason: string; status: string; start_date: string | null; end_date: string | null;
  applicant_name?: string; created_at: string;
}

export default function ApplicationPage() {
  const { user } = useAuth();
  const data = { applications: [] as Application[] };
  const mutate = () => {};
  const [showCreate, setShowCreate] = useState(false);

  async function decide(id: string, decision: "approve" | "reject") {
    // TODO: Connect Backend API
    console.log("Backend integration pending", id, decision);
    mutate();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Leave applications</h1>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-white" style={{ background: "var(--color-blue)" }}>
          <Plus size={15} /> Apply
        </button>
      </div>

      <div className="card divide-y" style={{ borderColor: "var(--color-line)" }}>
        {data?.applications.map((a) => (
          <div key={a.id} className="p-4 flex items-center justify-between gap-4" style={{ borderColor: "var(--color-line)" }}>
            <div>
              {a.applicant_name && <p className="text-xs font-medium" style={{ color: "var(--color-muted)" }}>{a.applicant_name}</p>}
              <p className="text-sm font-medium capitalize">{a.type} leave</p>
              <p className="text-sm mt-0.5" style={{ color: "var(--color-muted)" }}>{a.reason}</p>
              {a.start_date && <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>{a.start_date.slice(0,10)} → {a.end_date?.slice(0,10)}</p>}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge tone={statusTone(a.status)}>{a.status}</Badge>
              {atLeast(user?.authority, "admin") && a.status === "pending" && (
                <>
                  <button onClick={() => decide(a.id, "approve")} className="text-xs font-medium" style={{ color: "var(--color-green)" }}>Approve</button>
                  <button onClick={() => decide(a.id, "reject")} className="text-xs font-medium" style={{ color: "var(--color-red)" }}>Reject</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      {(data?.applications.length ?? 0) === 0 && <EmptyState title="No leave applications" />}

      {showCreate && <ApplyModal onClose={() => setShowCreate(false)} onDone={() => { setShowCreate(false); mutate(); }} />}
    </div>
  );
}

function ApplyModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [type, setType] = useState<"period" | "meeting" | "task">("period");
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      // TODO: Connect Backend API
      console.log("Backend integration pending", { type, reason, startDate, endDate });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to apply");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title="Apply for leave" onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        {error && <p className="text-sm rounded-lg px-3 py-2" style={{ background: "#fdecea", color: "var(--color-red)" }}>{error}</p>}
        <div>
          <label className="text-xs font-medium block mb-1">Leave type</label>
          <div className="flex gap-2">
            {(["period", "meeting", "task"] as const).map((t) => (
              <button key={t} type="button" onClick={() => setType(t)} className="text-xs px-3 py-1.5 rounded-full border capitalize" style={{ borderColor: "var(--color-line)", background: type === t ? "var(--color-blue)" : "transparent", color: type === t ? "white" : "var(--color-ink)" }}>{t}</button>
            ))}
          </div>
        </div>
        {type === "period" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium block mb-1">Start date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--color-line)" }} />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">End date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--color-line)" }} />
            </div>
          </div>
        )}
        <div>
          <label className="text-xs font-medium block mb-1">Reason</label>
          <textarea required value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--color-line)" }} />
        </div>
        <button type="submit" disabled={busy} className="w-full rounded-lg py-2 text-sm font-medium text-white disabled:opacity-60" style={{ background: "var(--color-blue)" }}>
          {busy ? "Submitting…" : "Submit application"}
        </button>
      </form>
    </Modal>
  );
}
