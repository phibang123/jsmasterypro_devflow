import Link from "next/link";
import React from "react";

import ROUTES from "@/constants/routes";
import { getTimeStamp } from "@/lib/utils";
import { QuestionIF, TagIF } from "@/types/global";

import TagCard from "./TagCard";
import Metric from "../Metric";

interface Props {
  question: QuestionIF;
}

const QuestionCard = ({
  question: {
    _id,
    title,
    tags,
    author,
    createdAt,
    upVotes,
    answers,
    views,
    description,
  },
}: Props) => {
  const renderTagCard = () => {
    return tags.map((tag: TagIF) => (
      <TagCard key={tag._id} _id={tag._id} name={tag.name} compact />
    ));
  };

  const renderMetricContent = () => {
    return (
      <div className="flex flex-grow sm:flex-col gap-2">
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
    <div className="card-wrapper background-light800_dark300 rounded-[10px] p-5 sm:px-11 flex gap-3">
      <div className="sm:flex hidden">{renderMetricContent()}</div>
      <div className="flex-1">
        <Link href={ROUTES.QUESTION(_id)}>
          <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
            {title}
          </h3>
        </Link>
        <div className="text-sm line-clamp-2 my-2">
          <span className="text-dark300_light700">{description}</span>
        </div>
        <div className="mt-4 flex w-full flex-wrap gap-2">
          {renderTagCard()}
        </div>
        <div className="flex flex-col sm:mt-0 mt-4 w-full flex-wrap">
          <div className="sm:hidden">{renderMetricContent()}</div>
          <div className="flex justify-start sm:justify-end items-center w-full flex-wrap gap-3 mt-4">
            <Metric
              imgUrl={author.image}
              alt={author.name}
              value={author.name}
              title={`• asked ${getTimeStamp(createdAt)}`}
              href={ROUTES.PROFILE(author._id)}
              textStyles="body-medium text-dark400_light700"
              isAuthor
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
