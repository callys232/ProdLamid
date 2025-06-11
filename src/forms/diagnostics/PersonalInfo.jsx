import { motion } from "framer-motion";
import { useEffect } from "react";

const PersonalInfo = ({ handleChange, handleProceed, handleSocialLogin }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="flex justify-center items-center min-h-screen"
    >
      {/* Form Frame */}
      <div className="bg-black p-6 rounded-lg shadow-lg w-full max-w-md backdrop-blur-lg border border-white/20">
        <h1 className="text-3xl font-bold text-red-700 mb-4 text-center">Get Free Diagnostics</h1>
        <p className="text-red-500 mb-6 text-center">Fill in your details or log in using social media.</p>

        {/* Social Login Buttons */}
        <div className="flex gap-4 mb-4 justify-center">
          <button
            onClick={() => handleSocialLogin("google")}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out hover:bg-red-600 hover:scale-105 hover:ring-2 hover:ring-red-500"
          >
            Sign in with Google
          </button>
          <button
            onClick={() => handleSocialLogin("facebook")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out hover:bg-blue-700 hover:scale-105 hover:ring-2 hover:ring-blue-500"
          >
            Sign in with Facebook
          </button>
        </div>

        {/* Input Fields with Consistent Design */}
        {["fullname", "address", "city", "state", "email"].map((field) => (
          <input
            key={field}
            type={field === "email" ? "email" : "text"}
            id={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="w-full p-3 border border-gray-400 rounded-lg mb-4 text-black focus:border-red-500 focus:ring-2 focus:ring-red-400 hover:shadow-md transition-all duration-300 ease-in-out"
            onChange={handleChange}
          />
        ))}

        {/* Select Fields */}
        {[
          { id: "gender", options: ["Male", "Female", "Other"] },
          { id: "BusinessCategory", options: ["Business", "Human Resource", "Social Development"] },
        ].map(({ id, options }) => (
          <select
            key={id}
            id={id}
            className="w-full p-3 border border-gray-400 rounded-lg mb-4 text-black focus:border-red-500 focus:ring-2 focus:ring-red-400 hover:shadow-md transition-all duration-300 ease-in-out"
            onChange={handleChange}
          >
            <option value="">{`Select ${id}`}</option>
            {options.map((option) => (
              <option key={option} value={option.toLowerCase()}>
                {option}
              </option>
            ))}
          </select>
        ))}
      </div>
    </motion.div>
  );
};

export default PersonalInfo;
