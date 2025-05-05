import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { auth } from '@/auth';
import QuestionForm from '@/components/forms/QuestionForm';

import AskQuestionLoading from './loading';

const AskQuestionPage = async () => {
  const session = await auth();

  if (!session?.user) return redirect('/sign-in');
  return (
    <Suspense fallback={<AskQuestionLoading />}>
      <div className="card-wrapper p-9">
        <h1 className="h1-bold text-dark100_light900">Ask a question</h1>

        <div className="mt-9">
          <QuestionForm />
        </div>
      </div>
    </Suspense>
  );
};

export default AskQuestionPage;
