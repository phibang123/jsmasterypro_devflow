import Image from "next/image";
import Link from "next/link";
import { getTimeStamp } from "@/lib/utils";
import Metric from "@/components/Metric";

interface Props {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

const QuestionDetail = ({ params }: Props) => {
  // TODO: Fetch actual question data
  const mockQuestion = {
    title: "How to refresh all the data inside the Datatable",
    author: {
      name: "Satheesh",
      picture: "/assets/icons/avatar.svg",
    },
    createdAt: new Date("2024-01-20"),
    upvotes: 12,
    views: 5200,
    answers: 900,
    content: `When the user clicks a button for the first time, a spinner is displayed, the "close" button is disabled, and a modal popup is shown. When the user clicks on a table displayed within the modal popup, the table loads data.

When the user closes the popup by clicking the "close" button, and then clicks the same button again without refreshing the page, the data in the table should be the same as it was before.

I need it so that when the user clicks the button, any changes made stay in place even after closing and reopening the popup.`,
  };

  return (
    <div className="flex-col w-full">
      <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h1 className="h1-bold text-dark100_light900">{mockQuestion.title}</h1>
      </div>

      <div className="mt-5 flex flex-col-reverse justify-between gap-5 sm:flex-row">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col-reverse gap-6">
            <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
              <div className="flex flex-wrap gap-4">
                <Metric
                  imgUrl={mockQuestion.author.picture}
                  alt="user avatar"
                  value={mockQuestion.author.name}
                  title={`• asked ${getTimeStamp(mockQuestion.createdAt)}`}
                  href={`/profile/${mockQuestion.author.name}`}
                  textStyles="body-medium text-dark400_light700"
                  isAuthor
                />
              </div>

              <div className="flex justify-end gap-3">
                <div className="flex gap-3">
                  <Metric
                    imgUrl="/assets/icons/like.svg"
                    alt="Upvotes"
                    value={mockQuestion.upvotes}
                    title="Votes"
                    textStyles="small-medium text-dark400_light800"
                  />
                  <Metric
                    imgUrl="/assets/icons/message.svg"
                    alt="Answers"
                    value={mockQuestion.answers}
                    title="Answers"
                    textStyles="small-medium text-dark400_light800"
                  />
                  <Metric
                    imgUrl="/assets/icons/eye.svg"
                    alt="Views"
                    value={mockQuestion.views}
                    title="Views"
                    textStyles="small-medium text-dark400_light800"
                  />
                </div>
              </div>
            </div>

            <div className="markdown text-dark200_light800">
              {mockQuestion.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;
