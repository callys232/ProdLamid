import { useState } from "react";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    eventCategory: "",
  });

  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Form validation
  const validateForm = () => {
    let newErrors = {};

    if (formData.fullname.length < 3) {
      newErrors.fullname = "Full Name must be at least 3 characters.";
    }

    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.eventCategory) {
      newErrors.eventCategory = "Please select an event category.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      fetch("https://example.com/signup", {
        // Replace with actual API
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then(() => alert("Signup Successful!"))
        .catch(() => alert("Signup failed. Please try again."));
    }
  };

  return (
    <div className="flex justify-center mb-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-gray-100 p-6 rounded-md"
      >
        <input
          type="text"
          id="fullname"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Full Name"
          value={formData.fullname}
          onChange={handleChange}
        />
        {errors.fullname && (
          <p className="text-red-500 text-sm">{errors.fullname}</p>
        )}

        <input
          type="email"
          id="email"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        <select
          id="eventCategory"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={formData.eventCategory}
          onChange={handleChange}
        >
          <option value="">Event Category</option>
          <option value="tech">Tech</option>
          <option value="business">Business</option>
        </select>
        {errors.eventCategory && (
          <p className="text-red-500 text-sm">{errors.eventCategory}</p>
        )}

        <button
          type="submit"
          className="px-6 py-2 bg-orange-600 text-white rounded text-sm font-medium hover:bg-orange-700 transition-colors"
        >
          Sign Up Now
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
