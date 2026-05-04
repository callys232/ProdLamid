"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface FormData {
  UserName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface PasswordRules {
  length: boolean;
  upper: boolean;
  lower: boolean;
  number: boolean;
  special: boolean;
  whitespace: boolean;
}

export default function SignUpPage() {
  const [formData, setFormData] = useState<FormData>({
    UserName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<"Weak" | "Medium" | "Strong" | "">("");
  const [rules, setRules] = useState<PasswordRules>({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
    whitespace: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      evaluatePasswordStrength(value);
    }
  };

  const evaluatePasswordStrength = (password: string) => {
    const newRules: PasswordRules = {
      length: password.length >= 12,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
      whitespace: /\s/.test(password),
    };
    setRules(newRules);

    let strength: "Weak" | "Medium" | "Strong" | "" = "";
    if (!newRules.length || !newRules.upper || !newRules.lower || !newRules.number || !newRules.special || newRules.whitespace) {
      strength = "Weak";
    } else if (newRules.length && newRules.upper && newRules.lower && newRules.number) {
      strength = "Medium";
    }
    if (newRules.length && newRules.upper && newRules.lower && newRules.number && newRules.special && !newRules.whitespace) {
      strength = "Strong";
    }
    setPasswordStrength(strength);
  };

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

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
    if (passwordStrength !== "Strong") {
      toast.error("Password does not meet security requirements ❌");
      return;
    }

    setLoading(true);
    try {
      // Save data temporarily for the next step (Account Type selection)
      sessionStorage.setItem("signupData", JSON.stringify(formData));
      router.push("/account-type");
    } catch (error) {
      console.error("Error saving signup data:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-black border border-white/20 p-8 rounded-3xl shadow-2xl relative z-10"
      >
        <h2 className="text-2xl font-serif font-bold text-center text-white">Create Your Account</h2>
        <p className="text-center text-gray-400 text-sm mt-1 mb-6">Join our intelligent workspace</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" name="UserName" placeholder="UserName" value={formData.UserName} onChange={handleChange} required
            className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#c12129] transition-all duration-300" />

          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required
            className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#c12129] transition-all duration-300" />

          {/* Password with show/hide toggle */}
          <div className="flex flex-col gap-2">
            <div className="relative">
              <input type={showPassword ? "text" : "password"} name="password" placeholder="Password"
                value={formData.password} onChange={handleChange} required
                className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#c12129] transition-all duration-300" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white text-sm">
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Strength meter */}
            {formData.password.length > 0 && (
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div className={`h-2 rounded-full transition-all duration-300 ${passwordStrength === "Weak" ? "bg-red-500 w-1/3" :
                  passwordStrength === "Medium" ? "bg-yellow-400 w-2/3" :
                    passwordStrength === "Strong" ? "bg-green-500 w-full" : "w-0"
                  }`} />
              </div>
            )}

            {/* Real-time checklist */}
            {formData.password.length > 0 && (
              <div className="text-xs text-gray-400 mt-2 space-y-1">
                <p>Requirements:</p>
                <ul className="list-disc list-inside space-y-1">
                  {!rules.length && <li className="text-red-500">❌ At least 12 characters</li>}
                  {!rules.upper && <li className="text-red-500">❌ One uppercase (A–Z)</li>}
                  {!rules.lower && <li className="text-red-500">❌ One lowercase (a–z)</li>}
                  {!rules.number && <li className="text-red-500">❌ One number (0–9)</li>}
                  {!rules.special && <li className="text-red-500">❌ One special character (!@#$%^&*)</li>}
                  {rules.whitespace && <li className="text-red-500">❌ No spaces allowed</li>}
                </ul>
              </div>
            )}
          </div>

          <input type="password" name="confirmPassword" placeholder="Confirm Password"
            value={formData.confirmPassword} onChange={handleChange} required
            className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#c12129] transition-all duration-300" />

          <motion.button
            whileTap={{ scale: 0.96 }}
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-[#c12129] to-[#8b1118] text-white font-semibold py-3 rounded-xl hover:opacity-90 hover:scale-105 transition disabled:opacity-60 mt-2 flex items-center justify-center shadow-lg"
          >
            {loading ? (
              <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : "Next"}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[11px] text-gray-600 uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Google sign-up */}
        <motion.a
          href="/api/auth/google"
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </motion.a>

        <p className="mt-4 text-center text-xs text-gray-600">
          Already have an account?{" "}
          <a href="/signin" className="text-[#c12129] hover:underline">Sign in</a>
        </p>
      </motion.div>
    </section>
  );
}
