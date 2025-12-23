"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";

interface FormData {
  email: string;
  password: string;
}

export default function SignInPage() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        console.log("Signed in successfully");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0b0b0b] to-[#1a1a1a] px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm sm:max-w-md bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl"
      >
        <h2 className="text-2xl font-serif font-bold text-center mb-6 text-white">
          Sign In to Lamid
        </h2>

        {/* Email + Password Form */}
        <motion.form
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 
                       border border-transparent focus:border-[#c12129] focus:ring-2 focus:ring-[#c12129]/60 
                       focus:shadow-[0_0_10px_#c12129aa] outline-none transition"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 
                       border border-transparent focus:border-[#c12129] focus:ring-2 focus:ring-[#c12129]/60 
                       focus:shadow-[0_0_10px_#c12129aa] outline-none transition"
          />

          {/* Forgot password + Sign up */}
          <div className="flex justify-between text-sm text-gray-400 mt-1">
            <a
              href="/forgot-password"
              className="hover:text-[#c12129] transition"
            >
              Forgot Password?
            </a>
            <a href="/signup" className="hover:text-[#c12129] transition">
              Create Account
            </a>
          </div>

          {/* Error message */}
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileTap={{ scale: 0.96 }}
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-[#c12129] to-[#8b1118] text-white font-semibold py-3 rounded-xl 
                       hover:opacity-90 transition disabled:opacity-60 mt-4 flex items-center justify-center"
          >
            {loading ? (
              <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Sign In"
            )}
          </motion.button>
        </motion.form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-600" />
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-600" />
        </div>

        {/* Social Sign In */}
        <div className="flex flex-col gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            aria-label="Sign in with Google"
            onClick={() => signIn("google")}
            className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-xl 
                       font-medium hover:bg-gray-100 transition focus:ring-2 focus:ring-[#c12129] focus:ring-offset-2"
          >
            <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            aria-label="Sign in with Facebook"
            onClick={() => signIn("facebook")}
            className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white py-3 rounded-xl 
                       font-medium hover:bg-[#145dbf] transition focus:ring-2 focus:ring-[#c12129] focus:ring-offset-2"
          >
            <img src="/facebook-icon.svg" alt="Facebook" className="w-5 h-5" />
            Sign in with Facebook
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
