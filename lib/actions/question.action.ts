"use server";

import { QuestionModelIF } from "@/types/model";

import { constructorApi } from "../api";
import handleError from "../handlers/error.handler";
import GuardGateway from "../handlers/guard.handler";
import handleSuccess from "../handlers/success.handler";
import {
  AskQuestionSchema,
  UpdateQuestionRequestSchemaSERVER,
} from "../validations";

export async function createQuestion(params: ICreateQuestionParam) {
  try {
    const validationResult = await GuardGateway({
      params,
      schema: AskQuestionSchema,
      authorize: true,
    });
    const { session, params: validatedParams } = validationResult;

    const userId = session?.user?.id;

    const question = await constructorApi.questions.create({
      ...validatedParams!,
      userId: userId!,
    });
    return handleSuccess({ data: question.data, responseType: "server" });
  } catch (error) {
    return handleError({ error, responseType: "server" });
  }
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

export async function getQuestionById(id: string) {
  if (!id) {
    return handleError({
      error: new Error("Question ID is required"),
      responseType: "server",
    });
  }
  const question = await constructorApi.questions.getById(id);
  if (!question.success || !question.data) {
    return handleError({ error: question.error, responseType: "server" });
  }
  return handleSuccess({ data: question.data, responseType: "server" });
}

export async function editQuestion(params: IUpdateQuestionParam) {
  try {
    const validationResult = await GuardGateway({
      params,
      schema: UpdateQuestionRequestSchemaSERVER,
      authorize: true,
    });

    const { session, params: validatedParams } = validationResult;

    const userId = session?.user?.id;

    const question = await constructorApi.questions.updateById(
      params.questionId,
      {
        ...validatedParams!,
        userId: userId!,
      },
    );
    if (!question.success || !question.data) {
      return handleError({ error: question.error, responseType: "server" });
    }
    return handleSuccess({ data: question.data, responseType: "server" });
  } catch (error) {
    return handleError({ error, responseType: "server" });
  }
}
