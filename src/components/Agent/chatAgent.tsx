"use client";

/**
 * Generic AI chat panel used by Creative, Productivity, and Shopping agents.
 * Each gets its own accent colour, icon, quick prompts, and agentType for the API.
 */

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Send } from "lucide-react";
import type { AgentType } from "@/types/agentTypes";

interface ChatAgentProps {
  agentType:   AgentType;
  accentHex:   string;
  label:       string;
  placeholder: string;
  quickAsk:    string[];
}

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatAgent({ agentType, accentHex, label, placeholder, quickAsk }: ChatAgentProps) {
  const [messages,  setMessages]  = useState<Msg[]>([]);
  const [input,     setInput]     = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || streaming) return;
    const userMsg: Msg = { role: "user", content };
    const history = [...messages, userMsg];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ messages: history, stream: true, agentType }),
      });
      const reader = res.body?.getReader();
      const dec    = new TextDecoder();
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        for (const line of dec.decode(value, { stream: true }).split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (raw === "[DONE]") break;
          try {
            const { text } = JSON.parse(raw);
            if (text) setMessages(prev => {
              const u = [...prev];
              u[u.length - 1] = { role: "assistant", content: u[u.length - 1].content + text };
              return u;
            });
          } catch { /* partial chunk */ }
        }
      }
    } catch {
      setMessages(prev => { const u = [...prev]; u[u.length - 1] = { role: "assistant", content: "Connection error. Please try again." }; return u; });
    } finally { setStreaming(false); }
  };

  return (
    <div className="text-xs text-white rounded-lg border overflow-hidden"
      style={{ borderColor: `${accentHex}30`, background: "#0d1117" }}>

      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/8">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentHex }} />
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: accentHex }}>
          {label}
        </span>
        {streaming && <span className="ml-auto text-[9px] text-gray-600 animate-pulse">Responding…</span>}
      </div>

      {/* Messages */}
      <div className="px-3 py-2 max-h-56 overflow-y-auto space-y-2 [&::-webkit-scrollbar]:hidden">
        {messages.length === 0 ? (
          <div className="space-y-1.5 py-1">
            <p className="text-[10px] text-gray-600 text-center mb-2">Try one of these or ask anything.</p>
            {quickAsk.map(q => (
              <button key={q} type="button" onClick={() => send(q)}
                className="w-full text-left text-[9px] text-gray-500 hover:text-white px-2 py-1.5 rounded-md border border-white/6 transition-all"
                style={{ borderColor: "rgba(255,255,255,0.06)" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = `${accentHex}40`)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}>
                {q}
              </button>
            ))}
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[88%] text-[10px] leading-relaxed px-2.5 py-1.5 rounded-xl ${
                m.role === "user" ? "text-white/90 rounded-br-sm" : "bg-white/6 text-gray-600 rounded-bl-sm"
              }`} style={m.role === "user" ? { backgroundColor: `${accentHex}25` } : {}}>
                {m.content || (streaming && i === messages.length - 1 &&
                  <span className="flex gap-0.5">{[0,1,2].map(j => <motion.span key={j} className="w-1 h-1 rounded-full bg-gray-500" animate={{ opacity: [0.3,1,0.3] }} transition={{ repeat: Infinity, duration: 1, delay: j * 0.2 }} />)}</span>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-1.5 px-2 py-2 border-t border-white/8">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); send(); } }}
          placeholder={placeholder}
          className="flex-1 text-[10px] bg-white/5 border border-white/8 rounded-lg px-2.5 py-1.5 text-white placeholder-gray-600 focus:outline-none transition-colors"
          style={{ ["--tw-ring-color" as string]: accentHex }}
          onFocus={e => (e.currentTarget.style.borderColor = `${accentHex}50`)}
          onBlur={e  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")} />
        <button type="button" onClick={() => send()} disabled={!input.trim() || streaming}
          className="flex h-7 w-7 items-center justify-center rounded-lg disabled:opacity-40 transition-opacity shrink-0"
          style={{ backgroundColor: accentHex }}>
          {streaming ? <Loader2 className="h-3 w-3 text-white animate-spin" /> : <Send className="h-3 w-3 text-white" />}
        </button>
      </div>
    </div>
  );
}
