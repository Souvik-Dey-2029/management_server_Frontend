"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { EmptyState } from "@/components/ui";
import { Send, Plus, ArrowLeft } from "lucide-react";
import Modal from "@/components/Modal";
import UserPicker from "@/components/UserPicker";

interface Conversation {
  id: string; name: string; last_message: string | null; last_message_at: string | null;
}
interface Message {
  id: string; sender_id: string; sender_name: string; content: string; created_at: string;
}

export default function ChatPage() {
  const convData = { conversations: [] as Conversation[] };
  const mutateConvs = () => {};
  const [manualActiveId, setManualActiveId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [mobileShowConversation, setMobileShowConversation] = useState(false);

  // Derived instead of effect-driven: default to the first conversation until the user
  // explicitly picks another one, without calling setState from inside an effect.
  const activeId = manualActiveId ?? convData?.conversations[0]?.id ?? null;
  const activeConversation = convData?.conversations.find((c) => c.id === activeId);

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex gap-4">
      {/* Conversation list: full-width on mobile until a chat is opened, always visible on md+ */}
      <div
        className={`w-full md:w-64 shrink-0 card overflow-y-auto ${mobileShowConversation ? "hidden md:block" : "block"}`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--color-line)" }}>
          <p className="text-sm font-semibold">Chats</p>
          <button onClick={() => setShowCreate(true)} className="p-1 rounded hover:bg-black/5" aria-label="New conversation"><Plus size={16} /></button>
        </div>
        {(convData?.conversations.length ?? 0) === 0 && <div className="p-4"><EmptyState title="No conversations yet" /></div>}
        {convData?.conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => { setManualActiveId(c.id); setMobileShowConversation(true); }}
            className="w-full text-left px-4 py-3 border-b last:border-0 hover:bg-black/5"
            style={{ borderColor: "var(--color-line)", background: activeId === c.id ? "#e8f0fe" : "transparent" }}
          >
            <p className="text-sm font-medium truncate">{c.name}</p>
            <p className="text-xs truncate" style={{ color: "var(--color-muted)" }}>{c.last_message ?? "No messages yet"}</p>
          </button>
        ))}
      </div>

      {/* Active conversation: hidden on mobile until one is selected, always visible on md+ */}
      <div className={`flex-1 card flex flex-col min-w-0 ${mobileShowConversation ? "flex" : "hidden md:flex"}`}>
        {activeId ? (
          <>
            <div className="flex items-center gap-2 px-3 py-2 border-b md:hidden" style={{ borderColor: "var(--color-line)" }}>
              <button onClick={() => setMobileShowConversation(false)} className="p-1 rounded hover:bg-black/5" aria-label="Back to chats">
                <ArrowLeft size={17} />
              </button>
              <p className="text-sm font-medium truncate">{activeConversation?.name}</p>
            </div>
            <ConversationView key={activeId} conversationId={activeId} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center"><EmptyState title="Select a conversation" /></div>
        )}
      </div>

      {showCreate && (
        <CreateConversationModal
          onClose={() => setShowCreate(false)}
          onCreated={(id) => { setShowCreate(false); mutateConvs(); setManualActiveId(id); setMobileShowConversation(true); }}
        />
      )}
    </div>
  );
}

function ConversationView({ conversationId }: { conversationId: string }) {
  const { user } = useAuth();
  const data = { messages: [] as Message[] };
  const mutate = () => {};
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data?.messages.length]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setText("");
    // TODO: Connect Backend API
    console.log("Backend integration pending", conversationId, text);
    mutate();
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {data?.messages.map((m) => {
          const mine = m.sender_id === user?.id;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className="max-w-xs">
                {!mine && <p className="text-[11px] mb-0.5" style={{ color: "var(--color-muted)" }}>{m.sender_name}</p>}
                <div
                  className="rounded-2xl px-3 py-2 text-sm"
                  style={{ background: mine ? "var(--color-blue)" : "#eef0f4", color: mine ? "white" : "var(--color-ink)" }}
                >
                  {m.content}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} className="flex items-center gap-2 p-3 border-t" style={{ borderColor: "var(--color-line)" }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 rounded-full border px-4 py-2 text-sm"
          style={{ borderColor: "var(--color-line)" }}
        />
        <button type="submit" className="p-2 rounded-full text-white" style={{ background: "var(--color-blue)" }}>
          <Send size={16} />
        </button>
      </form>
    </>
  );
}

function CreateConversationModal({ onClose, onCreated }: { onClose: () => void; onCreated: (id: string) => void }) {
  const [name, setName] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      // TODO: Connect Backend API
      console.log("Backend integration pending", { name, participantIds: participants });
      onCreated(`conv_${Date.now()}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title="New conversation" onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="text-xs font-medium block mb-1">Conversation name</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--color-line)" }} />
        </div>
        <div>
          <label className="text-xs font-medium block mb-1">Participants</label>
          <UserPicker selected={participants} onChange={setParticipants} />
        </div>
        <button type="submit" disabled={busy || participants.length === 0} className="w-full rounded-lg py-2 text-sm font-medium text-white disabled:opacity-60" style={{ background: "var(--color-blue)" }}>
          {busy ? "Creating…" : "Create"}
        </button>
      </form>
    </Modal>
  );
}
