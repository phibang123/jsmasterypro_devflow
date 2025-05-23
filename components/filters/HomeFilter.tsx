'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

import { fromUrlQuery, removeKeysFromUrlQuery } from '@/lib/handlers/url.handler';
import { cn } from '@/lib/utils';

import { Button } from '../ui/button';

const filters = [
  { name: 'React', value: 'react' },
  { name: 'Javascript', value: 'javascript' },
  // { name: "Newest", value: "newest" },
  // { name: "Popular", value: "popular" },
  // { name: "Unanswered", value: "unanswered" },
  // { name: "Recommended", value: "recommended" },
];

const HomeFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterParams = searchParams.get('filter');
  const [active, setActive] = useState(filterParams || '');

  const handleTypeClick = (filter: string) => {
    const filterString = 'filter';
    let newUrl = '';
    if (filter === active) {
      setActive('');
      newUrl = removeKeysFromUrlQuery({
        params: searchParams.toString(),
        keysToRemove: [filterString],
      });
    } else {
      setActive(filter);
      newUrl = fromUrlQuery({
        key: 'filter',
        params: searchParams.toString(),
        value: filter.toLowerCase(),
      });
    }

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="mt-4 hidden flex-wrap gap-3 sm:flex">
      {filters.map((filter) => {
        return (
          <Button
            className={cn(
              'body-medium rounded-lg px-6 py-3 capitalize shadow-none text-light-900',
              active === filter.value
                ? 'third-button-gradient_focus'
                : 'third-button-gradient_no-focus',
            )}
            key={filter.name}
            onClick={() => handleTypeClick(filter.value)}
          >
            {filter.name}
          </Button>
        );
      })}
    </div>
  );
};

export default HomeFilter;
