"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Send, Bot, ExternalLink } from "lucide-react";

const CATEGORIES = [
  { emoji: "🔐", label: "Login & Account",    prompt: "I have an issue with my login or account access." },
  { emoji: "💳", label: "Payments & Wallet",  prompt: "I need help with payments, wallet, or escrow." },
  { emoji: "📋", label: "Posting a Project",  prompt: "I'm having trouble posting a project." },
  { emoji: "🤝", label: "Consultant Matching",prompt: "I need help with consultant matching or proposals." },
  { emoji: "🔔", label: "Notifications",      prompt: "I'm not receiving notifications or emails." },
  { emoji: "❓", label: "Other Issue",         prompt: "I have a general platform issue to report." },
];

type Msg = { role: "user" | "assistant"; content: string };

export default function SupportAgent() {
  const [messages,  setMessages]  = useState<Msg[]>([]);
  const [input,     setInput]     = useState("");
  const [streaming, setStreaming] = useState(false);
  const [started,   setStarted]   = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || streaming) return;
    if (!started) setStarted(true);
    const userMsg: Msg = { role: "user", content };
    const history = [...messages, userMsg];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ messages: history, stream: true, agentType: "support" }),
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
    <div className="space-y-3 text-xs text-white">

      {/* Category selector — show only before conversation starts */}
      {!started && (
        <div className="bg-[#0d1117] rounded-lg border border-white/8 overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-white/8">
            <span className="text-sm">🛠️</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#ef4444]">What do you need help with?</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 p-2">
            {CATEGORIES.map(c => (
              <button key={c.label} type="button" onClick={() => send(c.prompt)}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-white/8 hover:border-[#ef4444]/30 hover:bg-[#ef4444]/8 text-left transition-all group">
                <span className="text-sm">{c.emoji}</span>
                <span className="text-[9px] font-semibold text-gray-400 group-hover:text-white">{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat area */}
      <div className="bg-[#0d1117] rounded-lg border border-[#ef4444]/20 overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/8">
          <Bot className="h-3 w-3 text-[#ef4444]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#ef4444]">Support Agent</span>
          {streaming && <span className="ml-auto text-[9px] text-gray-600 animate-pulse">Responding…</span>}
          {!streaming && started && (
            <a href="/contact-sales" className="ml-auto text-[9px] text-gray-600 hover:text-[#ef4444] flex items-center gap-0.5 transition-colors">
              Escalate <ExternalLink className="h-2.5 w-2.5" />
            </a>
          )}
        </div>

        <div className="px-3 py-2 max-h-52 overflow-y-auto space-y-2 [&::-webkit-scrollbar]:hidden">
          {messages.length === 0 && (
            <p className="text-[10px] text-gray-600 text-center py-2">Select an issue category above or type your problem below.</p>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[88%] text-[10px] leading-relaxed px-2.5 py-1.5 rounded-xl ${
                m.role === "user" ? "bg-[#ef4444]/20 text-white/90 rounded-br-sm" : "bg-white/6 text-gray-300 rounded-bl-sm"
              }`}>
                {m.content || (streaming && i === messages.length - 1 &&
                  <span className="flex gap-0.5">{[0,1,2].map(j => <motion.span key={j} className="w-1 h-1 rounded-full bg-gray-500" animate={{ opacity: [0.3,1,0.3] }} transition={{ repeat: Infinity, duration: 1, delay: j * 0.2 }} />)}</span>
                )}
              </div>
            </div>
          ))}
          {started && messages.length >= 4 && (
            <div className="pt-1 border-t border-white/5">
              <p className="text-[9px] text-gray-600 text-center">
                Issue unresolved?{" "}
                <a href="/contact-sales" className="text-[#ef4444] hover:underline">Contact our team →</a>
              </p>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="flex items-center gap-1.5 px-2 py-2 border-t border-white/8">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); send(); } }}
            placeholder="Describe your issue…"
            className="flex-1 text-[10px] bg-white/5 border border-white/8 rounded-lg px-2.5 py-1.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#ef4444]/40 transition-colors" />
          <button type="button" onClick={() => send()} disabled={!input.trim() || streaming}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ef4444] disabled:opacity-40 transition-opacity shrink-0">
            {streaming ? <Loader2 className="h-3 w-3 text-white animate-spin" /> : <Send className="h-3 w-3 text-white" />}
          </button>
        </div>
      </div>
    </div>
  );
}
