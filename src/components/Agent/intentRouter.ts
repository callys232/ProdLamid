import type { AgentType } from "@/types/agentTypes";

interface IntentResult {
  agent:   AgentType;
  message: string;
  score:   number;
}

interface IntentRule {
  agent:    AgentType;
  keywords: string[];
  phrases:  string[];
  message:  string;
}

const RULES: IntentRule[] = [
  {
    agent:    "project",
    keywords: ["milestone", "deadline", "task", "project", "consultant", "assign", "team", "deliverable", "scope"],
    phrases:  ["create a project", "add milestone", "manage project", "project status"],
    message:  "Switching you to the Project Agent to help manage your project.",
  },
  {
    agent:    "analytics",
    keywords: ["analytics", "performance", "metrics", "report", "progress", "efficiency", "data", "stats", "bottleneck"],
    phrases:  ["show analytics", "how is my project", "performance report"],
    message:  "Opening the Analytics Agent — let's review your performance data.",
  },
  {
    agent:    "communication",
    keywords: ["notification", "alert", "remind", "broadcast", "message", "escalate", "risk", "overdue"],
    phrases:  ["send notification", "risk alert", "communication setup"],
    message:  "Switching to the Communication Agent for notifications and alerts.",
  },
  {
    agent:    "learning",
    keywords: ["learn", "course", "training", "skill", "workshop", "certification", "study", "tutorial"],
    phrases:  ["want to learn", "take a course", "get certified"],
    message:  "Heading to the Learning Agent — let's grow your skills.",
  },
  {
    agent:    "support",
    keywords: ["broken", "error", "bug", "crash", "not working", "issue", "problem", "troubleshoot", "fix"],
    phrases:  ["something broke", "need help with an error", "page not loading"],
    message:  "Moving you to the Support Agent to resolve this.",
  },
  {
    agent:    "creative",
    keywords: ["design", "brainstorm", "idea", "creative", "brand", "logo", "content", "write"],
    phrases:  ["need ideas", "help me design", "brainstorm with me"],
    message:  "Great! Let's get creative — switching to the Creative Agent.",
  },
  {
    agent:    "productivity",
    keywords: ["schedule", "calendar", "time", "organize", "plan", "todo", "task list", "efficiency", "focus"],
    phrases:  ["manage my time", "help me organize", "stay productive"],
    message:  "Switching to the Productivity Agent to boost your workflow.",
  },
  {
    agent:    "shopping",
    keywords: ["buy", "purchase", "shop", "product", "prototype", "price", "package", "deal"],
    phrases:  ["want to buy", "show me products", "business prototype"],
    message:  "Opening the Shopping Agent — let's find what you need.",
  },
  {
    agent:    "onboarding",
    keywords: ["start", "begin", "overview", "what can you do", "which agent", "help me choose", "guide me"],
    phrases:  ["how does this work", "what is lamid", "get started"],
    message:  "Back to the Onboarding Assistant — I'll help you find the right path.",
  },
];

function scoreMessage(msg: string, rule: IntentRule): number {
  const lower = msg.toLowerCase();
  let score = 0;

  // Phrase matches score higher (2 points each)
  for (const phrase of rule.phrases) {
    if (lower.includes(phrase)) score += 2;
  }

  // Keyword matches (1 point each)
  for (const keyword of rule.keywords) {
    // Use word boundaries to avoid "help" matching "helpful project management"
    const re = new RegExp(`\\b${keyword}\\b`, "i");
    if (re.test(lower)) score += 1;
  }

  return score;
}

/**
 * Routes a user message to the best matching agent.
 * Returns null if the message doesn't match any intent clearly.
 * minScore: 1 means a single keyword match is enough to route.
 */
export function routeIntent(msg: string, minScore = 1): IntentResult | null {
  let best: IntentResult | null = null;

  for (const rule of RULES) {
    const score = scoreMessage(msg, rule);
    if (score >= minScore && (!best || score > best.score)) {
      best = { agent: rule.agent, message: rule.message, score };
    }
  }

  return best;
}

// Legacy export so existing imports don't break
export function checkReferral(msg: string) {
  const result = routeIntent(msg, 1);
  if (!result) return null;
  return { referred: true, agent: result.agent, message: result.message };
}
