import { Pencil } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

import { auth } from '@/auth';
import TagCard from '@/components/cards/TagCard';
import DataRenderer from '@/components/DataRenderer';
import Metric from '@/components/Metric';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants';
import { getQuestionById } from '@/lib/actions/question.action';
import { getTimeStamp } from '@/lib/utils';
import { QuestionIF, TagIF } from '@/types/global';

import QuestionDetailLoading from './loading';

const QuestionDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const { data: question, success } = await getQuestionById(id);

  const session = await auth();

  const renderEditButton = (authorId: string) => {
    if (authorId !== session?.user?.id) return null;

    return (
      <Button
        asChild
        className="primary-button-gradient base-medium min-h-[20px] px-4 py-3"
      >
        <Link href={ROUTES.EDIT_QUESTION(question.id)}>
          <Pencil />
          Edit Question
        </Link>
      </Button>
    );
  };

  const renderTagCard = (tags: TagIF[]) => {
    return tags.map((tag: TagIF) => (
      <TagCard
        key={tag.id}
        id={tag.id}
        name={tag.name}
        compact
      />
    ));
  };

  const renderQuestionDetail = (question: QuestionIF) => {
    const {
      title,
      author,
      createdAt,
      upVotes,
      downVotes,
      views,
      answers,
      content,
      tags,
      description,
      updatedAt,
    } = question;

    return (
      <div className="w-full flex-col">
        <div className="flex items-center justify-between">
          <Metric
            imgUrl={author.image}
            alt="user avatar"
            value={author.name}
            title={`•`}
            href={`/profile/${author.name}`}
            textStyles="base-semibold text-light400_light500 !tracking-wide"
            isAuthor
          />
          <div className="flex items-center gap-3">
            <Metric
              imgUrl="/icons/upvote.svg"
              alt="upVotes"
              value={upVotes}
              title={``}
              href={`/profile/${author.name}`}
              textStyles="body-medium text-light400_light500"
            />
            <Metric
              imgUrl="/icons/downvote.svg"
              alt="downVotes"
              value={downVotes}
              title={``}
              href={`/profile/${author.name}`}
              textStyles="body-medium text-light400_light500"
            />
          </div>
        </div>
        <h1 className="sm:h1-bold base-semibold text-dark200_light900 primary-text-gradient mt-4 !tracking-wide">
          {title}
        </h1>
        <div className="background-light800_dark300 mt-4 rounded-lg p-4 text-sm shadow-light-100">
          <span className="text-light400_light500">{description}</span>
        </div>
        <div className="mt-4 flex justify-between gap-3">
          <div className="flex gap-3">
            <Metric
              imgUrl="/icons/clock.svg"
              alt="clock"
              value={getTimeStamp(createdAt)}
              title=" Asked"
              textStyles="body-medium text-dark400_light800"
            />
            <Metric
              imgUrl="/icons/edit.svg"
              alt="Updated"
              value={getTimeStamp(updatedAt)}
              title=" Updated"
              textStyles="body-medium text-dark400_light800"
            />
            <Metric
              imgUrl="/icons/message.svg"
              alt="Answers"
              value={answers}
              title="Answers"
              textStyles="body-medium text-dark400_light800"
            />
            <Metric
              imgUrl="/icons/eye.svg"
              alt="Views"
              value={views}
              title="Views"
              textStyles="body-medium text-dark400_light800"
            />
          </div>
        </div>
        <div className="markdown text-dark200_light800 mt-4">{content}</div>
        <div className="background-light800_dark300 mt-4 flex flex-1 flex-wrap items-center justify-between rounded-lg px-4 py-2 shadow-light-100">
          <div className="flex flex-1 flex-wrap gap-4">{renderTagCard(tags)}</div>
          {renderEditButton(author.id)}
        </div>
      </div>
    );
  };

  return (
    <Suspense fallback={<QuestionDetailLoading />}>
      <DataRenderer
        success={success}
        data={question}
        render={renderQuestionDetail}
      />
    </Suspense>
  );
};

export default QuestionDetailPage;
