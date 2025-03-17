// import Image from "next/image";

import Link from "next/link";

import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";

// import { auth } from "@/auth";
const questions = [
  {
    _id: 1,
    title: "How to learn React",
    description: "I want to learn react!",
    tags: [
      { _id: "1", name: "React" },
      { _id: "2", name: "Javascript" },
    ],
    author: { _id: "1", name: "Bang Tran" },
    upVotes: 10,
    answer: 5,
    views: 100,
    createdAt: new Date(),
  },
  {
    _id: 2,
    title: "How to learn Next",
    description: "I want to learn react!",
    tags: [
      { _id: "1", name: "React" },
      { _id: "2", name: "Javascript" },
    ],
    author: { _id: "1", name: "Bang Tran" },
    upVotes: 10,
    answer: 5,
    views: 100,
    createdAt: new Date(),
  },
  {
    _id: 3,
    title: "How to learn Nest",
    description: "I want to learn react!",
    tags: [
      { _id: "1", name: "React" },
      // { _id: "2", name: "Javascript" },
    ],
    author: { _id: "1", name: "Bang Tran" },
    upVotes: 10,
    answer: 5,
    views: 100,
    createdAt: new Date(),
  },
];

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Home = async ({ searchParams }: SearchParams) => {
  const { query = "", filter = "" } = await searchParams;

  const filteredQuestions = questions.filter((question) => {
    // Match query against the title
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
  // const session = await auth();
  // console.log(session);

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Button
          asChild
          className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900"
        >
          <Link href={ROUTES.ASK_QUESTION}>Ask a Questions</Link>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch
          route="/"
          imgSrc="/icons/search.svg"
          placeholder="Search question..."
          otherClasses="flex-1"
        />
      </section>
      <HomeFilter />
      <div className="mt-10 flex w-full flex-col gap-6">
        {filteredQuestions.map((item, index) => {
          return <h1 key={`metmoi-${index}`}>{item.title}</h1>;
        })}
      </div>
    </>
  );
};

export default Home;
