import { Suspense } from "react";

import NotFound from "@/app/not-found";
import TagCard from "@/components/cards/TagCard";
import Metric from "@/components/Metric";

import { getQuestionById } from "@/lib/actions/question.action";
import { getTimeStamp } from "@/lib/utils";
import { TagIF } from "@/types/global";

import QuestionDetailLoading from "./loading";

const QuestionDetail = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const { data: question } = await getQuestionById(id);
  if (!question) return NotFound();
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
  } = question;

  const renderTagCard = () => {
    return tags.map((tag: TagIF) => (
      <TagCard key={tag._id} _id={tag._id} name={tag.name} compact />
    ));
  };

  return (
    <Suspense fallback={<QuestionDetailLoading />}>
      <div className="flex-col w-full">
        <div className="flex justify-between items-center">
          <Metric
            imgUrl={author.image}
            alt="user avatar"
            value={author.name}
            title={``}
            href={`/profile/${author.name}`}
            textStyles="body-medium text-dark400_light700"
            isAuthor
          />
          <div className="flex gap-3">
            <Metric
              imgUrl="/icons/upvote.svg"
              alt="upVotes"
              value={upVotes}
              title={``}
              href={`/profile/${author.name}`}
              textStyles="body-medium text-dark400_light700"
            />
            <Metric
              imgUrl="/icons/downvote.svg"
              alt="downVotes"
              value={downVotes}
              title={``}
              href={`/profile/${author.name}`}
              textStyles="body-medium text-dark400_light700"
            />
          </div>
        </div>
        <h1 className="sm:h1-bold base-semibold text-dark200_light900 primary-text-gradient mt-4 !tracking-wide">
          {title}
        </h1>
        <div className="flex justify-s gap-3 mt-4">
          <div className="flex gap-3">
            <Metric
              imgUrl="/icons/clock.svg"
              alt="clock"
              value=""
              title={getTimeStamp(createdAt)}
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
        <div className="flex gap-2 flex-wrap flex-1 mt-4">
          {renderTagCard()}
        </div>
      </div>
    </Suspense>
  );
};

export default QuestionDetail;
