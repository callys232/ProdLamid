import { useState } from "react";
import { motion } from "framer-motion";

const Portfolio = ({ formData, handleChange, handleProceed }) => {
  const [resumeError, setResumeError] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      ![
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
      setResumeError("Only PDF or DOCX files are allowed.");
      e.target.value = ""; // Reset input
    } else {
      setResumeError("");
      handleChange(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="flex justify-center items-center min-h-screen"
    >
      {/* Form Frame */}
      <div className="bg-black p-6 rounded-lg shadow-lg w-full max-w-md backdrop-blur-lg border border-white/20">
        <h2 className="text-2xl font-bold text-red-700 mb-4 text-center">
          Tell us about your Business
        </h2>
        <p className="text-gray-400 mb-6 text-center">
          Complete the following details.
        </p>

        {/* Checkboxes Group */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-400 mb-2">
            Preferred Contact Method
          </h3>
          {["Email", "Phone", "WhatsApp"].map((method) => (
            <label key={method} className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                id={`contact_${method.toLowerCase()}`}
                onChange={handleChange}
              />
              {method}
            </label>
          ))}
        </div>

        {/* Radio Buttons with Tooltips */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-400 mb-2">
            Experience Level
          </h3>
          {["Beginner", "Intermediate", "Advanced", "Expert", "Master"].map(
            (level) => (
              <div key={level} className="relative group">
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="radio"
                    name="experience"
                    value={level.toLowerCase()}
                    onChange={handleChange}
                  />
                  {level}
                </label>
                <span className="absolute hidden group-hover:block bg-gray-700 text-white text-xs rounded px-2 py-1 left-0 top-full">
                  {`Description for ${level}`}
                </span>
              </div>
            )
          )}
        </div>

        {/* File Upload */}
        <h3 className="text-lg font-semibold text-gray-400 mb-2">
          Upload Your Resume/Business
        </h3>
        <input
          type="file"
          id="resume"
          className="w-full p-2 border rounded-lg mb-2 text-black"
          onChange={handleFileUpload}
        />
        {resumeError && <p className="text-red-500 text-sm">{resumeError}</p>}
      </div>
    </motion.div>
  );
};

export default Portfolio;
