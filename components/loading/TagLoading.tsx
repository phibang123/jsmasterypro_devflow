import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

const TagsLoading = () => {
  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
          <div
            key={item}
            className="light-border background-light900_dark200 flex flex-col rounded-[10px] border p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="mt-2 grid grid-cols-2 items-center justify-between gap-2">
              <Skeleton className="h-6 w-1/2 sm:h-6 sm:w-24" />
              <Skeleton className="hidden h-6 w-1/2 sm:block sm:h-6 sm:w-24" />
              <Skeleton className="h-6 w-1/2 sm:h-6 sm:w-24" />
              <Skeleton className="hidden h-6 w-1/2 sm:block sm:h-6 sm:w-24" />
            </div>

            <div className="mt-2 flex items-center justify-between gap-2">
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TagsLoading;
