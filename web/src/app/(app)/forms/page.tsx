"use client";

import { useState } from "react";
import Link from "next/link";
import { atLeast, useAuth } from "@/components/AuthProvider";
import Modal from "@/components/Modal";
import { Badge, EmptyState } from "@/components/ui";
import { Plus, Trash2 } from "lucide-react";

type FieldType = "text" | "textarea" | "number" | "select" | "checkbox" | "date";
interface DraftField { label: string; fieldType: FieldType; options: string; required: boolean; }

interface FormRow {
  id: string; title: string; instructions: string | null; closes_at: string;
  is_expired: boolean; already_submitted: boolean;
}

export default function FormsPage() {
  const { user } = useAuth();
  const data = { forms: [] as FormRow[] };
  const mutate = () => {};
  const [showCreate, setShowCreate] = useState(false);

  const active = data?.forms.filter((f) => !f.is_expired) ?? [];
  const expired = data?.forms.filter((f) => f.is_expired) ?? [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Forms</h1>
        {atLeast(user?.authority, "admin") && (
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-white" style={{ background: "var(--color-blue)" }}>
            <Plus size={15} /> New form
          </button>
        )}
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-2">Active</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {active.map((f) => (
            <Link key={f.id} href={`/forms/${f.id}`} className="card p-4 hover:shadow-md transition-shadow">
              <p className="text-sm font-medium">{f.title}</p>
              {f.instructions && <p className="text-xs mt-1 line-clamp-2" style={{ color: "var(--color-muted)" }}>{f.instructions}</p>}
              <div className="flex items-center justify-between mt-3">
                <span className="text-[11px]" style={{ color: "var(--color-muted)" }}>Closes {new Date(f.closes_at).toLocaleDateString()}</span>
                {f.already_submitted && <Badge tone="green">Submitted</Badge>}
              </div>
            </Link>
          ))}
        </div>
        {active.length === 0 && <EmptyState title="No forms available" />}
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-2">Expired</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {expired.map((f) => (
            <Link key={f.id} href={`/forms/${f.id}`} className="card p-4 opacity-70">
              <p className="text-sm font-medium">{f.title}</p>
              <Badge tone="red">Expired</Badge>
            </Link>
          ))}
        </div>
        {expired.length === 0 && <p className="text-xs" style={{ color: "var(--color-muted)" }}>None yet.</p>}
      </div>

      {showCreate && <CreateFormModal onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); mutate(); }} />}
    </div>
  );
}

function CreateFormModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [closesAt, setClosesAt] = useState("");
  const [fields, setFields] = useState<DraftField[]>([{ label: "", fieldType: "text", options: "", required: true }]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function updateField(i: number, patch: Partial<DraftField>) {
    setFields((f) => f.map((field, idx) => (idx === i ? { ...field, ...patch } : field)));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      // TODO: Connect Backend API
      console.log("Backend integration pending", { title, instructions, closesAt, fields });
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create form");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title="Create form" onClose={onClose} wide>
      <form onSubmit={submit} className="space-y-3">
        {error && <p className="text-sm rounded-lg px-3 py-2" style={{ background: "#fdecea", color: "var(--color-red)" }}>{error}</p>}
        <div>
          <label className="text-xs font-medium block mb-1">Title</label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--color-line)" }} />
        </div>
        <div>
          <label className="text-xs font-medium block mb-1">Instructions</label>
          <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={2} className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--color-line)" }} />
        </div>
        <div>
          <label className="text-xs font-medium block mb-1">Closes at</label>
          <input required type="datetime-local" value={closesAt} onChange={(e) => setClosesAt(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--color-line)" }} />
        </div>

        <div>
          <label className="text-xs font-medium block mb-1">Fields</label>
          <div className="space-y-2">
            {fields.map((f, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-2 sm:items-start border rounded-lg p-2" style={{ borderColor: "var(--color-line)" }}>
                <input placeholder="Label" value={f.label} onChange={(e) => updateField(i, { label: e.target.value })} className="flex-1 rounded border px-2 py-1.5 text-sm" style={{ borderColor: "var(--color-line)" }} />
                <select value={f.fieldType} onChange={(e) => updateField(i, { fieldType: e.target.value as FieldType })} className="rounded border px-2 py-1.5 text-sm" style={{ borderColor: "var(--color-line)" }}>
                  <option value="text">Text</option>
                  <option value="textarea">Textarea</option>
                  <option value="number">Number</option>
                  <option value="select">Select</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="date">Date</option>
                </select>
                {f.fieldType === "select" && (
                  <input placeholder="Options, comma separated" value={f.options} onChange={(e) => updateField(i, { options: e.target.value })} className="flex-1 rounded border px-2 py-1.5 text-sm" style={{ borderColor: "var(--color-line)" }} />
                )}
                <button type="button" onClick={() => setFields((fs) => fs.filter((_, idx) => idx !== i))} className="p-1.5 text-red-500"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setFields((f) => [...f, { label: "", fieldType: "text", options: "", required: true }])} className="text-xs font-medium mt-2" style={{ color: "var(--color-blue)" }}>
            + Add field
          </button>
        </div>

        <button type="submit" disabled={busy} className="w-full rounded-lg py-2 text-sm font-medium text-white disabled:opacity-60" style={{ background: "var(--color-blue)" }}>
          {busy ? "Creating…" : "Create form"}
        </button>
      </form>
    </Modal>
  );
}
