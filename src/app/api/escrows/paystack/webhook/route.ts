import { NextRequest, NextResponse } from "next/server";
import { webhookVerify } from "@/utils/paystack";
import * as escrowController from "@/controllers/escrowController";

export async function POST(request: NextRequest) {
    try {
        const payload = await request.text();
        const signature = request.headers.get("x-paystack-signature");

        if (!signature || !webhookVerify(payload, signature)) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }

        const body = JSON.parse(payload);
        const result = await escrowController.handlePaystackWebhook(body);

        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
