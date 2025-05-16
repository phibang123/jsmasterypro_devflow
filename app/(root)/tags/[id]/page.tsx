import React, { Suspense } from 'react';

import QuestionsLoading from '@/components/loading/QuestionsLoading';

import ContentTagRelatedQuestionsPage from './content';
import HeaderTagRelatedQuestionsPage from './header';
import TagDetailLoading from './loading';

interface SearchParams {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string }>;
}

const TagRelatedQuestionsPage = async ({ params, searchParams }: SearchParams) => {
  const { id } = await params;
  const { page, pageSize, filter, sort } = await searchParams;
  const keyForProductList = `sort=${sort || ''}&filter=${filter || ''}`;

  return (
    <Suspense fallback={<TagDetailLoading />}>
      <HeaderTagRelatedQuestionsPage id={id} />
      <Suspense
        key={`content-${keyForProductList}`}
        fallback={<QuestionsLoading />}
      >
        <ContentTagRelatedQuestionsPage
          id={id}
          page={page ? parseInt(page) : 1}
          pageSize={pageSize ? parseInt(pageSize) : 10}
          filter={filter}
          sort={sort}
        />
      </Suspense>
    </Suspense>
  );
};

export default TagRelatedQuestionsPage;
