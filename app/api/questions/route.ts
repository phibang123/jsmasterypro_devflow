import mongoose from "mongoose";
import { z } from "zod";

import Question from "@/database/question.model";
import TagQuestion from "@/database/tag-question.model";
import Tag from "@/database/tag.model";
import "@/database/user.model";
import handleError from "@/lib/handlers/error.handler";
import handleSuccess from "@/lib/handlers/success.handler";
import logger from "@/lib/logger";
import dbConnect from "@/lib/mongoose";
import { getPaginationParams, validateRequest } from "@/lib/utils";
import { CreateQuestionRequestSchemaAPI } from "@/lib/validations";

// Types
type QuestionData = Omit<
  z.infer<typeof CreateQuestionRequestSchemaAPI>,
  "tags"
>;

const createOrUpdateTags = async (
  tags: string[],
  session: mongoose.ClientSession,
) => {
  try {
    const tagOperations = tags.map((tag) => ({
      updateOne: {
        filter: { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        update: { $inc: { questions: 1 }, $setOnInsert: { name: tag } },
        upsert: true,
      },
    }));

    await Tag.bulkWrite(tagOperations, { session });

    return Tag.find(
      { name: { $in: tags.map((tag) => new RegExp(`^${tag}$`, "i")) } },
      { _id: 1 },
      { session },
    ).distinct("_id");
  } catch (error) {
    logger.error("Error creating/updating tags:", error);
    throw error;
  }
};

const createQuestionAndTagRelations = async (
  tagIds: string[],
  { userId, title, description, content }: QuestionData,
  session: mongoose.ClientSession,
) => {
  try {
    const [question] = await Question.create(
      [{ author: userId, title, description, content, tags: tagIds }],
      { session },
    );

    await TagQuestion.create(
      tagIds.map((tagId) => ({ question: question._id, tagId })),
      { session, ordered: true },
    );

    return question.id.toString();
  } catch (error) {
    logger.error("Error creating question and tag relations:", error);
    throw error;
  }
};

// POST /api/questions
export async function POST(request: Request) {
  const session = await mongoose.startSession();

  try {
    const [validatedData] = await Promise.all([
      validateRequest(request, CreateQuestionRequestSchemaAPI, {
        requiredAuth: true,
      }),
      dbConnect(),
    ]);

    session.startTransaction();

    const { tags, ...questionData } = validatedData;
    const tagIds = await createOrUpdateTags(tags, session);
    const questionId = await createQuestionAndTagRelations(
      tagIds,
      questionData,
      session,
    );

    await session.commitTransaction();
    logger.info(`Question created successfully: ${questionId}`);

    return handleSuccess({
      message: "Question created successfully",
      data: { questionId },
    });
  } catch (error) {
    await session.abortTransaction();
    logger.error("Error creating question:", error);
    return handleError({ error });
  } finally {
    await session.endSession();
  }
}

// GET /api/questions
export async function GET(request: Request) {
  try {
    await dbConnect();
    const { skip, limit } = getPaginationParams(
      new URL(request.url).searchParams,
    );

    const questions = await Question.find()
      .populate("author", "name image")
      .populate("tags", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .then((docs) =>
        docs.map((doc) => ({
          ...doc,
          createdAt: new Date(doc.createdAt),
          updatedAt: new Date(doc.updatedAt),
        })),
      );

    return handleSuccess({
      data: questions,
      message: "Questions fetched successfully",
    });
  } catch (error) {
    logger.error("Error fetching questions:", error);
    return handleError({ error });
  }
}
