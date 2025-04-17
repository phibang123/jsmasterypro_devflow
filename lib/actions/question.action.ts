"user server";

import handleError from "../handlers/error.handler";
import GuardGateway from "../handlers/guard.handler";
import { CreateQuestionSchemaSERVER } from "../validations/server-action.validate";

export async function createQuestion(params: ICreateQuestionParam) {
  const validationResult = await GuardGateway({
    params,
    schema: CreateQuestionSchemaSERVER,
    authorize: true,
  });

  if (validationResult instanceof Error || !validationResult.params) {
    return handleError({ error: validationResult, responseType: "server" });
  }

  //   try {
  //   } catch (error) {
  //     return handleError({ error, responseType: "server" });
  //   }
}
