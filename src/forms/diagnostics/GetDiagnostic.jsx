import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PersonalInfo from "./PersonalInfo";
import Portfolio from "./portfolio";
import TablePage from "./TablePage";
import CheckboxesPage from "./CheckboxesPage";
import ReviewPage from "./ReviewPage";
import SuccessPage from "./SuccessPage";
import ProgressBar from "./progressBar";

const GetDiagnostics = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState(() => {
    try {
      const savedData = localStorage.getItem("formData");
      return savedData
        ? JSON.parse(savedData)
        : {
            fullname: "",
            email: "",
            gender: "",
            address: "",
            city: "",
            state: "",
            eventCategory: "",
            resume: null,
            businessDocs: null,
            tableData: Array(4).fill(Array(5).fill("")),
            checkboxes: [],
          };
    } catch (error) {
      console.error("Error loading form data:", error);
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    document.body.style.overflow = isFormOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isFormOpen]);

  const validateInputs = () => {
    if (step === 1 && !formData.fullname)
      return setError("Enter your full name.");
    if (step === 2 && (!formData.email || !formData.email.includes("@")))
      return setError("Enter a valid email.");
    if (step === 3 && !formData.tableData.flat().some((cell) => cell !== ""))
      return setError("Fill in at least one table field.");
    if (step === 4 && formData.checkboxes.length === 0)
      return setError("Select at least one option.");

    setError("");
    return true;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (file && !allowedTypes.includes(file.type)) {
      setError("Only PDF or DOCX files are allowed.");
      e.target.value = "";
      return;
    }

    setFormData({ ...formData, [e.target.id]: file.name });
    setError("");
  };

  const handleProceed = () => {
    if (!validateInputs()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setStep((prevStep) => Math.min(prevStep + 1, 6));
      setIsSubmitting(false);
    }, 1000);
  };

  const handlePrevious = () => setStep((prevStep) => Math.max(prevStep - 1, 1));
  return (
    <motion.div
      key={step}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={`min-h-screen flex flex-col justify-center items-center ${
        isFormOpen
          ? "bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-lg"
          : "bg-transparent"
      }`}
    >
      <div className="bg-black p-6 rounded-lg shadow-lg w-full max-w-md">
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {step === 1 && <PersonalInfo handleChange={validateInputs} />}
        {step === 2 && (
          <Portfolio formData={formData} handleChange={validateInputs} />
        )}
        {step === 3 && (
          <TablePage formData={formData} handleChange={validateInputs} />
        )}
        {step === 4 && <CheckboxesPage handleChange={validateInputs} />}
        {step === 5 && <ReviewPage formData={formData} />}
        {step === 6 && <SuccessPage closeForm={() => setStep(1)} />}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-4">
          {step > 1 && step < 6 && (
            <button className="bg-red-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out hover:bg-red-800 hover:scale-105">
              Previous
            </button>
          )}
          {step < 6 && (
            <button
              onClick={handleProceed}
              className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out hover:bg-red-700 hover:scale-105"
            >
              {step === 5 ? "Submit" : "Proceed"}
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar BELOW the form */}
      <div className="w-full max-w-md p-4 mt-6">
        <ProgressBar step={step} totalSteps={6} />
      </div>
    </motion.div>
  );
};

export default GetDiagnostics;
