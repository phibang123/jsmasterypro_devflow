import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { ROUTES } from '@/constants';

import TagCard from '../cards/TagCard';

const hotQuestions = [
  { id: '1', title: 'How to create a custom hook in React' },
  { id: '2', title: 'How to use React Query' },
  { id: '3', title: 'How to use Redux?' },
  { id: '4', title: 'How to use React Router?' },
  { id: '5', title: 'How to use React Context' },
];

const popularTags = [
  { id: '1', name: 'trello', questions: 100 },
  { id: '2', name: 'linux', questions: 200 },
  { id: '3', name: 'docker', questions: 300 },
  { id: '4', name: 'node', questions: 400 },
];

const RightSidebar = () => {
  const renderingHotQuestion = () => {
    return hotQuestions.map(({ id, title }, index) => (
      <Link
        className="flex cursor-pointer items-center justify-between gap-7"
        key={`${index}-${id}`}
        href={ROUTES.PROFILE(id)}
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
    return popularTags.map(({ id, name, questions }, index) => (
      <TagCard
        key={`${index}-${id}`}
        id={id}
        name={name}
        questions={questions}
        showCount
        compact
      />
    ));
  };
  return (
    <section className="custom-scrollbar sticky right-0 top-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l border-none p-6 pl-0 pt-32 shadow-none max-xl:hidden sm:gap-10">
      {/* Top  Questions */}
      <div className="background-light800_dark300 shadow-light100_dark100 ml-1 rounded-lg p-6 dark:shadow-none">
        <div>
          <h3 className="h3-bold text-dark200_light900">Top Question</h3>
        </div>
        <div className="mt-7 flex w-full flex-col gap-[30px]">{renderingHotQuestion()}</div>
      </div>
      {/* Popular Tags */}
      <div className="background-light800_dark300 shadow-light100_dark100 ml-1 rounded-lg p-6 dark:shadow-none">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-7 flex w-full flex-col gap-[20px]">{renderingPopularTags()}</div>
      </div>
    </section>
  );
};

export default RightSidebar;
