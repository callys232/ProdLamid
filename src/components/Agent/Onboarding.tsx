// components/AIAgent.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import ProjectAgent from "./project/projectAgent";
import LockedMessage from "./lockedMessage";
import { useRouter } from "next/navigation";
import type { AgentType } from "@/types/agentTypes";
import { checkReferral } from "./checker";
import AgentSwitcher from "./agentSwitcher";

interface UserProfile {
  name: string;
  avatarUrl?: string;
}

interface ChatMessage {
  text: string;
  sender: "bot" | "user";
  timestamp: string;
}

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: { transcript: string };
    };
  };
}

interface ISpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
}

declare global {
  interface SpeechRecognitionConstructor {
    new(): ISpeechRecognition;
  }
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export default function AIAgent() {
  const user: UserProfile = { name: "Caleb" };
  const router = useRouter();

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [activeAgent, setActiveAgent] = useState<AgentType>("onboarding");
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [lockedAgent, setLockedAgent] = useState<AgentType | null>(null);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  const getTimestamp = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Handle user message
  const handleMessage = (msg: string) => {
    const trimmed = msg.trim();
    if (!trimmed) return;

    setChatHistory((prev) => [
      ...prev,
      { text: trimmed, sender: "user", timestamp: getTimestamp() },
    ]);
    setIsThinking(true);

    setTimeout(() => {
      // Check referral first
      const referral = checkReferral(trimmed);
      if (referral) {
        setActiveAgent(referral.agent);
        setChatHistory((prev) => [
          ...prev,
          { text: referral.message, sender: "bot", timestamp: getTimestamp() },
        ]);
        setIsThinking(false);
        return;
      }

      let response = "";
      switch (activeAgent) {
        case "onboarding":
          response =
            "👋 Welcome! I’m your onboarding assistant. Tell me what you’d like to do and I’ll connect you to the right agent.";
          break;
        case "learning":
          response =
            "📘 I’ll hand you over to our Learning Agent to guide your studies.";
          break;
        case "support":
          response =
            "🛠️ Redirecting you to our Support Agent for troubleshooting.";
          break;
        case "shopping":
          response =
            "🛒 Let’s connect you with our Shopping Agent for product discovery.";
          break;
        case "creative":
          response =
            "🎨 Our Creative Agent will help brainstorm and design ideas.";
          break;
        case "productivity":
          response =
            "⏰ Our Productivity Agent will assist with scheduling and tasks.";
          break;
        case "project":
          response =
            "📂 Opening Project & Team Intelligence for milestones and consultant matching.";
          break;
      }

      setChatHistory((prev) => [
        ...prev,
        { text: response, sender: "bot", timestamp: getTimestamp() },
      ]);
      setIsThinking(false);
    }, 1000);
  };

  // Speech recognition setup
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognitionConstructor =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor) return;

    const recognition: ISpeechRecognition = new SpeechRecognitionConstructor();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      handleMessage(transcript);
    };

    recognitionRef.current = recognition;
  }, []);

  // Switch agent with lock check
  const handleSwitchAgent = (agent: AgentType) => {
    const lockedAgents: AgentType[] = [
      "learning",
      "support",
      "shopping",
      "productivity",
    ];
    const isSignedIn = false; // TODO: replace with real auth check

    if (!isSignedIn && lockedAgents.includes(agent)) {
      setLockedAgent(agent);
      return;
    }
    setActiveAgent(agent);
  };

  return (
    <>
      {/* Floating Trigger */}
      {!isOpen && !isMinimized && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-[#c21219] to-[#a40e14] rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition z-40"
          aria-label="Open Lamid AI"
        >
          <img src="/aibot.png" alt="Lamid AI" className="w-8 h-8" />
        </button>
      )}

      {/* Minimized Bubble */}
      {isMinimized && !isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-[#c21219] to-[#a40e14] rounded-full flex items-center justify-center shadow-lg z-40 hover:scale-105 transition"
          aria-label="Restore Lamid AI"
        >
          <img src="/aibot.png" alt="Lamid AI" className="w-6 h-6" />
        </button>
      )}

      {/* Chat Modal */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-6 w-[90%] sm:w-[420px] max-h-[80vh] 
        bg-black/60 backdrop-blur-xl border border-[#c21219]/40 rounded-2xl shadow-2xl 
        flex flex-col transition-all duration-300 ease-out z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#c21219] to-[#a40e14] text-white">
            <div className="flex items-center gap-3">
              <img
                src="/aibot.png"
                alt="Lamid AI"
                className="w-7 h-7 rounded"
              />
              <h2 className="font-semibold">
                {activeAgent === "onboarding"
                  ? "Onboarding Assistant"
                  : `${activeAgent.charAt(0).toUpperCase() + activeAgent.slice(1)
                  } Agent`}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => recognitionRef.current?.start()}
                className={`px-2 py-1 rounded ${isListening ? "bg-white/20" : "bg-white/10"
                  }`}
                title="Voice input"
              >
                🎤
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsMinimized(true);
                }}
                className="text-white hover:text-gray-200 transition"
                title="Minimize"
              >
                ⤢
              </button>
            </div>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto text-white p-6 space-y-5">
            {activeAgent === "project" ? (
              <ProjectAgent />
            ) : (
              <>
                {activeAgent === "onboarding" && (
                  <div className="text-sm text-gray-300 leading-relaxed mb-4">
                    👋 Welcome, {user.name}. I’ll guide you to the right agent:
                    manage projects, get creative, shop, learn, or boost
                    productivity. Ask me anything or choose below.
                  </div>
                )}

                {chatHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-end gap-2 ${msg.sender === "bot"
                        ? "self-start flex-row"
                        : "self-end flex-row-reverse"
                      }`}
                  >
                    <div
                      className={`max-w-[75%] text-sm p-4 rounded-2xl shadow-md leading-relaxed ${msg.sender === "bot"
                          ? "bg-gray-800/80 text-gray-100 rounded-tl-none"
                          : "bg-gradient-to-r from-[#c21219] to-[#a40e14] text-white rounded-tr-none"
                        }`}
                    >
                      {msg.text}
                      <div className="text-xs text-gray-400 mt-2">
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                ))}

                {isThinking && (
                  <div className="flex items-end gap-2 self-start">
                    <div className="flex gap-1 p-3 bg-gray-800/70 rounded-2xl w-fit">
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-150"></span>
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-300"></span>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />

                {activeAgent === "onboarding" && (
                  <AgentSwitcher onSwitch={handleSwitchAgent} />
                )}
              </>
            )}
          </div>

          {/* Sticky Footer Input */}
          <div className="p-5 bg-black/50 border-t border-gray-700 flex items-center gap-3">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 p-3 rounded-lg bg-[#0f0f0f] text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c21219]"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const value = (e.target as HTMLInputElement).value;
                  handleMessage(value);
                  (e.target as HTMLInputElement).value = "";
                }
              }}
            />
            <button
              onClick={() => recognitionRef.current?.start()}
              className={`px-4 py-2 rounded-lg ${isListening ? "bg-red-600" : "bg-[#3b82f6]"
                } text-white hover:opacity-90`}
              title="Voice input"
            >
              🎤
            </button>
          </div>
        </div>
      )}

      {/* Locked Agent Overlay */}
      {lockedAgent && (
        <LockedMessage
          agentName={
            lockedAgent.charAt(0).toUpperCase() +
            lockedAgent.slice(1) +
            " Agent"
          }
          onSignup={() => router.push("/signup")}
          onClose={() => setLockedAgent(null)}
        />
      )}
    </>
  );
}
