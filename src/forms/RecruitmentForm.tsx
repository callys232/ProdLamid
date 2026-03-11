import { useState } from "react";

// Props interface
interface RecruitmentFormProps {
  closeModal: () => void;
  user: unknown; // Replace with a proper user type if known
}

// Form data interface
interface FormData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  department: string;
  linkedin: string;
  experience: string;
  certifications: string;
  track: string;
  date: string;
  mode: string;
  // dietary: string;
  accessibility: string;
  consent: string;
  comments: string;
  interest: string;
  formType: string;
}

// Initial form state
const initialFormData: FormData = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  jobTitle: "",
  department: "",
  linkedin: "",
  experience: "",
  certifications: "",
  track: "",
  date: "",
  mode: "",
  // dietary: "",
  accessibility: "",
  consent: "",
  comments: "",
  interest: "",
  formType: "Recruitment", // for MongoDB tagging
};

const RecruitmentForm: React.FC<RecruitmentFormProps> = ({
  closeModal,
  user,
}) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const requiredFields: (keyof FormData)[] = [
      "fullName",
      "email",
      "company",
      "track",
      "date",
      "mode",
      "consent",
      "interest",
    ];
    const newErrors: Record<string, string> = {};

    requiredFields.forEach((key) => {
      if (!formData[key]?.trim()) {
        newErrors[key] = "This field is required";
      }
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.phone && !/^\+?\d{7,15}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });
    if (cvFile) payload.append("cv", cvFile);

    try {
      const res = await fetch("/api/recruitment", {
        method: "POST",
        body: payload,
      });

      const result = await res.json();
      if (res.ok) {
        setShowSuccess(true);
        setFormData(initialFormData);
        setCvFile(null);
        setErrors({});
      } else {
        throw new Error(result.message || "Submission failed.");
      }
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalFields = Object.keys(formData).length - 1; // exclude formType
  const filledFields = Object.entries(formData).filter(
    ([key, value]) => key !== "formType" && value.trim() !== ""
  ).length;
  const progress = Math.round((filledFields / totalFields) * 100);

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 text-white max-w-2xl mx-auto p-6 bg-black bg-opacity-80 rounded-xl backdrop-blur-md"
      aria-label="HCD Recruitment Registration Form"
    >
      <h2 className="text-3xl font-bold text-orange-500 mb-6">
        HCD Recruitment Registration
      </h2>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-white/20 rounded-full h-4">
          <div
            className="bg-orange-500 h-4 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-white text-right mt-1">
          {progress}% completed
        </p>
      </div>

      {/* Text Inputs */}
      {(
        [
          ["fullName", "Full Name"],
          ["email", "Email Address"],
          ["phone", "Phone Number"],
          ["company", "Company Name"],
          ["jobTitle", "Job Title"],
          ["department", "Department"],
          ["linkedin", "LinkedIn Profile"],
          ["experience", "Years of Experience"],
          ["certifications", "Certifications"],
        ] as [keyof FormData, string][]
      ).map(([name, placeholder]) => (
        <div key={name}>
          <input
            type="text"
            name={name}
            value={formData[name]}
            onChange={handleChange}
            placeholder={placeholder}
            aria-label={placeholder}
            className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
          />
          {errors[name] && (
            <p className="text-red-400 text-sm">{errors[name]}</p>
          )}
        </div>
      ))}

      {/* Select Track */}
      <select
        name="track"
        value={formData.track}
        onChange={handleChange}
        aria-label="Select Recruitment Track"
        className="w-full px-4 py-2 rounded-lg border border-white/30 bg-black text-orange focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
      >
        <option value="">Select Recruitment Track</option>
        <option value="Leadership Development">Leadership Development</option>
        <option value="Project Management">Project Management</option>
        <option value="Sales Enablement">Sales Enablement</option>
        <option value="Digital Transformation">Digital Transformation</option>
      </select>
      {errors.track && <p className="text-red-400 text-sm">{errors.track}</p>}

      {/* Date */}
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        aria-label="Preferred Start Date"
        className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
      />
      {errors.date && <p className="text-red-400 text-sm">{errors.date}</p>}

      {/* Mode */}
      <select
        name="mode"
        value={formData.mode}
        onChange={handleChange}
        aria-label="Mode of Work"
        className="w-full px-4 py-2 rounded-lg border border-white/30 bg-black text-orange focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
      >
        <option value="">Mode of Work</option>
        <option value="Remote">Remote</option>
        {/* <option value="Hybrid">Hybrid</option>
        <option value="Onsite">Onsite</option> */}
      </select>
      {errors.mode && <p className="text-red-400 text-sm">{errors.mode}</p>}

      {/* Optional fields */}
      {/* <input
        type="text"
        name="dietary"
        value={formData.dietary}
        onChange={handleChange}
        placeholder="Dietary Restrictions (if any)"
        aria-label="Dietary Restrictions"
        className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
      /> */}
      <input
        type="text"
        name="accessibility"
        value={formData.accessibility}
        onChange={handleChange}
        placeholder="Accessibility Needs (if any)"
        aria-label="Accessibility Needs"
        className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
      />

      {/* Consent */}
      <select
        name="consent"
        value={formData.consent}
        onChange={handleChange}
        aria-label="Consent to Record"
        className="w-full px-4 py-2 rounded-lg border border-white/30 bg-black text-orange focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
      >
        <option value="">Consent to Record</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
      {errors.consent && (
        <p className="text-red-400 text-sm">{errors.consent}</p>
      )}

      {/* Comments */}
      <textarea
        name="comments"
        value={formData.comments}
        onChange={handleChange}
        placeholder="Additional Comments or Questions"
        aria-label="Additional Comments"
        rows={3}
        className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
      />

      <textarea
        name="interest"
        value={formData.interest}
        onChange={handleChange}
        placeholder="Why are you interested in this track?"
        aria-label="Reason for Interest"
        rows={5}
        className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
      />
      {errors.interest && (
        <p className="text-red-400 text-sm">{errors.interest}</p>
      )}

      {/* CV Upload */}
      <div>
        <label className="block mb-2 text-white" htmlFor="cv-upload">
          Upload CV (PDF or DOC)
        </label>
        <input
          id="cv-upload"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
          aria-label="Upload CV"
          className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white file:text-white file:bg-orange-500 file:border-none file:px-4 file:py-2 file:rounded-lg file:cursor-pointer"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${isSubmitting
          ? "bg-gray-500 cursor-not-allowed"
          : "bg-orange-500 hover:bg-orange-600"
          }`}
      >
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </button>

      {showSuccess && (
        <p className="text-green-400 text-center mt-4">
          ✅ Your application has been submitted successfully!
        </p>
      )}

      {/* Close button */}
      <button
        type="button"
        onClick={closeModal}
        className="w-full py-2 px-6 mt-2 rounded-lg font-semibold bg-gray-700 hover:bg-gray-800 transition-all duration-300"
      >
        Close
      </button>
    </form>
  );
};

export default RecruitmentForm;
