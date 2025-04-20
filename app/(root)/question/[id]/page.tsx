interface QuestionDetailsProps {
  params: { id: string };
}

const QuestionDetails = async ({ params }: QuestionDetailsProps) => {
  const { id } = params;

  return <div>Question id {id}</div>;
};

export default QuestionDetails;
