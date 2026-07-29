"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Mic, MicOff, Minus, X, Send, Bot } from "lucide-react";
import type { AgentType } from "@/types/agentTypes";
import { LOCKED_AGENTS, ADMIN_AGENTS } from "@/types/agentTypes";
import { routeIntent } from "./intentRouter";
import AgentSwitcher from "./agentSwitcher";
import LockedMessage from "./lockedMessage";
import ProjectAgent from "./project/projectAgent";
import LearningAgent from "./learningAgent";
import SupportAgent from "./supportAgent";
import ChatAgent from "./chatAgent";
import AnalyticsAgent from "./analyticsAgent";

/* ── Types ───────────────────────────────────────────────────── */
interface ChatMessage {
  id:        string;
  text:      string;
  sender:    "bot" | "user";
  timestamp: string;
  streaming?: boolean;
}

interface AuthUser {
  name:    string;
  role:    string;
  userId:  string;
}

interface SpeechRecognitionEvent {
  results: { [i: number]: { [i: number]: { transcript: string } } };
}
interface ISpeechRecognition extends EventTarget {
  lang: string; interimResults: boolean; maxAlternatives: number;
  start(): void; stop(): void;
  onstart:  (() => void) | null;
  onend:    (() => void) | null;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
}
declare global {
  interface Window {
    SpeechRecognition?: new () => ISpeechRecognition;
    webkitSpeechRecognition?: new () => ISpeechRecognition;
  }
}

const STORAGE_KEY = "lamid_agent_history";
const MAX_STORED  = 30;

function ts() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const AGENT_LABELS: Record<AgentType, string> = {
  onboarding:    "Onboarding Assistant",
  project:       "Project Agent",
  analytics:     "Analytics Agent",
  communication: "Communication Agent",
  learning:      "Learning Agent",
  support:       "Support Agent",
  creative:      "Creative Agent",
  productivity:  "Productivity Agent",
  shopping:      "Shopping Agent",
  outreach:      "Outreach & SEO",
};

