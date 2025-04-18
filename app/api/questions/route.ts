import mongoose from "mongoose";

import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import handleError from "@/lib/handlers/error.handler";
import { ValidationError } from "@/lib/http.errors";
import dbConnect from "@/lib/mongoose";
import logger from "@/lib/logger";
import { CreateQuestionRequestSchemaAPI } from "@/lib/validations";

export async function POST(request: Request) {
  const session = await mongoose.startSession();
  // session.startTransaction();

  // try {
  //   const validatedData = await validationRequest(request);
  //   await dbConnect();

  //   const { userId, title, content, tags } = validatedData;

  //   // Create question
  //   const [question] = await Question.create(
  //     [{ author: userId, title, content }],
  //     { session },
  //   );

  //   // Prepare bulk operations for tags
  //   const tagOperations = tags.map((tag) => ({
  //     updateOne: {
  //       filter: { name: { $regex: new RegExp(`^${tag}$`, "i") } },
  //       update: {
  //         $setOnInsert: { name: tag },
  //         $inc: { questions: 1 },
  //       },
  //       upsert: true,
  //     },
  //   }));

  //   // Execute bulk operations
  //   const tagResults = await Tag.bulkWrite(tagOperations, { session });

  //   // Get all tag IDs
  //   const tagIds = await Tag.find(
  //     { name: { $in: tags.map((tag) => new RegExp(`^${tag}$`, "i")) } },
  //     { _id: 1 },
  //     { session },
  //   ).distinct("_id");

  //   // Update question with tag IDs
  //   await Question.findByIdAndUpdate(
  //     question._id,
  //     { $set: { tags: tagIds } },
  //     { session },
  //   );

  //   await session.commitTransaction();
  //   logger.info(`Question created successfully: ${question._id}`);

  //   return new Response(JSON.stringify(question), {
  //     status: 201,
  //     headers: { "Content-Type": "application/json" },
  //   });
  // } catch (error) {
  //   await session.abortTransaction();
  //   logger.error("Error creating question:", error);
  //   return handleError({ error });
  // } finally {
  //   session.endSession();
  // }
}

const validationRequest = async function (request: Request) {
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
