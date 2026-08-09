export default function EducationSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-48 bg-gray-300 rounded" />
          <div className="h-3 w-32 bg-gray-300 rounded" />
        </div>
      ))}
    </div>
  );
}
