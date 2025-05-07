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
  //   onSortChange: (sort: string) => void;
}

const ToggleSort = ({
  sortArray,
  className = '',
  title,
  //   onSortChange,
}: ToggleSortProps) => {
  const [selectedSort, setSelectedSort] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const sortParams = searchParams.get('sort');
  const handleSortClick = (sort: string) => {
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(
            `${selectedSort ? 'primary-button-gradient !text-light-900' : 'secondary-button-gradient'} base-medium font-medium `,
            className,
          )}
        >
          <FilterIcon />
          {title}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        {sortArray.map((sort) => {
          if (sort.label === 'separator') {
            return <DropdownMenuSeparator key={sort.value} />;
          }
          return (
            <DropdownMenuCheckboxItem
              key={sort.value}
              checked={sortParams === sort.value}
              className={cn(sortParams === sort.value && 'primary-button-gradient !text-light-900')}
              onClick={() => handleSortClick(sort.value)}
            >
              <p className={cn(sortParams === sort.value && '!text-light-900')}>{sort.label}</p>
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ToggleSort;
