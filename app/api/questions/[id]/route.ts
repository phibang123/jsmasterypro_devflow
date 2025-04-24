import mongoose from "mongoose";

import Question from "@/database/question.model";
import TagQuestion from "@/database/tag-question.model";
import Tag from "@/database/tag.model";
import handleError from "@/lib/handlers/error.handler";
import handleSuccess from "@/lib/handlers/success.handler";
import { ForbiddenError, NotFoundError } from "@/lib/http.errors";
import logger from "@/lib/logger";
import dbConnect from "@/lib/mongoose";
import { validateRequest } from "@/lib/utils";
import { CreateQuestionRequestSchemaAPI } from "@/lib/validations/api-route.validation";
import { QuestionModelIF, TagModelIF } from "@/types/model";

const findQuestionForbidden = async (
  questionId: string,
  userId: string,
  session: mongoose.ClientSession,
) => {
  const question = await Question.findById(questionId).session(session);
  if (!question) throw new NotFoundError("Question");
  if (question.author.toString() !== userId) {
    logger.error("You are not authorized to update this question");
    throw new ForbiddenError("You are not authorized to update this question");
  }

  // Populate tags and author separately
  await question.populate(["tags", "author"]);
  return question;
};

const updateQuestionForbidden = async (
  question: mongoose.Document & QuestionModelIF,
  data: Partial<ICreateQuestionParam>,
  session: mongoose.ClientSession,
) => {
  try {
    if (data.title) question.title = data.title;
    if (data.description) question.description = data.description;
    if (data.content) question.content = data.content;

    if (data.tags && data.tags?.length > 0) {
      const lowerCaseTags = data.tags.map((tag) => tag.toLowerCase());
      const currentTagNames = question.tags.map((tag) =>
        tag.name.toLowerCase(),
      );

      // Handle tags to remove
      const tagsToRemove = question.tags.filter(
        (tag) => !lowerCaseTags.includes(tag.name.toLowerCase()),
      );

      if (tagsToRemove.length) {
        const tagIdsToRemove = tagsToRemove.map(
          (tag) => (tag as TagModelIF).id,
        );

        // Batch operations for removing tags
        await Promise.all([
          TagQuestion.deleteMany(
            { question: question.id, tagId: { $in: tagIdsToRemove } },
            { session },
          ),
          Tag.updateMany(
            { _id: { $in: tagIdsToRemove }, questions: { $gt: 1 } },
            { $inc: { questions: -1 } },
            { session },
          ),
          Tag.deleteMany(
            { _id: { $in: tagIdsToRemove }, questions: { $lte: 1 } },
            { session },
          ),
        ]);

        question.tags = question.tags.filter(
          (tag) => !tagsToRemove.includes(tag),
        );
      }

      // Handle tags to add
      const tagsToAdd = lowerCaseTags.filter(
        (tag) => !currentTagNames.includes(tag),
      );

      if (tagsToAdd.length) {
        // Batch upsert operation
        const tagOperations = tagsToAdd.map((tag) => ({
          updateOne: {
            filter: { name: { $regex: new RegExp(`^${tag}$`, "i") } },
            update: {
              $inc: { questions: 1 },
              $setOnInsert: { name: tag },
            },
            upsert: true,
          },
        }));

        await Tag.bulkWrite(tagOperations, { session });

        // Get newly added tag IDs
        const newTags = await Tag.find(
          {
            name: { $in: tagsToAdd.map((tag) => new RegExp(`^${tag}$`, "i")) },
          },
          { _id: 1 },
          { session },
        );

        // Create tag-question relationships
        await TagQuestion.insertMany(
          newTags.map((tag) => ({
            question: question.id,
            tagId: tag.id,
          })),
          { session },
        );

        question.tags.push(...newTags);
      }
    }
    await question.save({ session });

    return question.populate("tags");
  } catch (error) {
    logger.error("Error processing updating question");
    throw error;
  }
};

// GET /api/questions/id
export async function GET(_: Request, { params }: RouteParams) {
  const { id } = params;
  if (!id) throw new NotFoundError("Question");
  logger.info("Getting question");
  try {
    await dbConnect();

    const question = await Question.findById(id)
      .populate({ path: "author", select: "name image id" })
      .populate({ path: "tags", select: "name" });
    if (!question) throw new NotFoundError("Question");
    logger.info("Question found");
    return handleSuccess({ data: question });
  } catch (error) {
    return handleError({ error });
  }
}

// PUT /api/questions/id
export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = params;
  if (!id) throw new NotFoundError("Question");
  const session = await mongoose.startSession();

  try {
    logger.info("Updating question");
    const [validatedData] = await Promise.all([
      validateRequest(request, CreateQuestionRequestSchemaAPI, {
        requiredAuth: true,
        partial: true,
      }),
      dbConnect(),
    ]);
    session.startTransaction();
    const question = await findQuestionForbidden(
      id,
      validatedData.userId,
      session,
    );
    const newQuestionData = await updateQuestionForbidden(
      question,
      validatedData,
      session,
    );

    await session.commitTransaction();
    logger.info("Question updated");
    return handleSuccess({ data: newQuestionData });
  } catch (error) {
    logger.error("Error updating question");
    await session.abortTransaction();
    return handleError({ error });
  } finally {
    await session.endSession();
  }
}
