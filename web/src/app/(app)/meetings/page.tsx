"use client";

import { useState } from "react";
import Link from "next/link";
import { atLeast, useAuth } from "@/components/AuthProvider";
import Modal from "@/components/Modal";
import UserPicker from "@/components/UserPicker";
import { EmptyState } from "@/components/ui";
import { Plus, MapPin, Video, Search } from "lucide-react";

interface Meeting {
  id: string;
  title: string;
  agenda: string | null;
  mode: string;
  location_or_link: string;
  starts_at: string;
  effective_status: string;
  batch: string | null;
  domain: string | null;
}

export default function MeetingsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const data = { meetings: [] as Meeting[] };
  const mutate = () => {};
  const [showCreate, setShowCreate] = useState(false);

  const meetings = (data?.meetings ?? []).filter(
    (m) => !query || m.title.toLowerCase().includes(query.toLowerCase()) || (m.agenda ?? "").toLowerCase().includes(query.toLowerCase())
  );

  const accentFor = (status: string) =>
    status === "ongoing" ? "var(--color-secondary)" : status === "completed" ? "var(--color-outline)" : "var(--color-primary)";

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-lg font-semibold">Meetings</h1>
        {atLeast(user?.authority, "admin") && (
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-white shrink-0" style={{ background: "var(--color-blue)" }}>
            <Plus size={15} /> <span className="hidden sm:inline">New meeting</span>
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        {/* F014: filters */}
        <div className="flex gap-2 flex-wrap">
          {["all", "upcoming", "ongoing", "completed"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className="text-xs px-3 py-1.5 rounded-full border capitalize"
              style={{ borderColor: "var(--color-line)", background: filter === s ? "var(--color-blue)" : "transparent", color: filter === s ? "white" : "var(--color-ink)" }}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="relative sm:ml-auto">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-muted)" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search meetings..."
            className="w-full sm:w-64 rounded-lg border pl-9 pr-3 py-2 text-sm"
            style={{ borderColor: "var(--color-line)", background: "var(--color-surface-container-lowest)" }}
          />
        </div>
      </div>

      {/* F012: meeting cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {meetings.map((m) => (
          <Link
            key={m.id}
            href={`/meetings/${m.id}`}
            className="card p-4 pl-4 relative overflow-hidden"
            style={{ borderLeftWidth: 3, borderLeftColor: accentFor(m.effective_status) }}
          >
            <p className="label-sm font-semibold tracking-wide" style={{ color: accentFor(m.effective_status) }}>
              {m.effective_status.toUpperCase()}
            </p>
            <p className="text-sm font-semibold mt-1">{m.title}</p>
            {m.agenda && <p className="text-xs mt-1.5 line-clamp-2" style={{ color: "var(--color-muted)" }}>{m.agenda}</p>}
            <div className="flex items-center gap-1.5 mt-3 text-xs" style={{ color: "var(--color-muted)" }}>
              {m.mode === "online" ? <Video size={13} /> : <MapPin size={13} />}
              {m.mode === "online" ? "Online" : "Offline"}
            </div>
            <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>
              {new Date(m.starts_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
            </p>
          </Link>
        ))}
      </div>
      {meetings.length === 0 && <EmptyState title="No meetings yet" />}

      {showCreate && <CreateMeetingModal onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); mutate(); }} />}
    </div>
  );
}

function CreateMeetingModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [agenda, setAgenda] = useState("");
  const [mode, setMode] = useState<"online" | "offline">("online");
  const [locationOrLink, setLocationOrLink] = useState("");
  const [batch, setBatch] = useState("");
  const [domain, setDomain] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [attendanceTaker, setAttendanceTaker] = useState<string[]>([]);
  const [momTaker, setMomTaker] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      // TODO: Connect Backend API
      console.log("Backend integration pending", {
        title, agenda, mode, locationOrLink, batch, domain, startsAt, attendanceTaker, momTaker,
      });
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create meeting");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title="Create meeting" onClose={onClose} wide>
      <form onSubmit={submit} className="space-y-3">
        {error && <p className="text-sm rounded-lg px-3 py-2" style={{ background: "#fdecea", color: "var(--color-red)" }}>{error}</p>}
        <div>
          <label className="text-xs font-medium block mb-1">Meeting title</label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--color-line)" }} />
        </div>
        <div>
          <label className="text-xs font-medium block mb-1">Agenda</label>
          <textarea value={agenda} onChange={(e) => setAgenda(e.target.value)} rows={2} className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--color-line)" }} />
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setMode("online")} className="text-xs px-3 py-1.5 rounded-full border" style={{ borderColor: "var(--color-line)", background: mode === "online" ? "var(--color-blue)" : "transparent", color: mode === "online" ? "white" : "var(--color-ink)" }}>Online</button>
          <button type="button" onClick={() => setMode("offline")} className="text-xs px-3 py-1.5 rounded-full border" style={{ borderColor: "var(--color-line)", background: mode === "offline" ? "var(--color-blue)" : "transparent", color: mode === "offline" ? "white" : "var(--color-ink)" }}>Offline</button>
        </div>
        <div>
          <label className="text-xs font-medium block mb-1">{mode === "online" ? "Meeting link" : "Location"}</label>
          <input required value={locationOrLink} onChange={(e) => setLocationOrLink(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--color-line)" }} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium block mb-1">Batch filter (optional)</label>
            <input value={batch} onChange={(e) => setBatch(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--color-line)" }} />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1">Domain filter (optional)</label>
            <input value={domain} onChange={(e) => setDomain(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--color-line)" }} />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium block mb-1">Start date &amp; time</label>
          <input required type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--color-line)" }} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium block mb-1">Attendance taker</label>
            <UserPicker selected={attendanceTaker} onChange={setAttendanceTaker} multiple={false} />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1">MOM taker</label>
            <UserPicker selected={momTaker} onChange={setMomTaker} multiple={false} />
          </div>
        </div>
        <button type="submit" disabled={busy} className="w-full rounded-lg py-2 text-sm font-medium text-white disabled:opacity-60" style={{ background: "var(--color-blue)" }}>
          {busy ? "Creating…" : "Create meeting"}
        </button>
      </form>
    </Modal>
  );
}
