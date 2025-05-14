import React, { Suspense } from 'react';

import QuestionsLoading from '@/components/loading/QuestionsLoading';
import HeaderTagLoading from '@/components/loading/tag/HeaderTagLoading';

import ContentTagRelatedQuestionsPage from './content';
import HeaderTagRelatedQuestionsPage from './header';

interface SearchParams {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string }>;
}

const TagRelatedQuestionsPage = async ({ params, searchParams }: SearchParams) => {
  const { id } = await params;
  const { page, pageSize, filter, sort } = await searchParams;
  const keyForProductList = `sort=${sort || ''}&filter=${filter || ''}`;

  return (
    <div>
      <Suspense
        key={`header-${id}`}
        fallback={<HeaderTagLoading />}
      >
        <HeaderTagRelatedQuestionsPage id={id} />
      </Suspense>
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
    </div>
  );
};

export default TagRelatedQuestionsPage;
