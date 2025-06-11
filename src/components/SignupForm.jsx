import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const SignupForm = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    address: "",
    city: "",
    state: "",
    maritalStatus: "",
    gender: "",
    email: "",
    eventCategory: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (showSuccess) {
      let timeLeft = 5;
      interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 20, 100)); // Progress bar updates (20% per second)
        timeLeft -= 1;

        if (timeLeft === 0) {
          clearInterval(interval);
          closeModal(); // Auto-close after countdown completes
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showSuccess]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (formData.fullname.length < 3)
      newErrors.fullname = "Full Name must be at least 3 characters.";
    if (!formData.email.includes("@") || !formData.email.includes("."))
      newErrors.email = "Enter a valid email address.";
    if (!formData.eventCategory)
      newErrors.eventCategory = "Please select an event category.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);

      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccess(true); // Trigger success message & auto-close timer
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative"
      >
        {!showSuccess ? (
          <form onSubmit={handleSubmit}>
            <h2 className="text-center text-xl font-bold text-orange-600 mb-4">
              Event Signup Form
            </h2>

            {/* Input Fields */}
            <input
              type="text"
              id="fullname"
              placeholder="Full Name"
              className="w-full p-2 border rounded mb-2 text-black"
              onChange={handleChange}
            />
            {errors.fullname && (
              <p className="text-red-500 text-sm">{errors.fullname}</p>
            )}

            <input
              type="text"
              id="address"
              placeholder="Address"
              className="w-full p-2 border rounded mb-2 text-black"
              onChange={handleChange}
            />
            <input
              type="text"
              id="city"
              placeholder="City"
              className="w-full p-2 border rounded mb-2 text-black"
              onChange={handleChange}
            />
            <input
              type="text"
              id="state"
              placeholder="State"
              className="w-full p-2 border rounded mb-2 text-black"
              onChange={handleChange}
            />

            <select
              id="gender"
              className="w-full p-2 border rounded mb-2 text-black"
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            {/* Email Field */}
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="w-full p-2 border rounded mb-2 text-black"
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}

            <select
              id="eventCategory"
              className="w-full p-2 border rounded mb-4 text-black"
              onChange={handleChange}
            >
              <option value="">Event Category</option>
              <option value="business">Business</option>
              <option value="hcd">Human Resource</option>
              <option value="social dev">Social Development</option>
            </select>
            {errors.eventCategory && (
              <p className="text-red-500 text-sm">{errors.eventCategory}</p>
            )}

            <button
              type="submit"
              className={`px-6 py-2 bg-orange-600 text-white rounded text-sm font-medium hover:bg-orange-700 transition duration-300 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing Up..." : "Sign Up Now"}
            </button>
          </form>
        ) : (
          /* Success Animation with Auto-Exit Progress Bar */
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="flex flex-col items-center justify-center text-orange-600"
          >
            <span className="text-5xl mb-2">🎉🎉🎉</span>
            <p className="text-xl font-semibold">Success!</p>
            <p className="text-sm text-gray-700 mt-1">
              Your Event signup was successful.
            </p>

            {/* Auto-exit Progress Bar */}
            <div className="w-full bg-gray-300 rounded-full h-3 mt-3">
              <div
                className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default SignupForm;
