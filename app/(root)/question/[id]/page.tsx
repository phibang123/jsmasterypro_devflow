import { Pencil } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import NotFound from "@/app/not-found";
import { auth } from "@/auth";
import TagCard from "@/components/cards/TagCard";
import Metric from "@/components/Metric";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
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

  const session = await auth();

  const renderTagCard = () => {
    return tags.map((tag: TagIF) => (
      <TagCard key={tag._id} _id={tag._id} name={tag.name} compact />
    ));
  };

  const renderEditButton = () => {
    if (author._id !== session?.user?.id) return null;

    return (
      <Button
        asChild
        className="primary-button-gradient min-h-[20px] px-4 py-3 !text-light-900"
      >
        <Link href={ROUTES.EDIT_QUESTION(question._id)}>
          <Pencil />
          Edit Question
        </Link>
      </Button>
    );
  };

  return (
    <Suspense fallback={<QuestionDetailLoading />}>
      <div className="w-full flex-col">
        <div className="flex items-center justify-between">
          <Metric
            imgUrl={author.image}
            alt="user avatar"
            value={author.name}
            title={`•`}
            href={`/profile/${author.name}`}
            textStyles="base-semibold text-dark400_light700 !tracking-wide"
            isAuthor
          />
          <div className="flex items-center gap-3">
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
        <div className="mt-4 flex justify-between gap-3">
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
        <div className="background-light800_dark300 mt-4 flex flex-1 flex-wrap items-center justify-between rounded-lg px-4 py-2">
          <div className="flex flex-1 flex-wrap gap-4">{renderTagCard()}</div>
          {renderEditButton()}
        </div>
      </div>
    </Suspense>
  );
};

export default QuestionDetail;
