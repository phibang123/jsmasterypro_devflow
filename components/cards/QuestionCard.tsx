import Link from 'next/link';
import React from 'react';

import ROUTES from '@/constants/routes';
import { getTimeStamp } from '@/lib/utils';
import { QuestionIF, TagIF } from '@/types/global';

import TagCard from './TagCard';
import Metric from '../Metric';

interface Props {
  question: QuestionIF;
}

const QuestionCard = ({
  question: { id, title, tags, author, upVotes, answers, views, description, updatedAt },
}: Props) => {
  const renderTagCard = () => {
    return tags.map((tag: TagIF) => (
      <TagCard
        key={tag.id}
        id={tag.id}
        name={tag.name}
        compact
      />
    ));
  };

  const renderMetricContent = () => {
    return (
      <div className="flex grow gap-2 sm:flex-col">
        <Metric
          imgUrl="/icons/like.svg"
          alt="Like"
          value={upVotes}
          title=" Votes"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/icons/message.svg"
          alt="Answers"
          value={answers}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/icons/eye.svg"
          alt="Eye"
          value={views}
          title=" Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
    );
  };

  return (
    <div className="card-wrapper flex gap-3 p-5 sm:px-8">
      <div className="hidden sm:flex">{renderMetricContent()}</div>
      <div className="flex-1">
        <Link href={ROUTES.QUESTION(id)}>
          <h3 className="sm:h3-semibold base-semibold text-dark200_light900 primary-text-gradient line-clamp-1 flex-1">
            {title}
          </h3>
        </Link>
        <div className="my-2 line-clamp-2 text-sm">
          <span className="text-dark300_light700">{description}</span>
        </div>

        <div className="mt-4 flex w-full flex-col flex-wrap sm:mt-0">
          <div className="mb-4 sm:hidden">{renderMetricContent()}</div>
          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <div className="flex flex-1 flex-wrap gap-2">{renderTagCard()}</div>
            <Metric
              imgUrl={author.image}
              alt={author.name}
              value={author.name}
              title={`• asked ${getTimeStamp(updatedAt)}`}
              href={ROUTES.PROFILE(author.id)}
              textStyles="body-medium text-light400_light500"
              isAuthor
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
