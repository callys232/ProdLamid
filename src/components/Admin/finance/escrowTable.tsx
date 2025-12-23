type EscrowTx = {
  id: string;
  project: string;
  date: string;
  amount: number;
  status: "Held" | "Released" | "Pending";
};

export default function EscrowTable({
  transactions,
}: {
  transactions: EscrowTx[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-gray-300">
        <thead>
          <tr className="text-gray-400 border-b border-[#1f1f1f]">
            <th>ID</th>
            <th>Project</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr
              key={tx.id}
              className="border-b border-[#1f1f1f] hover:bg-[#c21229]/20 transition-colors"
            >
              <td>{tx.id}</td>
              <td>{tx.project}</td>
              <td>{new Date(tx.date).toLocaleDateString()}</td>
              <td>${tx.amount.toLocaleString()}</td>
              <td>{tx.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
