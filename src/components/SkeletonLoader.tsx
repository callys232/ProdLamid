function SkeletonBase({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded bg-gray-200 dark:bg-[#1f1f1f] ${className}`} />
  );
}

export function SkeletonLoader() {
  return (
    <div className="animate-pulse p-6 space-y-4">
      <SkeletonBase className="h-6 w-1/3" />
      <SkeletonBase className="h-4 w-2/3" />
      <SkeletonBase className="h-4 w-1/2" />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="animate-pulse p-6 space-y-3 rounded-xl border border-gray-200 dark:border-white/10">
      <div className="flex items-center gap-3">
        <SkeletonBase className="h-10 w-10 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <SkeletonBase className="h-4 w-2/3" />
          <SkeletonBase className="h-3 w-1/3" />
        </div>
      </div>
      <SkeletonBase className="h-24 w-full" />
      <div className="flex gap-2">
        <SkeletonBase className="h-8 w-24 rounded-full" />
        <SkeletonBase className="h-8 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse space-y-2">
      <SkeletonBase className="h-10 w-full rounded-lg" />
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonBase key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  );
}
