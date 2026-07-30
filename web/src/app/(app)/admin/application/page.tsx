"use client";

import { Badge, EmptyState, statusTone } from "@/components/ui";

interface Application {
  id: string; type: string; reason: string; status: string; applicant_name: string; created_at: string;
}

export default function AdminApplicationPage() {
  const data = { applications: [] as Application[] };
  const mutate = () => {};

  async function decide(id: string, decision: "approve" | "reject") {
    // TODO: Connect Backend API
    console.log("Backend integration pending", id, decision);
    mutate();
  }

  const pending = data?.applications.filter((a) => a.status === "pending") ?? [];
  const decided = data?.applications.filter((a) => a.status !== "pending") ?? [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-lg font-semibold">Application review</h1>

      <div>
        <h2 className="text-sm font-semibold mb-2">Pending</h2>
        <div className="card divide-y" style={{ borderColor: "var(--color-line)" }}>
          {pending.map((a) => (
            <div key={a.id} className="p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium" style={{ color: "var(--color-muted)" }}>{a.applicant_name}</p>
                <p className="text-sm font-medium capitalize">{a.type} leave</p>
                <p className="text-sm mt-0.5" style={{ color: "var(--color-muted)" }}>{a.reason}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => decide(a.id, "approve")} className="text-xs font-medium px-3 py-1.5 rounded-full text-white" style={{ background: "var(--color-green)" }}>Approve</button>
                <button onClick={() => decide(a.id, "reject")} className="text-xs font-medium px-3 py-1.5 rounded-full text-white" style={{ background: "var(--color-red)" }}>Reject</button>
              </div>
            </div>
          ))}
          {pending.length === 0 && <EmptyState title="No pending applications" />}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-2">History</h2>
        <div className="card divide-y" style={{ borderColor: "var(--color-line)" }}>
          {decided.map((a) => (
            <div key={a.id} className="p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium" style={{ color: "var(--color-muted)" }}>{a.applicant_name}</p>
                <p className="text-sm capitalize">{a.type} leave — {a.reason}</p>
              </div>
              <Badge tone={statusTone(a.status)}>{a.status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
