import { useState } from "react";

const ReserveSlot = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    address: "",
    city: "",
    state: "",
    // maritalStatus: "",
    gender: "",
    email: "",
    eventCategory: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setIsSubmitting(true); // Show loading spinner

      fetch("https://example.com/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then(() => {
          alert("Signup Successful!");
          setIsSubmitting(false);
          closeModal(); // Close modal after successful signup
        })
        .catch(() => {
          alert("Signup failed. Please try again.");
          setIsSubmitting(false);
        });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full"
      >
        <h2 className="text-center text-xl font-bold text-gray-800 mb-4">
          Reserve your Slot
        </h2>

        <input
          type="text"
          id="fullname"
          placeholder="Full Name"
          className="w-full p-2 border rounded mb-2 text-black"
          onChange={handleChange}
        />
        {errors.fullname && (
          <p className="text-orange-500 text-sm">{errors.fullname}</p>
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
        {/* 
        <select
          id="maritalStatus"
          className="w-full p-2 border rounded mb-2 text-black"
          onChange={handleChange}
        >
          <option value="">Marital Status</option>
          <option value="single">Single</option>
          <option value="married">Married</option>
          <option value="divorced">Divorced</option>
        </select> */}

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

        <input
          type="email"
          id="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-2 text-black"
          onChange={handleChange}
        />
        {errors.email && <p className="text-orange-500 text-sm">{errors.email}</p>}

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
          <p className="text-orange-500 text-sm">{errors.eventCategory}</p>
        )}

        <button
          type="submit"
          className={`px-6 py-2 bg-orange-600 text-white rounded text-sm font-medium hover:bg-orange-700 transition-colors ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Reserve slt..." : "Reserve Now"}
        </button>
      </form>
    </div>
  );
};

export default ReserveSlot;
