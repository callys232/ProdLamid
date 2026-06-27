"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export interface ChatMessage {
  _id: string;
  projectId: string;
  senderId: string;
  message: string;
  type: string;
  createdAt?: string;
  readBy?: string[];
  [key: string]: unknown;
}

interface UseMessagesOptions {
  projectId: string | null;
  enabled?: boolean;
}

export function useMessages({ projectId, enabled = true }: UseMessagesOptions) {
  const [messages, setMessages]   = useState<ChatMessage[]>([]);
  const [loading, setLoading]     = useState(false);
  const [sending, setSending]     = useState(false);
  const esRef = useRef<EventSource | null>(null);

  // ── Initial fetch ────────────────────────────────────────────────
  const fetchMessages = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/messages?projectId=${projectId}`);
      if (res.ok) {
        const { data } = await res.json();
        setMessages(data ?? []);
      }
    } catch (e) {
      console.error("useMessages fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // ── SSE subscription ─────────────────────────────────────────────
  useEffect(() => {
    if (!projectId || !enabled) return;

    fetchMessages();

    // Close any existing connection before opening a new one
    esRef.current?.close();

    const es = new EventSource(`/api/messages/stream?projectId=${projectId}`);
    esRef.current = es;

    es.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === "new_message" && payload.data) {
          setMessages((prev) => {
            // Deduplicate by _id
            if (prev.some((m) => m._id === payload.data._id)) return prev;
            return [...prev, payload.data];
          });
        }
      } catch {}
    };

    es.onerror = () => {
      // Browser will auto-reconnect; close and let it retry
      es.close();
    };

    return () => {
      es.close();
      esRef.current = null;
    };
  }, [projectId, enabled, fetchMessages]);

  // ── Send message ─────────────────────────────────────────────────
  const sendMessage = useCallback(async (text: string, recipient?: string) => {
    if (!projectId || !text.trim()) return;
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ projectId, message: text, recipient }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message ?? "Failed to send");
      }
      // Optimistic: SSE will confirm; fallback append if SSE misses it
      const { data } = await res.json();
      setMessages((prev) => prev.some((m) => m._id === data._id) ? prev : [...prev, data]);
    } finally {
      setSending(false);
    }
  }, [projectId]);

  return { messages, loading, sending, sendMessage, refetch: fetchMessages };
}
