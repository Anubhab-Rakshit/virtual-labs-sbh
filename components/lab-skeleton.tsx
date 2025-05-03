export default function LabSkeleton() {
  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative aspect-video rounded-lg overflow-hidden mb-6 bg-muted animate-pulse" />

          <div className="h-10 bg-muted animate-pulse rounded-md mb-4 w-1/3" />

          <div className="space-y-2 mb-6">
            <div className="h-4 bg-muted animate-pulse rounded-md w-full" />
            <div className="h-4 bg-muted animate-pulse rounded-md w-full" />
            <div className="h-4 bg-muted animate-pulse rounded-md w-3/4" />
          </div>

          <div className="h-10 bg-muted animate-pulse rounded-md mb-4 w-full" />

          <div className="space-y-2">
            <div className="h-4 bg-muted animate-pulse rounded-md w-full" />
            <div className="h-4 bg-muted animate-pulse rounded-md w-full" />
            <div className="h-4 bg-muted animate-pulse rounded-md w-2/3" />
          </div>
        </div>

        <div>
          <div className="h-12 bg-muted animate-pulse rounded-md mb-6" />

          <div className="space-y-4">
            <div className="h-8 bg-muted animate-pulse rounded-md" />
            <div className="h-8 bg-muted animate-pulse rounded-md" />
            <div className="h-8 bg-muted animate-pulse rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}
