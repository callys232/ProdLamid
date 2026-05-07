"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AccountTypePage() {
    const [accountType, setAccountType] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!accountType) {
            toast.error("Please select an account type ❌");
            return;
        }

        setLoading(true);
        try {
            const signupData =
                sessionStorage.getItem("signupData") ||
                localStorage.getItem("signupData");
            if (!signupData) {
                toast.error("No signup data found. Please start over.");
                router.push("/signup");
                return;
            }

            const parsedData = JSON.parse(signupData);

            // Concierge requires admin approval — submit request instead of registering
            if (accountType === "Concierge") {
                const res = await fetch("/api/concierge/request", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: parsedData.UserName,
                        email: parsedData.email,
                        organisation: parsedData.companyName || parsedData.UserName,
                    }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);
                toast.success("Request submitted! Our team will contact you within 24 hours.");
                sessionStorage.removeItem("signupData");
                localStorage.removeItem("signupData");
                router.push("/signup?concierge=pending");
                setLoading(false);
                return;
            }

            // Map Account Type to Role
            const role =
                accountType === "Freelancer"
                    ? "seller"
                    : accountType === "Client"
                        ? "client"
                        : accountType === "Enterprise"
                            ? "client"
                            : null;

            if (!role) {
                toast.error("Please select an account type");
                setLoading(false);
                return;
            }

            const payload = {
                name: parsedData.UserName,
                email: parsedData.email,
                password: parsedData.password,
                role,
                ...(accountType === "Enterprise" && {
                    isEnterprise: true,
                    companyName: parsedData.companyName || parsedData.UserName,
                }),
            };

            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!res.ok || !result.success) {
                throw new Error(result.message || "Signup failed");
            }

            toast.success("Account created successfully 🎉");

            localStorage.setItem("token", result.data.token);
            localStorage.setItem("user", JSON.stringify(result.data.user));

            sessionStorage.removeItem("signupData");
            localStorage.removeItem("signupData");

            // Redirect based on role
            if (accountType === "Enterprise") router.push("/enterprise");
            else if (role === "seller") router.push("/profile");
            else router.push("/client");
        } catch (error: any) {
            console.error("Registration error:", error);
            toast.error(error.message || "Signup failed ⚠️");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-black px-6">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl w-full bg-black border border-white/20 p-10 rounded-2xl shadow-2xl"
            >
                <h2 className="text-3xl font-bold text-white mb-4 text-center">
                    Choose Your Account Type
                </h2>
                <p className="text-gray-300 mb-10 text-center">
                    Lamid offers two account types. Pick the one that best suits your needs.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Freelancer Option */}
                    <label className="flex items-start gap-3 border border-white/20 rounded-xl p-4 hover:border-[#c12129] transition cursor-pointer">
                        <input
                            type="radio"
                            name="accountType"
                            value="Freelancer"
                            checked={accountType === "Freelancer"}
                            onChange={(e) => setAccountType(e.target.value)}
                            className="mt-1 accent-[#c12129]"
                        />
                        <div>
                            <h3 className="text-xl font-semibold text-[#c12129]">Freelancer</h3>
                            <p className="text-gray-300 text-sm">
                                Consultants seeking projects. Create invoices, track payments,
                                and showcase your services to potential clients.
                            </p>
                        </div>
                    </label>

                    {/* Client Option */}
                    <label className="flex items-start gap-3 border border-white/20 rounded-xl p-4 hover:border-[#c12129] transition cursor-pointer">
                        <input
                            type="radio"
                            name="accountType"
                            value="Client"
                            checked={accountType === "Client"}
                            onChange={(e) => setAccountType(e.target.value)}
                            className="mt-1 accent-[#c12129]"
                        />
                        <div>
                            <h3 className="text-xl font-semibold text-[#c12129]">Client</h3>
                            <p className="text-gray-300 text-sm">
                                Organizations hiring consultants. Post jobs, manage contracts,
                                and securely pay for completed work.
                            </p>
                        </div>
                    </label>

                    {/* Enterprise Option */}
                    <label className="flex items-start gap-3 border border-white/20 rounded-xl p-4 hover:border-[#c12129] transition cursor-pointer">
                        <input
                            type="radio"
                            name="accountType"
                            value="Enterprise"
                            checked={accountType === "Enterprise"}
                            onChange={(e) => setAccountType(e.target.value)}
                            className="mt-1 accent-[#c12129]"
                        />
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-semibold text-[#c12129]">Enterprise</h3>
                                <span className="rounded-full border border-[#c12129]/40 bg-[#c12129]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[#c12129]">New</span>
                            </div>
                            <p className="text-gray-300 text-sm">
                                Large organisations with multi-user workspaces. Up to 50 members, dedicated dashboard, escrow management, and analytics.
                            </p>
                        </div>
                    </label>

                    {/* Concierge Option */}
                    <label className="flex items-start gap-3 border border-white/20 rounded-xl p-4 hover:border-yellow-500/50 transition cursor-pointer">
                        <input
                            type="radio"
                            name="accountType"
                            value="Concierge"
                            checked={accountType === "Concierge"}
                            onChange={(e) => setAccountType(e.target.value)}
                            className="mt-1 accent-yellow-500"
                        />
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-xl font-semibold text-yellow-400">Concierge</h3>
                                <span className="rounded-full border border-yellow-500/40 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-yellow-400">Admin Approval Required</span>
                            </div>
                            <p className="text-gray-300 text-sm mt-1">
                                For government agencies, UN bodies, large NGOs and corporations. Includes a dedicated project manager, custom dashboards, and 24/7 priority support. Your request will be reviewed by our team within 24 hours — no payment required now.
                            </p>
                        </div>
                    </label>

                    {/* Continue Button */}
                    <motion.button
                        whileTap={{ scale: 0.96 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#c12129] to-[#8b1118] text-white font-semibold py-3 rounded-xl hover:opacity-90 hover:scale-105 transition disabled:opacity-60 mt-4 flex items-center justify-center shadow-lg"
                    >
                        {loading ? (
                            <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                            "Continue"
                        )}
                    </motion.button>
                </form>
            </motion.div>
        </section>
    );
}
