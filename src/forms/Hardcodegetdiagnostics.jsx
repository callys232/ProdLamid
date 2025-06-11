import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PersonalInfo from "./PersonalInfo";
import Portfolio from "./Portfolio";
import TablePage from "./TablePage";
import CheckboxesPage from "./CheckboxesPage";
import ReviewPage from "./ReviewPage";
import SuccessPage from "./SuccessPage";
import ProgressBar from "./ProgressBar";

const GetDiagnostics = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(true); // Controls blur & scrolling
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
    document.body.style.overflow = isFormOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [formData, isFormOpen]);

  const handleChange = (e) => {
    const { id, type, checked, value } = e.target;
    if (type === "checkbox") {
      setFormData((prevState) => ({
        ...prevState,
        checkboxes: checked
          ? [...prevState.checkboxes, id]
          : prevState.checkboxes.filter((opt) => opt !== id),
      }));
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (file && !allowedTypes.includes(file.type)) {
      alert("Only PDF or DOCX files are allowed.");
      e.target.value = "";
    } else {
      setFormData({ ...formData, [e.target.id]: file.name });
    }
  };

  const handleProceed = () => {
    if (step === 1 && !formData.fullname)
      return alert("Please enter your full name.");
    if (step === 2 && (!formData.email || !formData.email.includes("@")))
      return alert("Enter a valid email.");
    if (step === 3 && !formData.tableData.flat().some((cell) => cell !== ""))
      return alert("Fill in at least one table field.");

    setIsSubmitting(true);
    setTimeout(() => {
      setStep((prevStep) => Math.min(prevStep + 1, 6));
      setIsSubmitting(false);
    }, 1000);
  };

  const handlePrevious = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  return (
    <motion.div
      key={step}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={`min-h-screen flex justify-center items-center ${
        isFormOpen ? "bg-gray-900 backdrop-blur-md" : "bg-gray-900"
      }`}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        {/* Progress Bar */}
        <ProgressBar step={step} totalSteps={6} />

        {/* Step Components */}
        {step === 1 && <PersonalInfo handleChange={handleChange} />}
        {step === 2 && (
          <Portfolio formData={formData} handleChange={handleChange} />
        )}
        {step === 3 && (
          <TablePage formData={formData} handleChange={handleChange} />
        )}
        {step === 4 && <CheckboxesPage handleChange={handleChange} />}
        {step === 5 && <ReviewPage formData={formData} />}
        {step === 6 && <SuccessPage closeForm={() => setStep(1)} />}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-4">
          {step > 1 && step < 6 && (
            <button
              onClick={handlePrevious}
              className="bg-gray-700 text-white px-4 py-2 rounded"
            >
              Previous
            </button>
          )}
          {step < 6 &&
            (isSubmitting ? (
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                disabled
              >
                Processing...
              </button>
            ) : (
              <button
                onClick={handleProceed}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:shadow-lg"
              >
                {step === 5 ? "Submit" : "Proceed"}
              </button>
            ))}
        </div>
      </div>
    </motion.div>
  );
};

export default GetDiagnostics;
