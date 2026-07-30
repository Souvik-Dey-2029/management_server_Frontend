"use client";

import { X } from "lucide-react";

export default function Modal({
  title,
  onClose,
  children,
  wide,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={onClose} />
      <div
        className={`relative shadow-xl w-full ${wide ? "sm:max-w-2xl" : "sm:max-w-md"} max-h-[88vh] sm:max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-xl animate-slide-up`}
        style={{ background: "var(--color-surface-container-lowest)", border: "1px solid var(--color-outline-variant)" }}
      >
        {/* Mobile drag-handle affordance, hinting this behaves like a sheet on small screens */}
        <div className="flex justify-center pt-2 sm:hidden">
          <span className="w-9 h-1 rounded-full" style={{ background: "var(--color-outline-variant)" }} />
        </div>
        <div className="flex items-center justify-between px-5 py-3 sm:py-4 border-b" style={{ borderColor: "var(--color-outline-variant)" }}>
          <h2 className="text-title-lg">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="p-2 -mr-2 rounded-full hover:bg-black/5">
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
