interface QuestionDetailsProps {
  id: string;
}

const QuestionDetails = async ({ id }: QuestionDetailsProps) => {
  return <div>Question id {id}</div>;
};

export default QuestionDetails;
