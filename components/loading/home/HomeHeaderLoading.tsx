import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

const HomeHeaderLoading = () => {
  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <Skeleton className="h-14 w-[180px]" />
        <Skeleton className="h-10 w-[140px]" />
      </section>

      <Skeleton className="mt-4 h-10 w-full" />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {[1, 2, 3, 4].map((item) => (
          <Skeleton
            key={item}
            className="h-9 w-[100px]"
          />
        ))}
      </div>
    </>
  );
};

export default HomeHeaderLoading;
