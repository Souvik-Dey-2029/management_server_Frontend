export default function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
        borderRadius: "var(--radius-md)",
        background: "var(--color-surface-container-lowest)",
        border: "1px solid var(--color-outline-variant)",
      }}
      aria-hidden
    >
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24">
        {/* Four-color diamond mark — blue / red / yellow / green quadrants */}
        <path d="M12 1 L12 12 L1 12 Z" fill="var(--color-primary)" />
        <path d="M12 1 L23 12 L12 12 Z" fill="var(--color-tertiary)" />
        <path d="M12 23 L23 12 L12 12 Z" fill="var(--color-quaternary)" />
        <path d="M12 23 L1 12 L12 12 Z" fill="var(--color-secondary)" />
      </svg>
    </span>
  );
}
