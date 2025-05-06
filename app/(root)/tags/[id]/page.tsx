import React from 'react';

import ContentTagRelatedQuestionsPage from './content';
import HeaderTagRelatedQuestionsPage from './header';

interface SearchParams {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string }>;
}

const TagRelatedQuestionsPage = async ({ params, searchParams }: SearchParams) => {
  const { id } = await params;
  const { query, page, pageSize } = await searchParams;

  return (
    <div>
      <HeaderTagRelatedQuestionsPage id={id} />
      <ContentTagRelatedQuestionsPage
        id={id}
        page={page ? parseInt(page) : 1}
        pageSize={pageSize ? parseInt(pageSize) : 10}
        query={query}
      />
      {/* <Pagination
        page={page ? parseInt(page) : 1}
        totalPages={10}
        variant="rounded" // hoặc "default", "minimal"
        className="my-4"
      /> */}
    </div>
  );
};

export default TagRelatedQuestionsPage;
