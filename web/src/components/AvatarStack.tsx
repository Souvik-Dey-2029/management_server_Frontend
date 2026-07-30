const STACK_COLORS = ["#0058BD", "#B51B15", "#F9AB00", "#006E2C", "#8E24AA"];

export default function AvatarStack({ names, max = 3 }: { names: string[]; max?: number }) {
  if (names.length === 0) return <span className="text-xs" style={{ color: "var(--color-muted)" }}>Unassigned</span>;

  const shown = names.slice(0, max);
  const overflow = names.length - shown.length;

  return (
    <div className="flex items-center -space-x-2">
      {shown.map((name, i) => (
        <span
          key={name + i}
          title={name}
          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white ring-2"
          style={{ background: STACK_COLORS[i % STACK_COLORS.length], borderColor: "var(--color-surface-container-lowest)", boxShadow: "0 0 0 2px var(--color-surface-container-lowest)" }}
        >
          {name[0]?.toUpperCase()}
        </span>
      ))}
      {overflow > 0 && (
        <span
          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold"
          style={{ background: "var(--color-surface-container-high)", color: "var(--color-on-surface-variant)", boxShadow: "0 0 0 2px var(--color-surface-container-lowest)" }}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}
