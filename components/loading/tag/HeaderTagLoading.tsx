import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

const HeaderTagLoading = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {/* Tag Card Skeleton */}
      <div className="background-light800_dark200 light-border col-span-1 flex h-[140px] flex-col gap-4 rounded-2xl border p-6 md:col-span-2 lg:col-span-3">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Action Buttons Skeleton */}
      <div className="col-span-1 flex flex-row flex-wrap items-center justify-between gap-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
};

export default HeaderTagLoading;
