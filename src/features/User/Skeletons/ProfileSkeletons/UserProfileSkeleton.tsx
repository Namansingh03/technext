export default function UserProfileSkeleton() {
  return (
    <div className="w-full relative animate-pulse">
      {/* Header */}
      <div className="h-72 w-full bg-surface-container-high" />

      {/* Main Layout */}
      <div className="w-full flex justify-center absolute top-60 px-10 gap-x-10">
        {/* Sidebar */}
        <div className="w-[320px] shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col gap-5">
            {/* Avatar */}
            <div className="w-28 h-28 rounded-full bg-surface-container-high mx-auto" />

            {/* Name */}
            <div className="h-5 w-40 mx-auto rounded bg-surface-container-high" />

            {/* Headline */}
            <div className="h-4 w-52 mx-auto rounded bg-surface-container-high" />

            {/* Buttons */}
            <div className="space-y-3 mt-2">
              <div className="h-10 rounded-xl bg-surface-container-high" />
              <div className="h-10 rounded-xl bg-surface-container-high" />
            </div>

            {/* Skills */}
            <div className="space-y-3 pt-3">
              <div className="h-4 w-24 rounded bg-surface-container-high" />

              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-8 w-20 rounded-full bg-surface-container-high"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-2xl flex flex-col gap-5">
          {/* About */}
          <div className="bg-white rounded-2xl border p-6 space-y-4">
            <div className="h-5 w-28 rounded bg-surface-container-high" />

            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-surface-container-high" />
              <div className="h-4 w-full rounded bg-surface-container-high" />
              <div className="h-4 w-3/4 rounded bg-surface-container-high" />
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white rounded-2xl border p-6 space-y-5">
            <div className="h-5 w-36 rounded bg-surface-container-high" />

            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-52 rounded bg-surface-container-high" />
                <div className="h-4 w-40 rounded bg-surface-container-high" />
                <div className="h-3 w-32 rounded bg-surface-container-high" />
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="bg-white rounded-2xl border p-6 space-y-5">
            <div className="h-5 w-32 rounded bg-surface-container-high" />

            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-56 rounded bg-surface-container-high" />
                <div className="h-4 w-44 rounded bg-surface-container-high" />
                <div className="h-3 w-28 rounded bg-surface-container-high" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
