export default function FormLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-1/2"></div>
        </div>

        {/* Form Card Skeleton */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="space-y-6 animate-pulse">
            {/* Email Field Skeleton */}
            <div>
              <div className="h-5 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-12 bg-gray-100 rounded-lg w-full"></div>
            </div>

            {/* Motivation Field Skeleton */}
            <div>
              <div className="h-5 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-32 bg-gray-100 rounded-lg w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-28 mt-2"></div>
            </div>

            {/* Language Field Skeleton */}
            <div>
              <div className="h-5 bg-gray-200 rounded w-64 mb-2"></div>
              <div className="h-14 bg-gray-100 rounded-lg w-full"></div>
            </div>

            {/* Submit Button Skeleton */}
            <div className="h-12 bg-purple-200 rounded-lg w-full"></div>
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="mt-6 flex justify-center">
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
