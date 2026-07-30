"use client";

import { useState } from "react";
import { atLeast, useAuth } from "@/components/AuthProvider";
import Modal from "@/components/Modal";
import { Badge, EmptyState } from "@/components/ui";
import { Plus, FileText, Download, Lock } from "lucide-react";

interface Asset {
  id: string; title: string; description: string | null; category: string;
  access_level: string; external_url: string | null; mime_type: string | null;
}

export default function RepositoryPage() {
  const { user } = useAuth();
  const data = { assets: [] };
  const mutate = () => {};
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Repository</h1>
        {atLeast(user?.authority, "member") && (
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-white" style={{ background: "var(--color-blue)" }}>
            <Plus size={15} /> Add asset
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.assets.map((a: Asset) => (
          <div key={a.id} className="card p-4">
            <div className="flex items-start justify-between">
              <FileText size={18} style={{ color: "var(--color-blue)" }} />
              <Badge tone={a.category === "gd" ? "blue" : a.category === "vd" ? "green" : "neutral"}>{a.category.toUpperCase()}</Badge>
            </div>
            <p className="text-sm font-medium mt-2">{a.title}</p>
            {a.description && <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>{a.description}</p>}
            <div className="flex items-center justify-between mt-3">
              <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--color-muted)" }}>
                <Lock size={11} /> {a.access_level}
              </span>
              <a href="#" onClick={(e) => { e.preventDefault(); console.log("Backend integration pending"); }} className="flex items-center gap-1 text-xs font-medium" style={{ color: "var(--color-blue)" }}>
                <Download size={13} /> Open
              </a>
            </div>
          </div>
        ))}
      </div>
      {(data?.assets.length ?? 0) === 0 && <EmptyState title="Repository is empty" body="Essential GD/VD assets and documents will appear here." />}

      {showAdd && <AddAssetModal onClose={() => setShowAdd(false)} onDone={() => { setShowAdd(false); mutate(); }} />}
    </div>
  );
}

function AddAssetModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"gd" | "vd" | "general" | "document">("general");
  const [accessLevel, setAccessLevel] = useState<"public" | "member" | "admin">("member");
  const [externalUrl, setExternalUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      // TODO: Connect Backend API
      console.log("Backend integration pending", { title, description, category, accessLevel, externalUrl });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add asset");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title="Add repository asset" onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        {error && <p className="text-sm rounded-lg px-3 py-2" style={{ background: "#fdecea", color: "var(--color-red)" }}>{error}</p>}
        <div>
          <label className="text-xs font-medium block mb-1">Title</label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--color-line)" }} />
        </div>
        <div>
          <label className="text-xs font-medium block mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--color-line)" }} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium block mb-1">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as typeof category)} className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--color-line)" }}>
              <option value="gd">GD (Graphic Design)</option>
              <option value="vd">VD (Video Design)</option>
              <option value="document">Document</option>
              <option value="general">General</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium block mb-1">Access level</label>
            <select value={accessLevel} onChange={(e) => setAccessLevel(e.target.value as typeof accessLevel)} className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--color-line)" }}>
              <option value="public">Public</option>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium block mb-1">External URL (YouTube, Drive, etc.)</label>
          <input type="url" required value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} placeholder="https://" className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--color-line)" }} />
          <p className="text-[11px] mt-1" style={{ color: "var(--color-muted)" }}>
            Direct file upload is supported by the API for small files (see docs) — this form uses external links to keep large media out of the database, per the storage architecture.
          </p>
        </div>
        <button type="submit" disabled={busy} className="w-full rounded-lg py-2 text-sm font-medium text-white disabled:opacity-60" style={{ background: "var(--color-blue)" }}>
          {busy ? "Adding…" : "Add asset"}
        </button>
      </form>
    </Modal>
  );
}
