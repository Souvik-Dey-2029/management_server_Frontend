"use client";

import { use, useState } from "react";
import { Badge } from "@/components/ui";

interface Field {
  id: string; label: string; field_type: string; options: string | null; required: number;
}

export default function FormFillPage({ params }: { params: Promise<{ formId: string }> }) {
  const { formId } = use(params);
  const data = {
    form: { id: formId, title: "Sample form", instructions: null, closes_at: new Date().toISOString(), is_expired: false },
    fields: [] as Field[],
    mySubmission: null,
  };
  const mutate = () => {};
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  if (!data) return <p className="text-sm" style={{ color: "var(--color-muted)" }}>Loading…</p>;

  const expired = data.form.is_expired;
  const alreadySubmitted = !!data.mySubmission || done;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      // TODO: Connect Backend API
      console.log("Backend integration pending", formId, answers);
      setDone(true);
      mutate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="card p-5">
        <div className="flex items-start justify-between">
          <h1 className="text-lg font-semibold">{data.form.title}</h1>
          {expired ? <Badge tone="red">Expired</Badge> : <Badge tone="green">Active</Badge>}
        </div>
        {/* F023: instructions */}
        {data.form.instructions && <p className="text-sm mt-2" style={{ color: "var(--color-muted)" }}>{data.form.instructions}</p>}
        <p className="text-xs mt-2" style={{ color: "var(--color-muted)" }}>Closes {new Date(data.form.closes_at).toLocaleString()}</p>
      </div>

      {alreadySubmitted && (
        <div className="card p-5 text-sm" style={{ color: "var(--color-green)" }}>
          You&apos;ve already submitted this form. Thank you!
        </div>
      )}

      {!alreadySubmitted && expired && (
        <div className="card p-5 text-sm" style={{ color: "var(--color-red)" }}>
          This form is no longer accepting submissions.
        </div>
      )}

      {!alreadySubmitted && !expired && (
        <form onSubmit={submit} className="card p-5 space-y-3">
          {error && <p className="text-sm rounded-lg px-3 py-2" style={{ background: "#fdecea", color: "var(--color-red)" }}>{error}</p>}
          {/* F022: dynamic form fields */}
          {data.fields.map((f) => (
            <div key={f.id}>
              <label className="text-xs font-medium block mb-1">
                {f.label} {f.required ? <span style={{ color: "var(--color-red)" }}>*</span> : null}
              </label>
              {f.field_type === "textarea" ? (
                <textarea required={!!f.required} rows={3} onChange={(e) => setAnswers((a) => ({ ...a, [f.id]: e.target.value }))} className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--color-line)" }} />
              ) : f.field_type === "select" ? (
                <select required={!!f.required} onChange={(e) => setAnswers((a) => ({ ...a, [f.id]: e.target.value }))} className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--color-line)" }}>
                  <option value="">Select…</option>
                  {(JSON.parse(f.options || "[]") as string[]).map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : f.field_type === "checkbox" ? (
                <input type="checkbox" onChange={(e) => setAnswers((a) => ({ ...a, [f.id]: e.target.checked ? "true" : "" }))} />
              ) : (
                <input
                  required={!!f.required}
                  type={f.field_type === "number" ? "number" : f.field_type === "date" ? "date" : "text"}
                  onChange={(e) => setAnswers((a) => ({ ...a, [f.id]: e.target.value }))}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  style={{ borderColor: "var(--color-line)" }}
                />
              )}
            </div>
          ))}
          <button type="submit" disabled={busy} className="w-full rounded-lg py-2 text-sm font-medium text-white disabled:opacity-60" style={{ background: "var(--color-blue)" }}>
            {busy ? "Submitting…" : "Submit form"}
          </button>
        </form>
      )}
    </div>
  );
}
