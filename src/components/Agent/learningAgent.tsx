"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronRight, Loader2, Send, Bot, ExternalLink } from "lucide-react";

const LAMID_LEARNING_URL = "https://learn-by-lamid.vercel.app/";

const PROGRAMMES = [
  { emoji: "🎯", title: "Strategic Leadership Excellence",    duration: "6 weeks", format: "Cohort",     level: "Senior",     href: LAMID_LEARNING_URL },
  { emoji: "🤖", title: "AI Literacy for Business",          duration: "4 weeks", format: "Self-paced", level: "All",        href: LAMID_LEARNING_URL },
  { emoji: "📊", title: "Financial Acumen & Management",     duration: "5 weeks", format: "Cohort",     level: "Mid-Senior", href: LAMID_LEARNING_URL },
  { emoji: "🔄", title: "Organisational Design & Change",    duration: "6 weeks", format: "Cohort",     level: "HR Leaders", href: LAMID_LEARNING_URL },
  { emoji: "📈", title: "Sales Growth & Revenue Optimisation", duration: "4 weeks", format: "Self-paced", level: "Commercial", href: LAMID_LEARNING_URL },
  { emoji: "⚙️", title: "Operational Excellence",            duration: "5 weeks", format: "Cohort",     level: "Operations", href: LAMID_LEARNING_URL },
];

const QUICK_ASKS = [
  "Which programme is right for me?",
  "How does AI-personalised learning work?",
  "What certifications do I get?",
  "How is mentorship matching done?",
];

type Msg = { role: "user" | "assistant"; content: string };

export default function LearningAgent() {
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
        body:    JSON.stringify({ messages: history, stream: true, agentType: "learning" }),
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
      {/* Programme grid */}
      <div className="bg-[#0d1117] rounded-lg border border-white/8 overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/8">
          <BookOpen className="h-3 w-3 text-[#06b6d4]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#06b6d4]">Learning Programmes</span>
          <a href={LAMID_LEARNING_URL} target="_blank" rel="noopener noreferrer"
            className="ml-auto text-[9px] text-gray-600 hover:text-[#06b6d4] flex items-center gap-0.5 transition-colors">
            Open LAMID Learning <ExternalLink className="h-2.5 w-2.5" />
          </a>
        </div>
        <div className="divide-y divide-white/5">
          {PROGRAMMES.map((p) => (
            <a key={p.title} href={p.href}
              className="flex items-center gap-2.5 px-3 py-2 hover:bg-[#06b6d4]/8 transition-colors group">
              <span className="text-sm">{p.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-gray-200 truncate group-hover:text-white">{p.title}</p>
                <p className="text-[9px] text-gray-600">{p.duration} · {p.format} · {p.level}</p>
              </div>
              <ChevronRight className="h-3 w-3 text-gray-700 group-hover:text-[#06b6d4] flex-shrink-0 transition-colors" />
            </a>
          ))}
        </div>
      </div>

      {/* AI Advisor */}
      <div className="bg-[#0d1117] rounded-lg border border-[#06b6d4]/20 overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/8">
          <Bot className="h-3 w-3 text-[#06b6d4]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#06b6d4]">Learning Coach AI</span>
          {streaming && <span className="ml-auto text-[9px] text-gray-600 animate-pulse">Responding…</span>}
        </div>

        {/* Chat area */}
        <div className="px-3 py-2 max-h-44 overflow-y-auto space-y-2 [&::-webkit-scrollbar]:hidden">
          {messages.length === 0 ? (
            <div className="space-y-1.5">
              <p className="text-[10px] text-gray-600 text-center py-1">Ask about courses, certifications, or learning paths.</p>
              {QUICK_ASKS.map(q => (
                <button key={q} type="button" onClick={() => send(q)}
                  className="w-full text-left text-[9px] text-gray-500 hover:text-white px-2 py-1.5 rounded-md border border-white/6 hover:border-[#06b6d4]/30 hover:bg-[#06b6d4]/6 transition-all">
                  {q}
                </button>
              ))}
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[88%] text-[10px] leading-relaxed px-2.5 py-1.5 rounded-xl ${
                  m.role === "user" ? "bg-[#06b6d4]/20 text-white/90 rounded-br-sm" : "bg-white/6 text-gray-300 rounded-bl-sm"
                }`}>
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
            placeholder="Ask the Learning Coach…"
            className="flex-1 text-[10px] bg-white/5 border border-white/8 rounded-lg px-2.5 py-1.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#06b6d4]/40 transition-colors" />
          <button type="button" onClick={() => send()} disabled={!input.trim() || streaming}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#06b6d4] disabled:opacity-40 transition-opacity shrink-0">
            {streaming ? <Loader2 className="h-3 w-3 text-white animate-spin" /> : <Send className="h-3 w-3 text-white" />}
          </button>
        </div>
      </div>
    </div>
  );
}
