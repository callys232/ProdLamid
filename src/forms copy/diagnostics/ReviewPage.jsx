import { motion } from "framer-motion";

const ReviewPage = ({ formData, handlePrevious, handleSubmit }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center text-center"
    >
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        Review Your Submission
      </h2>
      <p className="text-gray-600 mb-6">
        Please confirm your details before submitting.
      </p>

      <div className="text-left w-full max-w-md">
        <p>
          <strong>Full Name:</strong> {formData.fullname}
        </p>
        <p>
          <strong>Email:</strong> {formData.email}
        </p>
        <p>
          <strong>Phone:</strong> {formData.phone}
        </p>
        <p>
          <strong>Address:</strong> {formData.address}, {formData.city},{" "}
          {formData.state}
        </p>
        <p>
          <strong>Gender:</strong> {formData.gender}
        </p>
        <p>
          <strong>Event Category:</strong> {formData.eventCategory}
        </p>
        <p>
          <strong>Resume:</strong>{" "}
          {formData.resume ? formData.resume : "Not uploaded"}
        </p>
        <p>
          <strong>Business Documents:</strong>{" "}
          {formData.businessDocs ? formData.businessDocs : "Not uploaded"}
        </p>
      </div>

      <button
        onClick={handlePrevious}
        className="mt-6 px-6 py-2 bg-gray-700 text-white rounded text-lg font-medium hover:bg-gray-800 transition duration-300"
      >
        Edit Details
      </button>
    </motion.div>
  );
};

export default ReviewPage;
