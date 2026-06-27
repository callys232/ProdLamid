"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { FaPaperPlane, FaUserCircle, FaPaperclip } from "react-icons/fa";
import { AlertCircle, Loader2, MessageSquare } from "lucide-react";
import { toast } from "react-hot-toast";
import EmptyState from "@/components/ui/EmptyState";

interface Message {
  _id:      string;
  tempId?:  string;
  senderId: { _id: string; username: string; profileImage?: string } | string;
  message:  string;
  type:     string;
  sentAt:   string;
  status?:  "sending" | "sent" | "failed";
}

const senderName = (m: Message) =>
  typeof m.senderId === "object" ? m.senderId.username : "You";
const senderImg = (m: Message) =>
  typeof m.senderId === "object" ? m.senderId.profileImage : undefined;

export default function ChatSystem({ projectId }: { projectId: string }) {
  const [messages,   setMessages]   = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading,    setLoading]    = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [uploading,  setUploading]  = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef   = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/messages`, { credentials: "include" });
      if (!res.ok) { setFetchError(true); return; }
      const { data } = await res.json();
      if (Array.isArray(data)) setMessages(data);
      setFetchError(false);
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // SSE stream — zero polling overhead
  useEffect(() => {
    fetchMessages();

    const es = new EventSource(`/api/messages/stream?projectId=${projectId}`);

    es.onmessage = (event) => {
      try {
        const { type, data } = JSON.parse(event.data);
        if (type !== "new_message" || !data?._id) return;
        setMessages(prev => {
          const tempIdx = prev.findIndex(m => m.tempId && m.message === data.message);
          if (tempIdx !== -1) {
            const next = [...prev];
            next[tempIdx] = { ...data, status: "sent" };
            return next;
          }
          if (prev.some(m => m._id === data._id)) return prev;
          return [...prev, { ...data, status: "sent" }];
        });
      } catch { /* ignore malformed events */ }
    };

    es.onerror = () => {
      es.close();
      // Graceful degradation: slow fallback poll if SSE fails
      const t = setInterval(fetchMessages, 15_000);
      return () => clearInterval(t);
    };

    return () => es.close();
  }, [projectId, fetchMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = newMessage.trim();
    if (!text) return;

    const tempId = `tmp-${Date.now()}`;
    setMessages(prev => [...prev, {
      _id: tempId, tempId, message: text, type: "text",
      sentAt: new Date().toISOString(),
      senderId: { _id: "", username: "You" }, status: "sending",
    }]);
    setNewMessage("");

    try {
      const res = await fetch(`/api/projects/${projectId}/messages`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, type: "text" }),
      });
      if (!res.ok) throw new Error();
      setMessages(prev => prev.map(m => m.tempId === tempId ? { ...m, status: "sent", tempId: undefined } : m));
    } catch {
      setMessages(prev => prev.map(m => m.tempId === tempId ? { ...m, status: "failed" } : m));
      toast.error("Message failed to send");
    }
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("projectId", projectId);
      const res  = await fetch("/api/messages/upload", { method: "POST", credentials: "include", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      await fetch(`/api/projects/${projectId}/messages`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: `📎 [${file.name}](${data.url})`, type: "text", fileUrl: data.url }),
      });
      toast.success("File sent");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-black/40 rounded-2xl border border-white/5 overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
          </div>
        )}
        {fetchError && !loading && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-red-400">
            <AlertCircle className="h-6 w-6" />
            <p className="text-sm">Couldn't load messages.</p>
            <button onClick={fetchMessages} className="text-xs underline hover:text-white">Retry</button>
          </div>
        )}
        {!loading && !fetchError && messages.length === 0 && (
          <EmptyState icon={MessageSquare} title="No messages yet" description="Be the first to send a message." />
        )}

        {messages.map(msg => (
          <div key={msg._id} className={`flex gap-3 ${msg.type !== "text" ? "justify-center" : ""}`}>
            {msg.type === "text" ? (
              <>
                <div className="flex-shrink-0 mt-1">
                  {senderImg(msg)
                    ? <img src={senderImg(msg)} alt="" className="w-8 h-8 rounded-full border border-white/10 object-cover" />
                    : <FaUserCircle className="text-2xl text-gray-500" />}
                </div>
                <div className="max-w-[80%]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-gray-400">{senderName(msg)}</span>
                    <span className="text-[10px] text-gray-600">
                      {new Date(msg.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {msg.status === "sending" && <Loader2 className="h-2.5 w-2.5 animate-spin text-gray-600" />}
                    {msg.status === "failed"  && <AlertCircle className="h-2.5 w-2.5 text-red-400" />}
                  </div>
                  <div className={`rounded-2xl rounded-tl-none p-3 text-sm text-gray-200 border transition-colors ${
                    msg.status === "failed"
                      ? "bg-red-500/5 border-red-500/20"
                      : "bg-white/5 border-white/5"
                  } ${msg.status === "sending" ? "opacity-60" : ""}`}>
                    {msg.message}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-red-900/10 border border-red-900/20 text-red-500 text-[10px] uppercase font-bold tracking-widest px-4 py-1 rounded-full">
                {msg.type.replace("_", " ")}: {msg.message}
              </div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white/5 border-t border-white/10 flex gap-2">
        <input ref={fileRef} type="file" className="hidden"
          accept="image/*,application/pdf,.doc,.docx,.xlsx,.zip"
          onChange={handleFile} />
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
          className="p-3 text-gray-400 hover:text-white transition-colors disabled:opacity-50">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FaPaperclip />}
        </button>
        <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)}
          placeholder="Type your message…"
          className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-red-600 transition-all" />
        <button type="submit" disabled={!newMessage.trim()}
          className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all shadow-lg shadow-red-900/20 disabled:opacity-40">
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
}
