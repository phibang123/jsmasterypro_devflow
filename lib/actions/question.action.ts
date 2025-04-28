"use server";

import { PaginationSearchParamsIF } from "@/types/global";
import { QuestionModelIF } from "@/types/model";

import { constructorApi } from "../api";
import handleError from "../handlers/error.handler";
import GuardGateway from "../handlers/guard.handler";
import handleSuccess from "../handlers/success.handler";
import { validateDuplicateTags } from "../utils";
import {
  AskQuestionSchema,
  PaginationSearchParamsSchema,
  UpdateQuestionRequestSchemaSERVER,
} from "../validations";

export async function createQuestion(
  params: ICreateQuestionParam,
): ActionResponse<QuestionModelIF> {
  try {
    const validationResult = await GuardGateway({
      params,
      schema: AskQuestionSchema,
      authorize: true,
    });
    const { session, params: validatedParams } = validationResult;

    validateDuplicateTags(validatedParams?.tags);

    const userId = session?.user?.id;

    const question = await constructorApi.questions.create({
      ...validatedParams!,
      userId: userId!,
    });
    if (!question.success || !question.data) return question;
    return handleSuccess({ data: question.data, responseType: "server" });
  } catch (error) {
    return handleError({ error, responseType: "server" });
  }
}

export async function getQuestions(
  params: PaginationSearchParamsIF,
): ActionResponse<{
  questions: QuestionModelIF[];
  total: number;
  isNext: boolean;
}> {
  try {
    const validationResult = await GuardGateway({
      params,
      schema: PaginationSearchParamsSchema,
    });
    const { params: validatedParams } = validationResult;
    const questions = await constructorApi.questions.getAll(validatedParams!);
    if (!questions.success || !questions.data) return questions;
    return handleSuccess({
      data: questions.data,
      message: "Questions fetched successfully",
      responseType: "server",
    });
  } catch (error) {
    return handleError({ error, responseType: "server" });
  }
}

export async function getQuestionById(
  id: string,
): ActionResponse<QuestionModelIF> {
  try {
    if (!id) {
      return handleError({
        error: new Error("Question ID is required"),
        responseType: "server",
      });
    }
    const question = await constructorApi.questions.getById(id);
    if (!question.success || !question.data) return question;
    return handleSuccess({ data: question.data, responseType: "server" });
  } catch (error) {
    return handleError({ error, responseType: "server" });
  }
}

export async function editQuestion(
  params: IUpdateQuestionParam,
): ActionResponse<QuestionModelIF> {
  try {
    const validationResult = await GuardGateway({
      params,
      schema: UpdateQuestionRequestSchemaSERVER,
      authorize: true,
    });

    const { session, params: validatedParams } = validationResult;

    validateDuplicateTags(validatedParams?.tags);

    const userId = session?.user?.id;

    const question = await constructorApi.questions.updateById(
      params.questionId,
      {
        ...validatedParams!,
        userId: userId!,
      },
    );
    if (!question.success || !question.data) return question;
    return handleSuccess({ data: question.data, responseType: "server" });
  } catch (error) {
    return handleError({ error, responseType: "server" });
  }
}
