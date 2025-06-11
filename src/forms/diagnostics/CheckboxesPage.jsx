import { useState } from "react";
import { motion } from "framer-motion";

const BusinessDocsPage = ({ formData, handleChange, handleProceed }) => {
  const [fileError, setFileError] = useState("");

  // Handle File Upload Validation
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
      setFileError("Only PDF or DOCX files are allowed.");
      e.target.value = ""; // Reset input
    } else {
      setFileError("");
      handleChange({ target: { id: "businessDocs", value: file.name } });
    }
  };

  const radioOptions = [
    "Option 1",
    "Option 2",
    "Option 3",
    "Option 4",
    "Option 5",
    "Option 6",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="flex justify-center items-center min-h-screen"
    >
      {/* Form Frame */}
      <div className="bg-black p-6 rounded-lg shadow-lg w-full max-w-md backdrop-blur-lg border border-white/20">
        <h2 className="text-2xl font-bold text-blue-500 mb-4 text-center">
          Upload Business Documents
        </h2>
        <p className="text-gray-400 mb-6 text-center">
          Upload required business files (PDF/DOCX only).
        </p>

        {/* File Upload */}
        <input
          type="file"
          id="businessDocs"
          className="w-full p-3 border border-gray-400 rounded-lg mb-4 text-black focus:ring-2 focus:ring-blue-400 hover:shadow-md transition-all duration-300 ease-in-out"
          onChange={handleFileUpload}
        />
        {fileError && <p className="text-red-500 text-sm">{fileError}</p>}

        {/* Business Selection Table */}
        <h3 className="text-lg font-semibold text-gray-400 mb-4">
          Business Selection Table
        </h3>
        <table className="w-full border border-gray-500 rounded-lg overflow-hidden shadow-md">
          <thead>
            <tr className="bg-gray-700 text-white">
              {radioOptions.map((option, index) => (
                <th key={index} className="p-2">
                  {option}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, rowIndex) => (
              <tr key={rowIndex} className="border">
                {radioOptions.map((option, colIndex) => (
                  <td key={colIndex} className="p-2 text-center">
                    <input
                      type="radio"
                      name={`row${rowIndex}`}
                      value={option}
                      onChange={handleChange}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default BusinessDocsPage;
