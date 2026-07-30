"use client";

import { use, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Badge, statusTone } from "@/components/ui";
import { Video, MapPin, CheckCircle2 } from "lucide-react";

interface MeetingDetail {
  meeting: {
    id: string; title: string; agenda: string | null; mode: string; location_or_link: string;
    starts_at: string; status: string; mom_notes: string | null;
    attendance_taker_id: string | null; mom_taker_id: string | null; created_by: string;
  };
  attendance: { user_id: string; name: string; present: number; absence_reason: string | null }[];
}

interface UserRow { id: string; name: string; authority: string; }

export default function MeetingDetailPage({ params }: { params: Promise<{ meetingID: string }> }) {
  const { meetingID } = use(params);
  const { user } = useAuth();
  
  const data: MeetingDetail = {
    meeting: {
      id: meetingID, title: "Sample meeting", agenda: null, mode: "online", location_or_link: "https://meet.google.com/",
      starts_at: new Date().toISOString(), status: "scheduled", mom_notes: null,
      attendance_taker_id: null, mom_taker_id: null, created_by: "",
    },
    attendance: [],
  };
  const mutate = () => {};
  const usersData: { users: UserRow[] } = { users: [] };
  const [mom, setMom] = useState("");
  const [savingMom, setSavingMom] = useState(false);
  const [attendanceDraft, setAttendanceDraft] = useState<Record<string, { present: boolean; reason: string }>>({});

  // Sync local editable state from server data exactly once per fresh load, using React's
  // sanctioned "adjust state during render" pattern (calling setState conditionally in the
  // render body, guarded by a tracked key) instead of an effect that calls setState — this
  // avoids the extra render-after-mount flash an effect would cause.
  const [syncedMomFor, setSyncedMomFor] = useState<string | null>(null);
  if (data && syncedMomFor !== data.meeting.id) {
    setMom(data.meeting.mom_notes ?? "");
    setSyncedMomFor(data.meeting.id);
  }

  const [syncedAttendanceFor, setSyncedAttendanceFor] = useState<string | null>(null);
  const attendanceSyncKey = usersData && data ? `${data.meeting.id}:${usersData.users.length}:${data.attendance.length}` : null;
  if (attendanceSyncKey && syncedAttendanceFor !== attendanceSyncKey && usersData) {
    const draft: Record<string, { present: boolean; reason: string }> = {};
    for (const u of usersData.users.filter((u) => u.authority !== "nonmember")) {
      const existing = data?.attendance.find((a) => a.user_id === u.id);
      draft[u.id] = { present: existing ? !!existing.present : false, reason: existing?.absence_reason ?? "" };
    }
    setAttendanceDraft(draft);
    setSyncedAttendanceFor(attendanceSyncKey);
  }

  if (!data) return <p className="text-sm" style={{ color: "var(--color-muted)" }}>Loading…</p>;

  const m = data.meeting;
  const canEdit = user && (user.id === m.attendance_taker_id || user.id === m.mom_taker_id || user.id === m.created_by || user.authority === "superadmin");

  async function saveMom() {
    setSavingMom(true);
    try {
      // TODO: Connect Backend API
      console.log("Backend integration pending", meetingID, { momNotes: mom });
      mutate();
    } finally {
      setSavingMom(false);
    }
  }

  async function saveAttendance() {
    const records = Object.entries(attendanceDraft).map(([userId, v]) => ({
      userId, present: v.present, absenceReason: v.present ? undefined : (v.reason || undefined),
    }));
    // TODO: Connect Backend API
    console.log("Backend integration pending", meetingID, { records });
    mutate();
  }

  async function endMeeting() {
    // TODO: Connect Backend API
    console.log("Backend integration pending", meetingID, "end meeting");
    mutate();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="card p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold break-words">{m.title}</h1>
            {m.agenda && <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>{m.agenda}</p>}
          </div>
          <Badge tone={statusTone(m.status)}>{m.status}</Badge>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-sm">
          <span className="flex items-center gap-1.5 min-w-0">
            {m.mode === "online" ? <Video size={15} className="shrink-0" /> : <MapPin size={15} className="shrink-0" />}
            {m.mode === "online" ? (
              <a href={m.location_or_link} target="_blank" rel="noreferrer" className="font-medium truncate" style={{ color: "var(--color-blue)" }}>Join meeting</a>
            ) : (
              <span className="truncate">{m.location_or_link}</span>
            )}
          </span>
          <span style={{ color: "var(--color-muted)" }}>{new Date(m.starts_at).toLocaleString()}</span>
        </div>
        {canEdit && m.status !== "completed" && (
          <button onClick={endMeeting} className="mt-4 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border" style={{ borderColor: "var(--color-line)" }}>
            <CheckCircle2 size={14} /> Mark as ended
          </button>
        )}
      </div>

      <div className="card p-5">
        <h2 className="text-sm font-semibold mb-2">Minutes of Meeting</h2>
        <textarea
          value={mom}
          onChange={(e) => setMom(e.target.value)}
          disabled={!canEdit}
          rows={6}
          placeholder={canEdit ? "Type MOM notes here…" : "No MOM recorded yet."}
          className="w-full rounded-lg border px-3 py-2 text-sm disabled:opacity-70"
          style={{ borderColor: "var(--color-line)" }}
        />
        {canEdit && (
          <button onClick={saveMom} disabled={savingMom} className="mt-2 rounded-lg px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60" style={{ background: "var(--color-blue)" }}>
            {savingMom ? "Saving…" : "Save MOM"}
          </button>
        )}
      </div>

      <div className="card p-5">
        <h2 className="text-sm font-semibold mb-3">Attendance</h2>
        <div className="space-y-1.5">
          {Object.entries(attendanceDraft).map(([userId, v]) => {
            const u = usersData?.users.find((x) => x.id === userId);
            if (!u) return null;
            return (
              <div key={userId} className="flex flex-wrap items-center gap-3 text-sm py-1">
                <span className="w-32 truncate">{u.name}</span>
                <label className="flex items-center gap-1 text-xs shrink-0">
                  <input type="checkbox" disabled={!canEdit} checked={v.present} onChange={(e) => setAttendanceDraft((d) => ({ ...d, [userId]: { ...d[userId], present: e.target.checked } }))} />
                  Present
                </label>
                {!v.present && (
                  <input
                    disabled={!canEdit}
                    placeholder="Absence reason (optional)"
                    value={v.reason}
                    onChange={(e) => setAttendanceDraft((d) => ({ ...d, [userId]: { ...d[userId], reason: e.target.value } }))}
                    className="flex-1 min-w-[140px] rounded border px-2 py-1 text-xs disabled:opacity-60"
                    style={{ borderColor: "var(--color-line)" }}
                  />
                )}
              </div>
            );
          })}
        </div>
        {canEdit && (
          <button onClick={saveAttendance} className="mt-3 rounded-lg px-3 py-1.5 text-xs font-medium text-white" style={{ background: "var(--color-blue)" }}>
            Save attendance
          </button>
        )}
      </div>
    </div>
  );
}