/* ── Component ───────────────────────────────────────────────── */
export default function AIAgent() {
  const router = useRouter();

  // ── Auth (real) ──────────────────────────────────────────────
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.data) {
          setUser({
            name:   d.data.username ?? d.data.name ?? "there",
            role:   d.data.role    ?? "client",
            userId: d.data._id    ?? d.data.id ?? "",
          });
        }
      })
      .catch(() => {});
  }, []);

  const isSignedIn = !!user;
  const isAdmin    = user?.role === "admin";

  // ── Persist chat history in localStorage ─────────────────────
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory.slice(-MAX_STORED)));
    } catch { /* storage full — silent */ }
  }, [chatHistory]);

  // ── UI state ─────────────────────────────────────────────────
  const [activeAgent,  setActiveAgent]  = useState<AgentType>("onboarding");
  const [isOpen,       setIsOpen]       = useState(false);
  const [isMinimized,  setIsMinimized]  = useState(false);
  const [isStreaming,  setIsStreaming]  = useState(false);
  const [isListening,  setIsListening]  = useState(false);
  const [input,        setInput]        = useState("");
  const [lockedAgent,  setLockedAgent]  = useState<AgentType | null>(null);

  const chatEndRef    = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const inputRef       = useRef<HTMLInputElement | null>(null);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // ── Speech recognition ───────────────────────────────────────
  // Wrap handleMessage in useCallback so recognition.onresult
  // always references the latest closure (fixes stale closure bug)
  const handleMessage = useCallback(async (msg: string) => {
    const trimmed = msg.trim();
    if (!trimmed || isStreaming) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(), text: trimmed, sender: "user", timestamp: ts(),
    };
    setChatHistory(prev => [...prev, userMsg]);
    setInput("");

    // Intent routing
    const route = routeIntent(trimmed);
    if (route && route.agent !== activeAgent) {
      setActiveAgent(route.agent);
      setChatHistory(prev => [...prev, {
        id: crypto.randomUUID(), text: route.message, sender: "bot", timestamp: ts(),
      }]);
      return;
    }

    // Streaming AI response
    const botId = crypto.randomUUID();
    setChatHistory(prev => [...prev, { id: botId, text: "", sender: "bot", timestamp: ts(), streaming: true }]);
    setIsStreaming(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          stream:    true,
          agentType: activeAgent,
          messages:  [...chatHistory, userMsg].map(m => ({
            role:    m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });

      if (!res.ok || !res.body) throw new Error("Stream unavailable");

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let   full    = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const lines = decoder.decode(value).split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") break;
          try {
            const { text } = JSON.parse(payload);
            if (text) {
              full += text;
              setChatHistory(prev =>
                prev.map(m => m.id === botId ? { ...m, text: full } : m)
              );
            }
          } catch { /* partial chunk */ }
        }
      }

      // Finalise — remove streaming flag
      setChatHistory(prev => prev.map(m => m.id === botId ? { ...m, streaming: false } : m));
    } catch {
      setChatHistory(prev => prev.map(m =>
        m.id === botId ? { ...m, text: "Connection issue — please try again shortly.", streaming: false } : m
      ));
    } finally {
      setIsStreaming(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatHistory, isStreaming, activeAgent]);

  // Wire speech recognition with stable ref
  const handleMessageRef = useRef(handleMessage);
  useEffect(() => { handleMessageRef.current = handleMessage; }, [handleMessage]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Ctor) return;

    const rec = new Ctor();
    rec.lang = "en-US"; rec.interimResults = false; rec.maxAlternatives = 1;
    rec.onstart = () => setIsListening(true);
    rec.onend   = () => setIsListening(false);
    rec.onresult = (e) => handleMessageRef.current(e.results[0][0].transcript);
    recognitionRef.current = rec;
  }, []); // only runs once — stale closure fixed via ref above

  // ── Agent switching with guards ──────────────────────────────
  const handleSwitchAgent = (agent: AgentType) => {
    if (ADMIN_AGENTS.includes(agent) && !isAdmin) {
      setLockedAgent(agent);
      return;
    }
    if (LOCKED_AGENTS.includes(agent) && !isSignedIn) {
      setLockedAgent(agent);
      return;
    }
    setActiveAgent(agent);
  };

  const clearHistory = () => {
    setChatHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  // ── Render ───────────────────────────────────────────────────
  const label = AGENT_LABELS[activeAgent] ?? "Lamid AI";

  return (
    <>
      {/* Floating trigger */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="trigger"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => { setIsOpen(true); setIsMinimized(false); }}
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] rounded-full flex items-center justify-center shadow-[0_4px_24px_rgba(37,99,235,0.45)] z-40"
            aria-label="Open Lamid AI"
          >
            <img src="/aibot.png" alt="" className="w-8 h-8" onError={e => { (e.target as HTMLImageElement).style.display="none"; }} />
            <Bot className="w-6 h-6 text-white hidden" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat modal */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.33, 1, 0.68, 1] as const }}
            className="fixed bottom-6 right-6 w-[92%] sm:w-[420px] max-h-[82vh] bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.8)] flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 flex-shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white leading-none truncate">{label}</p>
                <p className="text-[10px] text-white/60 mt-0.5">
                  {user ? `Hi, ${user.name}` : "Lamid AI — sign in to unlock all agents"}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => recognitionRef.current?.start()}
                  className={`p-1.5 rounded-lg transition-colors ${isListening ? "bg-white/30" : "bg-white/10 hover:bg-white/20"}`}
                  title="Voice input"
                >
                  {isListening ? <MicOff className="h-3.5 w-3.5 text-white" /> : <Mic className="h-3.5 w-3.5 text-white" />}
                </button>
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  title="Minimize"
                >
                  <Minus className="h-3.5 w-3.5 text-white" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  title="Close"
                >
                  <X className="h-3.5 w-3.5 text-white" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
              {activeAgent !== "onboarding" && (
                <motion.button
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  onClick={() => setActiveAgent("onboarding")}
                  className="flex items-center gap-1.5 text-[10px] text-gray-500 hover:text-white transition-colors"
                >
                  <span>←</span> Back
                </motion.button>
              )}

              {activeAgent === "project" ? (
                <ProjectAgent />
              ) : activeAgent === "analytics" ? (
                <AnalyticsAgent />
              ) : activeAgent === "learning" ? (
                <LearningAgent />
              ) : activeAgent === "support" ? (
                <SupportAgent />
              ) : activeAgent === "creative" ? (
                <ChatAgent
                  agentType="creative" accentHex="#a855f7" label="Creative Advisor"
                  placeholder="What would you like to brainstorm?"
                  quickAsk={["Help me position my consulting brand","Give me 5 tagline ideas","How do I stand out from competitors?","Help me write a compelling bio"]}
                />
              ) : activeAgent === "productivity" ? (
                <ChatAgent
                  agentType="productivity" accentHex="#eab308" label="Productivity Coach"
                  placeholder="What do you need help organising?"
                  quickAsk={["Help me prioritise my week","Build me a meeting agenda template","How do I reduce project bottlenecks?","Set up an OKR framework for me"]}
                />
              ) : activeAgent === "shopping" ? (
                <ChatAgent
                  agentType="shopping" accentHex="#22c55e" label="Product Advisor"
                  placeholder="Tell me about your needs…"
                  quickAsk={["Which plan is right for my company?","What's included in Enterprise?","Compare CORE vs GROW","How does the concierge service work?"]}
                />
              ) : (
                <>
                  {/* Welcome message */}
                  {chatHistory.length === 0 && (
                    <div className="flex items-start gap-2.5">
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#2563EB]/20 border border-[#2563EB]/30">
                        <Bot className="h-3.5 w-3.5 text-[#2563EB]" />
                      </div>
                      <div className="rounded-2xl rounded-tl-none bg-white/8 border border-white/8 px-3.5 py-2.5 max-w-[82%]">
                        <p className="text-sm text-gray-200 leading-relaxed">
                          {user
                            ? `👋 Hi ${user.name}! I'm your Lamid AI assistant. Ask me anything or pick an agent below.`
                            : "👋 Hello! I'm Lamid AI. Sign in to unlock all agents. Ask me anything to get started."
                          }
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Chat messages */}
                  {chatHistory.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-2 ${msg.sender === "bot" ? "flex-row" : "flex-row-reverse"}`}
                    >
                      {msg.sender === "bot" && (
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#2563EB]/20 border border-[#2563EB]/30 mb-0.5">
                          <Bot className="h-3 w-3 text-[#2563EB]" />
                        </div>
                      )}
                      <div className={`max-w-[78%] text-sm leading-relaxed px-3.5 py-2.5 rounded-2xl ${
                        msg.sender === "bot"
                          ? "bg-white/8 border border-white/8 text-gray-200 rounded-tl-none"
                          : "bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white rounded-tr-none"
                      }`}>
                        {msg.text || (msg.streaming && (
                          <span className="flex gap-1 items-center h-4">
                            {[0,1,2].map(i => (
                              <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400"
                                animate={{ y: [0, -4, 0] }}
                                transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />
                            ))}
                          </span>
                        ))}
                        <p className="text-[10px] text-gray-500 mt-1">{msg.timestamp}</p>
                      </div>
                    </div>
                  ))}

                  <div ref={chatEndRef} />

                  {/* Agent switcher */}
                  <AgentSwitcher
                    onSwitch={handleSwitchAgent}
                    activeAgent={activeAgent}
                    isAdmin={isAdmin}
                  />

                  {/* Clear history */}
                  {chatHistory.length > 3 && (
                    <button onClick={clearHistory}
                      className="w-full text-[10px] text-gray-600 hover:text-gray-600 transition-colors py-1">
                      Clear conversation
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 px-3 py-3 border-t border-white/8 flex-shrink-0 bg-[#0a0a0a]">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleMessage(input); } }}
                placeholder={isStreaming ? "Lamid AI is responding..." : "Ask Lamid AI..."}
                disabled={isStreaming}
                className="flex-1 rounded-xl bg-white/6 border border-white/8 px-3.5 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#2563EB]/50 transition-colors disabled:opacity-50"
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleMessage(input)}
                disabled={!input.trim() || isStreaming}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#2563EB] disabled:opacity-40 transition-opacity"
              >
                <Send className="h-4 w-4 text-white" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized bubble */}
      <AnimatePresence>
        {isOpen && isMinimized && (
          <motion.button
            key="mini"
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            whileHover={{ scale: 1.06 }}
            onClick={() => setIsMinimized(false)}
            className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] rounded-full flex items-center justify-center shadow-lg z-40"
          >
            <Bot className="w-5 h-5 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Lock overlay */}
      {lockedAgent && (
        <LockedMessage
          agentName={AGENT_LABELS[lockedAgent] ?? lockedAgent}
          onSignup={() => router.push("/signup")}
          onClose={() => setLockedAgent(null)}
        />
      )}
    </>
  );
}
