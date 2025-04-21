import Question from "@/database/question.model";
import handleError from "@/lib/handlers/error.handler";
import handleSuccess from "@/lib/handlers/success.handler";
import { NotFoundError } from "@/lib/http.errors";
import dbConnect from "@/lib/mongoose";

// GET /api/questions/id
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) throw new NotFoundError("Question");

  try {
    await dbConnect();

    const question = await Question.findById(id)
      .populate("author", "name image _id")
      .populate("tags", "name");
    if (!question) throw new NotFoundError("Question");
    return handleSuccess({ data: question });
  } catch (error) {
    return handleError({ error });
  }
}
