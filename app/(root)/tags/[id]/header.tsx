'use client';

import { BookOpenIcon, PlusIcon } from 'lucide-react';
import React, { memo, useEffect, useState } from 'react';

import TagCard from '@/components/cards/TagCard';
import ToggleSort from '@/components/toggle/ToggleSort';
import { Button } from '@/components/ui/button';
import { getTagDetails } from '@/lib/actions/tag.action';
import { TagIF } from '@/types/global';

const sortOptions = [
  { label: 'Newest', value: '-createdAt' },
  { label: 'Oldest', value: 'createdAt' },
  { label: 'Most Votes', value: '-votes' },
  { label: 'Least Votes', value: 'votes' },
];

const HeaderTagRelatedQuestionsPage = ({ id }: { id: string }) => {
  const [tag, setTag] = useState<TagIF | null>(null);
  useEffect(() => {
    const fetchTag = async () => {
      const { data, success } = await getTagDetails(id);
      console.log(data, 'asasdasda');
      if (!success) return null;
      const { id: tagId, name, questions } = data;
      setTag({ id: tagId, name, questions });
    };
    fetchTag();
  }, [id]);

  const renderTag = () => {
    if (!tag) return null;
    const { id: tagId, name, questions } = tag || {};

    return (
      <TagCard
        id={tagId}
        key={tagId}
        name={name}
        questions={questions}
        showCount={true}
        size="large"
        className="col-span-1 md:col-span-2 lg:col-span-3"
        classNameContent="!line-clamp-2"
      />
    );
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {renderTag()}
      <div className="col-span-1 flex flex-row flex-wrap items-center justify-between gap-2">
        <Button className="primary-button-gradient base-medium w-full font-medium">
          <PlusIcon />
          Add Tag
        </Button>
        <Button className="secondary-button-gradient base-medium w-full font-medium">
          <BookOpenIcon />
          Go to Wiki
        </Button>
        <ToggleSort
          sortArray={sortOptions}
          title="Sort by"
          className="w-full"
        />
      </div>
    </div>
  );
};

export default memo(HeaderTagRelatedQuestionsPage);
