import mongoose from "mongoose";
import { z } from "zod";

import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/configs/constance";
import Question from "@/database/question.model";
import TagQuestion from "@/database/tag-question.model";
import Tag from "@/database/tag.model";
import handleError from "@/lib/handlers/error.handler";
import handleSuccess from "@/lib/handlers/success.handler";
import { ValidationError } from "@/lib/http.errors";
import logger from "@/lib/logger";
import dbConnect from "@/lib/mongoose";
import { CreateQuestionRequestSchemaAPI } from "@/lib/validations";

// Types
type QuestionData = Omit<
  z.infer<typeof CreateQuestionRequestSchemaAPI>,
  "tags"
>;

// Helper functions
const getPaginationParams = (searchParams: URLSearchParams) => {
  const page = parseInt(searchParams.get("page") || String(DEFAULT_PAGE), 10);
  const limit = parseInt(
    searchParams.get("limit") || String(DEFAULT_LIMIT),
    10,
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const validateRequest = async (request: Request) => {
  try {
    const dataRequest = await request.json();
    const validatedData = CreateQuestionRequestSchemaAPI.safeParse(dataRequest);

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    return validatedData.data;
  } catch (error) {
    logger.error("Validation error:", error);
    throw error;
  }
};

const createOrUpdateTags = async (
  tags: string[],
  session: mongoose.ClientSession,
) => {
  try {
    // Prepare bulk operations for tags
    const tagOperations = tags.map((tag) => ({
      updateOne: {
        filter: { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        update: { $inc: { questions: 1 }, $setOnInsert: { name: tag } },
        upsert: true,
      },
    }));

    // Execute bulk operations
    await Tag.bulkWrite(tagOperations, { session });

    // Get all tag IDs
    const tagIds = await Tag.find(
      { name: { $in: tags.map((tag) => new RegExp(`^${tag}$`, "i")) } },
      { _id: 1 },
      { session },
    ).distinct("_id");

    return tagIds;
  } catch (error) {
    logger.error("Error creating/updating tags:", error);
    throw error;
  }
};

const createQuestionAndTagRelations = async (
  tagIds: string[],
  questionData: QuestionData,
  session: mongoose.ClientSession,
) => {
  try {
    const { userId, title, description, content } = questionData;

    // Create question
    const [question] = await Question.create(
      [{ author: userId, title, description, content, tags: tagIds }],
      { session },
    );

    // Create TagQuestion documents
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

// Route handlers
export async function POST(request: Request) {
  const session = await mongoose.startSession();

  try {
    const validatedData = await validateRequest(request);
    await dbConnect();

    const { tags, ...questionData } = validatedData;

    session.startTransaction();

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
    session.endSession();
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const { skip, limit } = getPaginationParams(searchParams);

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
