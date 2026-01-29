export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-72"></div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Counter Card Skeleton */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full"></div>
                <div className="h-6 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="h-16 bg-gray-100 rounded w-24"></div>
            </div>
          </div>

          {/* Language Stats Card Skeleton */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 md:col-span-2">
            <div className="animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full"></div>
                <div className="h-6 bg-gray-200 rounded w-48"></div>
              </div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-5 bg-gray-200 rounded w-24"></div>
                    <div className="flex-1 h-4 bg-gray-100 rounded-full"></div>
                    <div className="h-5 bg-gray-200 rounded w-8"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Users Card Skeleton */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="animate-pulse">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full"></div>
              <div className="h-6 bg-gray-200 rounded w-40"></div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="h-5 bg-gray-200 rounded w-40 mb-1"></div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                  <div className="h-8 bg-purple-100 rounded w-24"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
