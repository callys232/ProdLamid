export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-2 border-white/10 border-t-[#c21219] animate-spin" />
        <p className="text-xs text-gray-500 tracking-widest uppercase">Loading</p>
      </div>
    </div>
  );
}
