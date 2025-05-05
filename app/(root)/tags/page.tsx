import React, { Suspense } from 'react';

import TagCard from '@/components/cards/TagCard';
import DataRenderer from '@/components/DataRenderer';
import LocalSearch from '@/components/search/LocalSearch';
import ROUTES from '@/constants/routes';
import { getTags } from '@/lib/actions/tag.action';
import { TagModelIF } from '@/types/model';

import TagsLoading from './loading';

const TagsPage = async () => {
  const response = await getTags({
    page: 1,
    pageSize: 10,
    query: '',
    sort: 'createdAt',
    filter: 'newest',
  });

  const { data, success } = response;

  const renderTags = (tags: TagModelIF[]) => {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {tags.map((tag: TagModelIF) => (
          <TagCard
            id={tag.id}
            key={tag.id}
            name={tag.name}
            questions={tag.questions}
            showCount={true}
            size="medium"
            // showCount
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <h1 className="h1-bold text-dark100_light900 text-3xl">Tags</h1>
      <section className="mt-4 flex flex-wrap gap-9">
        <LocalSearch
          route={ROUTES.TAGS}
          placeholder="Search by tag name..."
          otherClasses="flex-1"
          iconPosition="left"
          imgSrc="/icons/search.svg"
        />
      </section>
      <Suspense fallback={<TagsLoading />}>
        <DataRenderer
          data={data.tags}
          success={success}
          render={renderTags}
          className="mt-8 flex flex-wrap gap-4"
        />
      </Suspense>
    </>
  );
};

export default TagsPage;
