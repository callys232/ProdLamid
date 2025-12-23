"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  accountType: string;
}

export default function SignUpPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "user",
  });
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<
    "Weak" | "Medium" | "Strong" | ""
  >("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      evaluatePasswordStrength(value);
    }
  };

  const evaluatePasswordStrength = (password: string) => {
    let strength: "Weak" | "Medium" | "Strong" | "" = "";
    if (password.length > 0 && password.length < 6) {
      strength = "Weak";
    } else if (
      password.length >= 6 &&
      /[A-Z]/.test(password) &&
      /\d/.test(password)
    ) {
      strength = "Medium";
    }
    if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /\d/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    ) {
      strength = "Strong";
    }
    setPasswordStrength(strength);
  };

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      toast.error("Invalid email format ❌");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match ❌");
      return;
    }

    if (passwordStrength === "Weak" || passwordStrength === "") {
      toast.error("Password is too weak ❌");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/groupware/input", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Signup failed");

      toast.success("Account created successfully 🎉");
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        accountType: "user",
      });
      setPasswordStrength("");
    } catch {
      toast.error("Something went wrong. Please try again ⚠️");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative px-4"
      style={{ backgroundImage: "url('/images/signup-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-3xl shadow-2xl relative z-10"
      >
        <h2 className="text-2xl font-serif font-bold text-center text-white">
          Create Your Account
        </h2>
        <p className="text-center text-gray-400 text-sm mt-1 mb-6">
          Join our intelligent workspace
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 
                       border border-transparent focus:ring-2 focus:ring-[#c12129] focus:ring-offset-2 focus:ring-offset-[#0d0d0d]
                       transition-all duration-300 shadow-sm"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 
                       border border-transparent focus:ring-2 focus:ring-[#c12129] focus:ring-offset-2 focus:ring-offset-[#0d0d0d]
                       transition-all duration-300 shadow-sm"
          />

          <div className="flex flex-col gap-1">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 
                         border border-transparent focus:ring-2 focus:ring-[#c12129] focus:ring-offset-2 focus:ring-offset-[#0d0d0d]
                         transition-all duration-300 shadow-sm"
            />
            {passwordStrength && (
              <p
                className={`text-xs ${
                  passwordStrength === "Weak"
                    ? "text-red-500"
                    : passwordStrength === "Medium"
                    ? "text-yellow-400"
                    : "text-green-400"
                }`}
              >
                Password strength: {passwordStrength}
              </p>
            )}
          </div>

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 
                       border border-transparent focus:ring-2 focus:ring-[#c12129] focus:ring-offset-2 focus:ring-offset-[#0d0d0d]
                       transition-all duration-300 shadow-sm"
          />

          <label htmlFor="accountType" className="sr-only">
            Account Type
          </label>
          <select
            id="accountType"
            name="accountType"
            aria-label="Account Type"
            value={formData.accountType}
            onChange={handleChange}
            className="..."
          >
            <option value="user" className="text-black">
              User
            </option>
            <option value="consultant" className="text-black">
              Consultant
            </option>
          </select>

          <motion.button
            whileTap={{ scale: 0.96 }}
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-[#c12129] to-[#8b1118] text-white font-semibold py-3 rounded-xl 
                       hover:opacity-90 transition disabled:opacity-60 mt-2 flex items-center justify-center shadow-lg"
          >
            {loading ? (
              <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Sign Up"
            )}
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}
