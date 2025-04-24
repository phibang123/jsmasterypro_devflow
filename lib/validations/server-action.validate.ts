import { z } from "zod";

import { AskQuestionSchema } from ".";

export const CreateQuestionSchemaSERVER = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  tags: z.array(z.string()).min(1),
});

export const UpdateQuestionRequestSchemaSERVER = AskQuestionSchema.extend({
  questionId: z.string().min(1, { message: "Question ID is required." }),
});
