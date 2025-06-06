import { Skeleton } from '@/components/ui/skeleton';

const TagRelatedQuestionsLoading = () => {
  return (
    <div className="flex flex-col gap-6">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="card-wrapper flex flex-col gap-4 p-6 sm:flex-row sm:items-center"
        >
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="size-4 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((tag) => (
                <Skeleton
                  key={tag}
                  className="h-6 w-16"
                />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 sm:flex-col sm:justify-center">
            <div className="flex items-center gap-2">
              <Skeleton className="size-4" />
              <Skeleton className="h-4 w-8" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="size-4" />
              <Skeleton className="h-4 w-8" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="size-4" />
              <Skeleton className="h-4 w-8" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TagRelatedQuestionsLoading;
