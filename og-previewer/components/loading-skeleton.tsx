export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Preview cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-2.5">
            <div className="h-3 w-16 bg-zinc-700 rounded" />
            <div className="rounded-2xl ring-1 ring-white/[0.06] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
              <div className="aspect-[1.91/1] bg-zinc-700" />
              <div className="px-3 py-2.5 space-y-2 bg-zinc-800">
                <div className="h-2.5 w-1/3 bg-zinc-700 rounded" />
                <div className="h-3 w-3/4 bg-zinc-700 rounded" />
                <div className="h-2.5 w-full bg-zinc-700 rounded" />
                <div className="h-2.5 w-2/3 bg-zinc-700 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Diagnostics skeleton */}
      <div className="rounded-xl border border-zinc-700 overflow-hidden bg-zinc-800">
        <div className="px-4 py-3 border-b border-zinc-700 flex items-center justify-between">
          <div className="h-3.5 w-24 bg-zinc-700 rounded" />
          <div className="h-3 w-16 bg-zinc-700 rounded" />
        </div>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-2.5 border-b last:border-0 border-zinc-700"
          >
            <div className="w-4 h-4 rounded-full bg-zinc-700 flex-shrink-0" />
            <div className="h-3 w-40 bg-zinc-700 rounded" />
          </div>
        ))}
      </div>

      {/* Meta tags skeleton */}
      <div className="rounded-xl border border-zinc-700 overflow-hidden bg-zinc-800">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="h-3.5 w-20 bg-zinc-700 rounded" />
          <div className="w-4 h-4 bg-zinc-700 rounded" />
        </div>
      </div>
    </div>
  );
}
