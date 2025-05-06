import { BookOpenIcon, PlusIcon } from 'lucide-react';
import React, { memo } from 'react';

import TagCard from '@/components/cards/TagCard';
import { Button } from '@/components/ui/button';
import { getTagDetails } from '@/lib/actions/tag.action';

const HeaderTagRelatedQuestionsPage = async ({ id }: { id: string }) => {
  const { data, success } = await getTagDetails(id);

  if (!success) return null;
  const { id: tagId, name, questions } = data;
  console.log(questions, 'questions');

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
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
      <div className="col-span-1 flex flex-col gap-2">
        <Button className="primary-button-gradient base-medium font-medium !text-light-900">
          <PlusIcon />
          Add Tag
        </Button>
        <Button className="secondary-button-gradient base-medium font-medium">
          <BookOpenIcon />
          Go to Wiki
        </Button>
      </div>
    </div>
  );
};

export default memo(HeaderTagRelatedQuestionsPage);
