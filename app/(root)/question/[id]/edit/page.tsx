import { Suspense } from "react";

import { auth } from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";
import { getQuestionById } from "@/lib/actions/question.action";

import EditQuestionLoading from "./loading";

const EditQuestion = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) return Error("You must be logged in to edit a question");

  const { data: question, success } = await getQuestionById(id);

  if (!question || !success || question.author.id !== session.user.id)
    return Error("Question not found");

  return (
    <Suspense fallback={<EditQuestionLoading />}>
      <div>
        <h1 className="h1-bold text-dark100_light900">Edit a question</h1>

        <div className="mt-9">
          <QuestionForm question={question} isEdit={true} />
        </div>
      </div>
    </Suspense>
  );
};

export default EditQuestion;
