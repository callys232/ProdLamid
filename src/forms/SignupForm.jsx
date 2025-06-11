import { useState, useEffect } from "react";

const SignupForm = ({ closeModal }) => {
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("signupData");
    return savedData ? JSON.parse(savedData) : {
      fullname: "",
      address: "",
      city: "",
      state: "",
      maritalStatus: "",
      gender: "",
      email: "",
      eventCategory: "",
    };
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    localStorage.setItem("signupData", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);

      fetch("https://example.com/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then(() => {
          alert("Signup Successful!");
          setIsSubmitting(false);
          closeModal();
        })
        .catch(() => {
          alert("Signup failed. Please try again.");
          setIsSubmitting(false);
        });
    }
  };

  return (
    <div 
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-md transition-all duration-500" 
      onClick={closeModal}
    >
      <div 
        className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative transition-all duration-500" 
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside form
      >
        <button 
          onClick={closeModal} 
          className="absolute top-3 right-3 text-gray-700 hover:text-black transition-all"
        >
          ✖
        </button>
        <h2 className="text-center text-xl font-bold text-gray-800 mb-4">Signup Form</h2>

        <input type="text" id="fullname" placeholder="Full Name" className="w-full p-2 border rounded mb-2 text-black" onChange={handleChange} />

        <input type="email" id="email" placeholder="Email" className="w-full p-2 border rounded mb-2 text-black" onChange={handleChange} />

        <button 
          type="submit" 
          className={`glow-btn px-6 py-2 bg-orange-600 text-white rounded text-sm font-medium hover:bg-orange-700 transition-colors ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`} 
          disabled={isSubmitting}
        >
          {isSubmitting ? <Spinner /> : "Sign Up Now"}
        </button>
      </div>
    </div>
  );
};

const Spinner = () => (
  <div className="border-t-4 border-white border-solid rounded-full w-5 h-5 animate-spin mx-auto"></div>
);

export default SignupForm;
