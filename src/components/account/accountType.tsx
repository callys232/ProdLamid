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
            // Retrieve signup data from sessionStorage (preferred) or localStorage
            const signupData = sessionStorage.getItem("signupData") || localStorage.getItem("signupData");
            if (!signupData) {
                toast.error("No signup data found. Please start over.");
                router.push("/signup");
                return;
            }

            const parsedData = JSON.parse(signupData);

            // Map Account Type to Role
            const role = accountType === "Freelancer" ? "seller" : "client";

            const payload = {
                name: parsedData.UserName, // Map UserName to name
                email: parsedData.email,
                password: parsedData.password,
                role: role
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

            // Save user & token
            localStorage.setItem("token", result.data.token);
            localStorage.setItem("user", JSON.stringify(result.data.user));

            // Clear temp data
            sessionStorage.removeItem("signupData");
            localStorage.removeItem("signupData");

            // Redirect based on role
            if (role === "seller") router.push("/profile");
            else if (role === "client") router.push("/client");
            else router.push("/dashboard");

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
                                Freelancers are consultants seeking jobs. You can create and send invoices,
                                track payments, and showcase your services to potential clients.
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
                                Clients are those who give out jobs. You can hire freelancers,
                                manage contracts, and securely pay for completed work.
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
