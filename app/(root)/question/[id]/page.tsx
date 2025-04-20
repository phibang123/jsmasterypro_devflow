export default async function QuestionDetails({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  return <div>Question id {id}</div>;
}
