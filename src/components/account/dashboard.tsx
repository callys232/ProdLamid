"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Dashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAccount = async () => {
            try {
                // ✅ Try DB/API first
                const res = await fetch("/api/groupware/get-account", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!res.ok) throw new Error("DB lookup failed");

                const data = await res.json();

                if (data?.accountType === "Freelancer") {
                    toast.success("Loaded account from DB 🎉");
                    router.push("/profile");
                } else if (data?.accountType === "Client") {
                    toast.success("Loaded account from DB 🎉");
                    router.push("/client");
                } else {
                    throw new Error("Invalid account type in DB");
                }
            } catch (error) {
                console.warn("DB failed, using fallback:", error);

                // ✅ Fallback: use localStorage mock data
                const signupData = localStorage.getItem("signupData");
                if (!signupData) {
                    toast.error("No signup data found ❌");
                    router.push("/signup");
                    return;
                }

                const parsedData = JSON.parse(signupData);

                if (parsedData.accountType === "Freelancer") {
                    toast.success("Using fallback mock data 🎉");
                    router.push("/profile");
                } else if (parsedData.accountType === "Client") {
                    toast.success("Using fallback mock data 🎉");
                    router.push("/client");
                } else {
                    toast.error("Invalid account type ❌");
                    router.push("/account-type");
                }
            } finally {
                setLoading(false);
            }
        };

        checkAccount();
    }, [router]);

    return (
        <section className="min-h-screen flex items-center justify-center bg-black text-white">
            {loading ? (
                <p className="text-gray-400">Checking your account...</p>
            ) : (
                <p className="text-gray-400">Redirecting...</p>
            )}
        </section>
    );
}
