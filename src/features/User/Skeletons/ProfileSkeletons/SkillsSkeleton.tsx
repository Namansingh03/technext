export default function SkillsSkeleton() {
  return (
    <div className="animate-pulse flex flex-wrap gap-2">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-6 w-20 bg-gray-300 rounded-full" />
      ))}
    </div>
  );
}
