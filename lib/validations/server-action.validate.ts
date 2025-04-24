import { z } from "zod";

export const CreateQuestionSchemaSERVER = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  tags: z.array(z.string()).min(1),
});

export const UpdateQuestionRequestSchemaSERVER = z.object({
  title: z
    .string()
    .min(5, { message: "Title is required!" })
    .max(200, { message: "Title cannot exceed 100 characters." }),

  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters!" })
    .max(200, { message: "Description cannot exceed 500 characters." }),

  content: z.string().min(1, { message: "Body is required!" }),

  tags: z
    .array(
      z
        .string()
        .min(1, { message: "Tag is required." })
        .max(30, { message: "Tag cannot exceed 30 characters." }),
    )
    .min(1, { message: "At least one tag is required." })
    .max(3, { message: "Cannot add more than 3 tags" }),
  questionId: z.string().min(1, { message: "Question ID is required." }),
});
