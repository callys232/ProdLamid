import { Pie } from "react-chartjs-2";

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
          "#c21229",
          "rgba(194,18,41,0.6)",
          "#ffffff40",
          "#808080",
        ],
      },
    ],
  };
  return (
    <Pie
      data={data}
      options={{ plugins: { legend: { labels: { color: "#fff" } } } }}
    />
  );
}
