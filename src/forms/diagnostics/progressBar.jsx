// const ProgressBar = ({ step, totalSteps }) => {
//   const progressPercentage = (step / totalSteps) * 100;

//   return (
//     <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", marginTop: "16px" }}>
//       {/* Step Indicator */}
//       <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "8px" }}>
//         Step {step} of {totalSteps}
//       </p>

//       {/* Progress Bar Container */}
//       <div style={{ width: "100%", backgroundColor: "#d1d5db", borderRadius: "999px", height: "16px", overflow: "hidden", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}>
//         {/* Animated Progress Bar */}
//         <div
//           style={{
//             background: "linear-gradient(to right, #ef4444, #b91c1c)",
//             height: "16px",
//             borderRadius: "999px",
//             transition: "width 0.5s ease-in-out",
//             width: `${progressPercentage}%`
//           }}
//         />
//       </div>
//     </div>
//   );
// };
import "./Progress.css";

const ProgressBar = ({ step, totalSteps }) => {
  const progressPercentage = (step / totalSteps) * 100;

  return (
    <div className="progress-container">
      {/* Step Indicator */}
      <p className="progress-text">
        Step {step} of {totalSteps}
      </p>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
