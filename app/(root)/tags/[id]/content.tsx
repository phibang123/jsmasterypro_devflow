import React from 'react';

import QuestionCard from '@/components/cards/QuestionCard';
import DataRenderer from '@/components/DataRenderer';
import { getTagQuestions } from '@/lib/actions/tag.action';
import { QuestionIF } from '@/types/global';

interface Props {
  id: string;
  page?: number;
  pageSize?: number;
  filter?: string;
  sort?: string;
}
const renderQuestions = (questions: QuestionIF[]) => {
  return questions.map((question) => (
    <QuestionCard
      key={question.id}
      question={question}
    />
  ));
};

const ContentTagRelatedQuestionsPage = async ({
  id,
  page = 1,
  pageSize = 10,
  filter,
  sort,
}: Props) => {
  const { data, success } = await getTagQuestions(id, { page, pageSize, sort, filter });
  const { questions } = data;

  return (
    <DataRenderer
      data={questions}
      success={success}
      render={renderQuestions}
      className="mt-4 flex flex-wrap gap-4"
    />
  );
};

export default ContentTagRelatedQuestionsPage;
