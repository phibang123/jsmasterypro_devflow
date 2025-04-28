import Link from "next/link";
import { Suspense } from "react";

import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import { getQuestions } from "@/lib/actions/question.action";
import { QuestionIF } from "@/types/global";

import HomeLoading from "./loading";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Home = async ({ searchParams }: SearchParams) => {
  const {
    query = "",
    filter = "",
    sort = "",
    page = 1,
    pageSize = 10,
  } = await searchParams;
  const {
    data: { questions },
    success,
    message,
  } = await getQuestions({
    page: parseInt(page as string),
    pageSize: parseInt(pageSize as string),
    query,
    sort,
    filter,
  });

  const renderQuestion = () => {
    if (!success) {
      return (
        <div className="mt-10 flex w-full items-center justify-center">
          <p className="text-dark400_light700">
            {message || "Something went wrong"}
          </p>
        </div>
      );
    }
    if (questions.length === 0) {
      return (
        <div className="mt-10 flex w-full items-center justify-center">
          <p className="text-dark400_light700">No questions found</p>
        </div>
      );
    }
    const filteredQuestions = questions.filter((question: QuestionIF) => {
      // Match query against the title
      console.log(question, "question");
      const matchesQuery = question.title
        .toLowerCase()
        .includes(query.toLowerCase());

      // Match filter against tags or author name, adjust logic as needed
      const matchesFilter = filter
        ? question.tags.some(
            (tag) => tag.name.toLowerCase() === filter.toLowerCase(),
          ) || question.author.name.toLowerCase() === filter.toLowerCase()
        : true; // If no filter is provided, include all questions

      return matchesQuery && matchesFilter;
    });
    return filteredQuestions.map((question: QuestionIF) => (
      <QuestionCard key={question.id} question={question} />
    ));
  };
  return (
    <Suspense fallback={<HomeLoading />}>
      <>
        <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="h1-bold text-dark100_light900">All Questions</h1>
          <Button
            asChild
            className="primary-button-gradient min-h-[40px] px-4 py-3 !text-light-900"
          >
            <Link href={ROUTES.ASK_QUESTION}>Ask a Questions</Link>
          </Button>
        </section>
        <section className="mt-8">
          <LocalSearch
            route="/"
            imgSrc="/icons/search.svg"
            placeholder="Search question..."
            otherClasses="flex-1"
          />
        </section>
        <HomeFilter />
        <div className="mt-8 flex w-full flex-col gap-6">
          {renderQuestion()}
        </div>
      </>
    </Suspense>
  );
};

export default Home;
