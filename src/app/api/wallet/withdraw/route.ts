import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { Wallet } from "@/lib/models/Wallet";
import { initiatePaystackTransfer } from "@/lib/paystack";

// POST /api/wallet/withdraw — withdraw from wallet to bank account
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const { amount, name, account_number, bank_code } = await req.json();
    if (!amount || !name || !account_number || !bank_code)
      return NextResponse.json({ success: false, message: "amount, name, account_number, and bank_code are required" }, { status: 400 });

    const wallet = await Wallet.findOne({ user: auth.userId });
    if (!wallet) return NextResponse.json({ success: false, message: "Wallet not found" }, { status: 404 });
    if (wallet.balance < amount) return NextResponse.json({ success: false, message: "Insufficient balance" }, { status: 400 });

    const transfer = await initiatePaystackTransfer({ name, account_number, bank_code, amount, reason: "Wallet withdrawal" });

    wallet.balance -= amount;
    wallet.transactions.push({ type: "debit", amount, description: "Withdrawal to bank", reference: transfer.reference });
    await wallet.save();

    return NextResponse.json({ success: true, message: "Withdrawal initiated", transfer });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
