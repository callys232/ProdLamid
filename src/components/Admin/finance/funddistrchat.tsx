"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

// Register the elements needed for a Pie chart
ChartJS.register(ArcElement, Tooltip, Legend);

export default function FundDistributionChart({
  completed,
  pending,
  available,
  held,
}: {
  completed: number;
  pending: number;
  available: number;
  held: number;
}) {
  const data = {
    labels: ["Completed", "Pending", "Available", "Held"],
    datasets: [
      {
        data: [completed, pending, available, held],
        backgroundColor: [
          "#c21229", // Completed
          "rgba(194,18,41,0.6)", // Pending
          "#ffffff40", // Available
          "#808080", // Held
        ],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          color: "#fff", // white legend text
        },
      },
    },
  };

  return <Pie data={data} options={options} />;
}
