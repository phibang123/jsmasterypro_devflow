import Image from "next/image";
import Link from "next/link";
import React from "react";

import ROUTES from "@/constants/routes";

import TagCard from "../cards/TagCard";

const hotQuestions = [
  { _id: "1", title: "How to create a custom hook in React" },
  { _id: "2", title: "How to use React Query" },
  { _id: "3", title: "How to use Redux?" },
  { _id: "4", title: "How to use React Router?" },
  { _id: "5", title: "How to use React Context" },
];

const popularTags = [
  { _id: "1", name: "trello", questions: 100 },
  { _id: "2", name: "linux", questions: 200 },
  { _id: "3", name: "docker", questions: 300 },
  { _id: "4", name: "node", questions: 400 },
];

const RightSidebar = () => {
  const renderingHotQuestion = () => {
    return hotQuestions.map(({ _id, title }, index) => (
      <Link
        className="flex cursor-pointer items-center justify-between gap-7"
        key={`${index}-${_id}`}
        href={ROUTES.PROFILE(_id)}
      >
        <p className="body-medium text-dark500_light700">{title}</p>
        <Image
          src="/icons/chevron-right.svg"
          alt="Chevron"
          width={20}
          height={20}
          className="invert-colors"
        />
      </Link>
    ));
  };
  const renderingPopularTags = () => {
    return popularTags.map(({ _id, name, questions }, index) => (
      <TagCard
        key={`${index}-${_id}`}
        _id={_id}
        name={name}
        questions={questions}
        showCount
        compact
      />
    ));
  };
  return (
    <section className="custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
      {/* Top  Questions */}
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Question</h3>
      </div>
      <div className="mt-7 flex w-full flex-col gap-[30px]">
        {renderingHotQuestion()}
      </div>
      {/* Popular Tags */}
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
      </div>
      <div className="mt-7 flex w-full flex-col gap-[30px]">
        {renderingPopularTags()}
      </div>
    </section>
  );
};

export default RightSidebar;
