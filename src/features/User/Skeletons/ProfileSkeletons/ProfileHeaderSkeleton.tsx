export default function ProfileHeaderSkeleton() {
  return (
    <div className="animate-pulse flex items-center gap-4">
      <div className="w-20 h-20 bg-gray-300 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-40 bg-gray-300 rounded" />
        <div className="h-3 w-60 bg-gray-300 rounded" />
        <div className="h-3 w-32 bg-gray-300 rounded" />
      </div>
    </div>
  );
}
