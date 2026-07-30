"use client";


interface UserRow {
  id: string;
  name: string;
  domain: string | null;
  authority: string;
}

export default function UserPicker({
  selected,
  onChange,
  multiple = true,
}: {
  selected: string[];
  onChange: (ids: string[]) => void;
  multiple?: boolean;
}) {
  const users: UserRow[] = [];

  function toggle(id: string) {
    if (!multiple) {
      onChange([id]);
      return;
    }
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  }

  return (
    <div className="border rounded-lg max-h-48 overflow-y-auto" style={{ borderColor: "var(--color-line)" }}>
      {users.map((u) => (
        <label
          key={u.id}
          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-black/5 cursor-pointer border-b last:border-0"
          style={{ borderColor: "var(--color-line)" }}
        >
          <input
            type={multiple ? "checkbox" : "radio"}
            checked={selected.includes(u.id)}
            onChange={() => toggle(u.id)}
          />
          <span>{u.name}</span>
          <span className="text-xs ml-auto" style={{ color: "var(--color-muted)" }}>{u.domain ?? "—"}</span>
        </label>
      ))}
      {users.length === 0 && <p className="px-3 py-3 text-xs" style={{ color: "var(--color-muted)" }}>No members found.</p>}
    </div>
  );
}
