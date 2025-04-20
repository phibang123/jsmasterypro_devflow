"use server";

import { constructorApi } from "../api";
import handleError from "../handlers/error.handler";
import GuardGateway from "../handlers/guard.handler";
import handleSuccess from "../handlers/success.handler";
import { AskQuestionSchema } from "../validations";

import { QuestionModelIF } from "@/types/model";

export async function createQuestion(params: ICreateQuestionParam) {
  const validationResult = await GuardGateway({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error || !validationResult.params) {
    return handleError({ error: validationResult, responseType: "server" });
  }
  const userId = validationResult.session?.user?.id!;
  const validatedData = validationResult.params;

  const question = await constructorApi.questions.create({
    ...validatedData,
    userId,
  });
  if (!question.success) {
    return handleError({ error: question.error, responseType: "server" });
  }
  return handleSuccess({ data: question.data, responseType: "server" });
}

export async function getAllQuestions(params: {
  page?: number;
  limit?: number;
}): Promise<APISuccessResponse<QuestionModelIF[]> | []> {
  const questions = await constructorApi.questions.getAll(params);
  if (!questions.success || !questions.data?.length) {
    return handleSuccess({
      data: [],
      message: "No questions found",
      responseType: "server",
    });
  }
  return handleSuccess({
    data: questions.data,
    message: "Questions fetched successfully",
    responseType: "server",
  });
}
