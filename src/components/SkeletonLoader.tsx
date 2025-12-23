export function SkeletonLoader() {
  return (
    <div className="animate-pulse p-6 space-y-4">
      <div className="h-6 bg-[#1f1f1f] rounded w-1/3"></div>
      <div className="h-4 bg-[#1f1f1f] rounded w-2/3"></div>
      <div className="h-4 bg-[#1f1f1f] rounded w-1/2"></div>
    </div>
  );
}
