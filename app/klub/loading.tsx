import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 pt-16">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Skeleton className="h-10 w-[300px] sm:w-[500px] lg:w-[700px] mx-auto" />
                <Skeleton className="h-6 w-[250px] sm:w-[400px] lg:w-[600px] mx-auto" />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <Skeleton className="h-8 w-[200px] mx-auto mb-8" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center text-center p-4 border rounded-lg shadow-sm">
                  <Skeleton className="h-24 w-24 rounded-full mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-10 w-2/3" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
