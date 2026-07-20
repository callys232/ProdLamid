import { Points } from "@/lib/models/Points";

// ─── Constants ───────────────────────────────────────────────────────────────

export const SIGNUP_BONUS: Record<string, number> = {
  // Freemium
  seller:             100,   // consultant freemium
  client:             200,   // client freemium
  // Premium
  seller_premium:     500,   // consultant premium
  client_premium:     800,   // client premium
  // Org tiers
  enterprise:        2000,
  concierge:         5000,
};

export const POINT_COSTS = {
  POST_PROJECT:              50,   // client: costs per project posted
  PLACE_BID:                 20,   // consultant: costs per bid placed
  BOOST_BID:                 60,   // consultant premium only: boosted bid visibility
  AI_MATCH_REQUEST:          30,   // client premium: manual AI match trigger
  AI_DIAGNOSTIC:             40,   // client: run business diagnostic
  AI_CAPABILITY_DIAGNOSTIC:  40,   // all users: talent capability assessment (pay-per-use)
  AI_MENTORSHIP_MATCH:       25,   // all users: mentorship matching (pay-per-use)
  AI_WORKFORCE_ANALYTICS:    40,   // all users: workforce analytics report (pay-per-use)
} as const;

export const POINT_PACKAGES = [
  { id: "p100",  points: 100,  priceNgn: 500,   label: "100 Points",   popular: false },
  { id: "p500",  points: 500,  priceNgn: 2000,  label: "500 Points",   popular: true  },
  { id: "p1000", points: 1000, priceNgn: 3500,  label: "1,000 Points", popular: false },
  { id: "p5000", points: 5000, priceNgn: 15000, label: "5,000 Points", popular: false },
] as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getOrCreate(userId: string) {
  let ledger = await Points.findOne({ userId });
  if (!ledger) ledger = await Points.create({ userId, balance: 0 });
  return ledger;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getBalance(userId: string): Promise<number> {
  const ledger = await Points.findOne({ userId }).lean() as any;
  return ledger?.balance ?? 0;
}

export async function awardPoints(
  userId: string,
  amount: number,
  description: string,
  reference?: string
) {
  const ledger = await getOrCreate(userId);
  ledger.balance += amount;
  ledger.transactions.push({ type: "credit", amount, description, reference });
  return ledger.save();
}

export async function deductPoints(
  userId: string,
  amount: number,
  description: string,
  reference?: string
): Promise<{ success: boolean; balance: number; message?: string }> {
  const ledger = await getOrCreate(userId);

  if (ledger.balance < amount) {
    return {
      success: false,
      balance: ledger.balance,
      message: `Insufficient points. Need ${amount}, have ${ledger.balance}. Purchase more to continue.`,
    };
  }

  ledger.balance -= amount;
  ledger.transactions.push({ type: "debit", amount, description, reference });
  await ledger.save();
  return { success: true, balance: ledger.balance };
}

export async function getHistory(userId: string, page = 1, limit = 20) {
  const ledger = await Points.findOne({ userId }).lean() as any;
  if (!ledger) return { transactions: [], balance: 0, pagination: { page, limit, total: 0, pages: 0 } };

  const all    = [...(ledger.transactions ?? [])].sort(
    (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const total  = all.length;
  const paged  = all.slice((page - 1) * limit, page * limit);

  return {
    transactions: paged,
    balance:      ledger.balance,
    pagination:   { page, limit, total, pages: Math.ceil(total / limit) },
  };
}
