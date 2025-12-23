import { Bar } from "react-chartjs-2";

export default function EscrowBarChart({
  summary,
}: {
  summary: { labels: string[]; counts: number[]; amounts?: number[] };
}) {
  const data = {
    labels: summary.labels,
    datasets: [
      {
        label: "Transactions",
        data: summary.counts,
        backgroundColor: "#c21229",
      },
      {
        label: "Amount ($)",
        data: summary.amounts ?? [],
        backgroundColor: "#ffffff40",
      },
    ],
  };
  return (
    <Bar
      data={data}
      options={{ plugins: { legend: { labels: { color: "#fff" } } } }}
    />
  );
}
