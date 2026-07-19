// components/escrow/EscrowActions.tsx
import { EscrowStatus } from "@/types/escrow";

interface Props {
  status: EscrowStatus;
  onFund?: () => void;
  onRelease?: () => void;
  onMarkComplete?: () => void;
  onDispute?: () => void;
}

export function EscrowActions({
  status,
  onFund,
  onRelease,
  onMarkComplete,
  onDispute,
}: Props) {
  switch (status) {
    case "pending":
      return (
        <ActionButton onClick={onFund} variant="primary">
          Fund Escrow
        </ActionButton>
      );

    case "funded":
    case "in_progress":
      return (
        <div className="flex gap-3">
          <ActionButton onClick={onRelease} variant="success">
            Release Funds
          </ActionButton>
          <ActionButton onClick={onDispute} variant="danger">
            Raise Dispute
          </ActionButton>
        </div>
      );

    case "released":
      return (
        <ActionButton onClick={onMarkComplete} variant="secondary">
          Mark Work Completed
        </ActionButton>
      );

    case "completed":
      return (
        <span className="text-sm text-gray-400">Project fully closed</span>
      );

    case "disputed":
      return <span className="text-sm text-blue-400">Awaiting resolution</span>;

    default:
      return null;
  }
}

function ActionButton({
  children,
  onClick,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "success" | "secondary" | "danger";
}) {
  const styles = {
    primary: "bg-blue-600 hover:bg-blue-700",
    success: "bg-green-600 hover:bg-green-700",
    secondary: "bg-gray-700 hover:bg-gray-600",
    danger: "bg-blue-800 hover:bg-blue-900",
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-all hover:scale-[1.03] active:scale-95 ${styles[variant]}`}
    >
      {children}
    </button>
  );
}
