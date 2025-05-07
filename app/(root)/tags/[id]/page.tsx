import React, { Suspense } from 'react';

import ContentTagRelatedQuestionsPage from './content';
import HeaderTagRelatedQuestionsPage from './header';
import HomeLoading from '../../loading';

interface SearchParams {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string }>;
}

const TagRelatedQuestionsPage = async ({ params, searchParams }: SearchParams) => {
  const { id } = await params;
  const { page, pageSize, filter, sort } = await searchParams;

  return (
    <Suspense fallback={<HomeLoading />}>
      <HeaderTagRelatedQuestionsPage id={id} />
      <ContentTagRelatedQuestionsPage
        id={id}
        page={page ? parseInt(page) : 1}
        pageSize={pageSize ? parseInt(pageSize) : 10}
        filter={filter}
        sort={sort}
      />
      {/* <Pagination
        page={page ? parseInt(page) : 1}
        totalPages={10}
        variant="rounded" // hoặc "default", "minimal"
        className="my-4"
      /> */}
    </Suspense>
  );
};

export default TagRelatedQuestionsPage;
