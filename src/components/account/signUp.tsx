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
              <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Next"
            )}

          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}
