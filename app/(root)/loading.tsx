import { Skeleton } from "@/components/ui/skeleton";

const HomeLoading = () => {
  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-12 w-[150px]" />
      </section>

      <section className="mt-8">
        <Skeleton className="h-12 w-full" />
      </section>

      <div className="mt-8 flex gap-4">
        <Skeleton className="h-10 w-[100px]" />
        <Skeleton className="h-10 w-[100px]" />
        <Skeleton className="h-10 w-[100px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>

      <div className="mt-8 flex w-full flex-col gap-6">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="card-wrapper background-light800_dark300 flex gap-3 rounded-[10px] p-5 sm:px-8"
          >
            <div className="hidden sm:flex">
              <div className="flex grow gap-2 sm:flex-col">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <div className="flex-1">
              <Skeleton className="mb-2 h-6 w-full" />
              <Skeleton className="mb-4 h-4 w-3/4" />

              <div className="mt-4 flex w-full flex-col flex-wrap sm:mt-0">
                <div className="sm:hidden">
                  <div className="flex grow gap-2 sm:flex-col">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                <div className="flex w-full flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-1 flex-wrap gap-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-8 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default HomeLoading;
