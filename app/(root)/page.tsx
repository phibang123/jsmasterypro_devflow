// import Image from "next/image";

import Link from "next/link";

// import { auth } from "@/auth";
import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";

// import { auth } from "@/auth";
const questions = [
  {
    _id: "1",
    title: "The standard Lorem Ipsum passage, used since the 1500s",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    tags: [
      { _id: "1", name: "React" },
      { _id: "2", name: "Javascript" },
      { _id: "3", name: "Typescript" },
      { _id: "4", name: "Nextjs" },
      { _id: "5", name: "Tailwindcss" },
      { _id: "6", name: "Nodejs" },
    ],
    author: {
      _id: "1",
      name: "Bang Tran",
      image:
        "https://c.pxhere.com/photos/f8/ce/cat_kitten_cat_head_cat_eye-1198021.jpg!d",
    },
    upVotes: 10,
    answers: 5,
    views: 100,
    createdAt: new Date("2021-09-11"),
  },
  {
    _id: "2",
    title: "1914 translation by H. Rackham",
    description:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
    tags: [
      { _id: "1", name: "React" },
      { _id: "2", name: "Javascript" },
    ],
    author: {
      _id: "1",
      name: "Linh Tran",
      image: "https://dongvat.edu.vn/upload/2025/01/meo-cute-meme-69.webp",
    },
    upVotes: 10,
    answers: 5,
    views: 100,
    createdAt: new Date("2000-03-11"),
  },
  {
    _id: "3",
    title:
      "Section 1.10.33 of 'de Finibus Bonorum et Malorum', written by Cicero in 45 BC",
    description:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
    tags: [
      { _id: "1", name: "React" },
      { _id: "2", name: "Javascript" },
      { _id: "3", name: "Typescript" },
      { _id: "4", name: "Nextjs" },
      { _id: "5", name: "Tailwindcss" },
      { _id: "6", name: "Nodejs" },
      { _id: "7", name: "Express" },
      { _id: "8", name: "MongoDB" },
      { _id: "9", name: "PostgreSQL" },
      { _id: "10", name: "MySQL" },
      { _id: "11", name: "Redis" },
      { _id: "12", name: "Docker" },
      { _id: "13", name: "Kubernetes" },
      { _id: "14", name: "AWS" },
    ],
    author: {
      _id: "1",
      name: "Gia Đức",
      image:
        "https://cellphones.com.vn/sforum/wp-content/uploads/2024/02/avatar-anh-meo-cute-5.jpg",
    },
    upVotes: 10,
    answers: 5,
    views: 100,
    createdAt: new Date("2025-03-18"),
  },
  {
    _id: "4",
    title: "1914 translation by H. Rackham",
    description:
      "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.",
    tags: [
      { _id: "1", name: "React" },
      { _id: "2", name: "Javascript" },
      { _id: "3", name: "Typescript" },
      { _id: "4", name: "Nextjs" },
      { _id: "5", name: "Tailwindcss" },
      { _id: "6", name: "Nodejs" },
    ],
    author: {
      _id: "1",
      name: "Kona Tran",
      image:
        "https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/482857etI/anh-mo-ta.png",
    },
    upVotes: 10,
    answers: 5,
    views: 100,
    createdAt: new Date("2025-03-18"),
  },
];

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Home = async ({ searchParams }: SearchParams) => {
  // const session = await auth();

  // console.log(session);
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
        {filteredQuestions.map((question) => (
          <QuestionCard key={question._id} question={question} />
        ))}
      </div>
    </>
  );
};

export default Home;
