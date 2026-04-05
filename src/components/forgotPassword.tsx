"use client";

import { useState } from "react";

export default function ForgotPassword() {
    const [method, setMethod] = useState<"email" | "phone" | "authApp">("email");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [authCode, setAuthCode] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        try {
            let endpoint = "";
            let payload: any = {};

            if (method === "email") {
                endpoint = "/api/auth/forgot-password";
                payload = { email };
            } else if (method === "phone") {
                endpoint = "/api/auth/forgot-password-sms";
                payload = { phone };
            } else if (method === "authApp") {
                endpoint = "/api/auth/forgot-password-2fa";
                payload = { code: authCode };
            }

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setStatus("success");
            } else {
                setStatus("error");
            }
        } catch (err) {
            console.error(err);
            setStatus("error");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-red-900">
            <div className="bg-black/70 p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-800">
                <h2 className="text-2xl font-bold text-white mb-4 text-center">Forgot Password</h2>
                <p className="text-gray-400 text-sm mb-6 text-center">
                    Choose how you’d like to verify your identity to reset your password.
                </p>

                {/* Method Toggle */}
                <div className="flex justify-center gap-4 mb-6">
                    <button
                        type="button"
                        onClick={() => setMethod("email")}
                        className={`px-4 py-2 rounded-md text-sm ${method === "email"
                                ? "bg-red-600 text-white"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }`}
                    >
                        Use Email
                    </button>
                    <button
                        type="button"
                        onClick={() => setMethod("phone")}
                        className={`px-4 py-2 rounded-md text-sm ${method === "phone"
                                ? "bg-red-600 text-white"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }`}
                    >
                        Use Phone
                    </button>
                    <button
                        type="button"
                        onClick={() => setMethod("authApp")}
                        className={`px-4 py-2 rounded-md text-sm ${method === "authApp"
                                ? "bg-red-600 text-white"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }`}
                    >
                        Use Authenticator App
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {method === "email" && (
                        <div>
                            <label htmlFor="email" className="block text-sm text-gray-300 mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="you@example.com"
                            />
                        </div>
                    )}

                    {method === "phone" && (
                        <div>
                            <label htmlFor="phone" className="block text-sm text-gray-300 mb-1">
                                Phone Number
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="+234 801 234 5678"
                            />
                        </div>
                    )}

                    {method === "authApp" && (
                        <div>
                            <label htmlFor="authCode" className="block text-sm text-gray-300 mb-1">
                                Authenticator App Code
                            </label>
                            <input
                                id="authCode"
                                type="text"
                                required
                                value={authCode}
                                onChange={(e) => setAuthCode(e.target.value)}
                                className="w-full px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="Enter 6-digit code"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Use the code from your previously linked 2FA app.
                            </p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition disabled:opacity-50"
                    >
                        {status === "loading"
                            ? "Verifying..."
                            : method === "email"
                                ? "Send Reset Link"
                                : method === "phone"
                                    ? "Send SMS Code"
                                    : "Verify Code"}
                    </button>
                </form>

                {/* Status messages */}
                {status === "success" && (
                    <p className="mt-4 text-green-400 text-sm text-center">
                        ✅ {method === "email"
                            ? "Reset link sent! Check your inbox."
                            : method === "phone"
                                ? "SMS code sent! Check your phone."
                                : "Code verified! You can now reset your password."}
                    </p>
                )}
                {status === "error" && (
                    <p className="mt-4 text-red-400 text-sm text-center">
                        ❌ Something went wrong. Please try again.
                    </p>
                )}
            </div>
        </div>
    );
}
