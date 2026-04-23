import crypto from "crypto";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export const initialize = async (email: string, amount: number) => {
    const res = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            amount: Math.round(amount * 100), // convert to kobo
        }),
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to initialize Paystack payment");
    }
    return data.data; // { authorization_url, access_code, reference }
};

export const verify = async (reference: string) => {
    const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to verify Paystack payment");
    }
    return data.data;
};

export const webhookVerify = (payload: string, signature: string) => {
    const hash = crypto
        .createHmac("sha512", PAYSTACK_SECRET_KEY!)
        .update(payload)
        .digest("hex");
    return hash === signature;
};
