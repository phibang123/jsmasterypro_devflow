// import Image from "next/image";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";

// import { auth } from "@/auth";

const Home = async () => {
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
      <section className="mt-11">LocalSearch</section>
      HomeFilter
      <div className="mt-10 flex w-full flex-col gap-6">
        <p>Question</p>
        <p></p>
        <p></p>
        <p></p>
        <p></p>
        <p></p>
      </div>
    </>
  );
};

export default Home;
