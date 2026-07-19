import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const SuccessPage = ({ setShowForm, setShowModal }) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Start fade-out animation after 4 seconds
    const fadeTimer = setTimeout(() => setIsFading(true), 4000);

    // Close form and modal after fade-out completes
    const closeTimer = setTimeout(() => {
      setShowForm(false); // Hide form
      setShowModal(false); // Close modal
    }, 5000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(closeTimer);
    };
  }, [setShowForm, setShowModal]); // Ensure both states update correctly

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className={`flex justify-center items-center min-h-screen ${
        isFading
          ? "opacity-0 transition-opacity duration-1000 ease-in-out"
          : "opacity-100"
      }`}
    >
      {/* Success Page Frame */}
      <div className="bg-black p-6 rounded-lg shadow-lg w-full max-w-md backdrop-blur-lg border border-white/20 text-white text-center">
        <span className="text-5xl mb-2 text-blue-500">🎉</span>
        <h2 className="text-3xl font-bold mb-3">Success!</h2>
        <p className="text-gray-400 mb-6">
          Your form has been submitted successfully.
        </p>

        {/* Exit Timer Indicator */}
        <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden mt-4">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-blue-700 h-4 rounded-full transition-all duration-500 ease-in-out"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5 }} // Progress bar fills in 5 seconds
          />
        </div>
      </div>
    </motion.div>
  );
};

export default SuccessPage;
