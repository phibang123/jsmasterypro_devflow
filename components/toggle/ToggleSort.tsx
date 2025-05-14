'use client';

import { FilterIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { fromUrlQuery, removeKeysFromUrlQuery } from '@/lib/handlers/url.handler';
import { cn } from '@/lib/utils';

import { Button } from '../ui/button';

interface ToggleSortProps {
  sortArray: { label: string; value: string }[];
  title: string;
  className?: string;
}

const ToggleSort = ({ sortArray, className = '', title }: ToggleSortProps) => {
  const [selectedSort, setSelectedSort] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const sortParams = searchParams.get('sort');

  const handleSortClick = async (sort: string) => {
    let newUrl = '';
    if (sortParams === sort) {
      setSelectedSort('');
      newUrl = removeKeysFromUrlQuery({
        params: '',
        keysToRemove: ['sort'],
      });
    } else {
      setSelectedSort(sort);
      newUrl = fromUrlQuery({
        key: 'sort',
        params: '',
        value: sort,
      });
    }
    router.push(newUrl, { scroll: false });
  };

  const titleSortBy = () => {
    if (!sortParams) return title;
    const sort = sortArray.find((sort) => sort.value === sortParams);
    return sort?.label || title;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(
            `base-medium ${selectedSort ? 'primary-button-gradient' : 'secondary-button-gradient'} `,
            className,
          )}
        >
          <FilterIcon />
          {titleSortBy()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-2 w-48">
        {sortArray.map((sort) => {
          if (sort.label === 'separator') {
            return <DropdownMenuSeparator key={sort.value} />;
          }
          return (
            <DropdownMenuCheckboxItem
              key={sort.value}
              checked={sortParams === sort.value}
              className={cn(
                sortParams === sort.value && 'primary-button-gradient',
                'font-medium text-base !text-dark400_light500',
              )}
              onClick={() => handleSortClick(sort.value)}
            >
              <p>{sort.label}</p>
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ToggleSort;
