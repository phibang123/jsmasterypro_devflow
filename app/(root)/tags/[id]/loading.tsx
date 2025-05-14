import React from 'react';

import QuestionsLoading from '@/components/loading/QuestionsLoading';
import HeaderTagLoading from '@/components/loading/tag/HeaderTagLoading';

const TagDetailLoading = () => {
  return (
    <>
      <HeaderTagLoading />
      <QuestionsLoading />
    </>
  );
};

export default TagDetailLoading;
