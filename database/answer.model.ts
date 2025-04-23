import { model, models, Schema, SchemaOptions, Types } from "mongoose";

import { schemaOptions } from "./schema.options";

export interface IAnswer {
  author: Types.ObjectId;
  question: Types.ObjectId;
  content: string;
  upVotes?: number;
  downVotes?: number;
}

const AnswerSchema = new Schema<IAnswer>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    content: { type: String, required: true },
    upVotes: { type: Number, default: 0 },
    downVotes: { type: Number, default: 0 },
  },
  schemaOptions as SchemaOptions<IAnswer>,
);

const Answer = models.Answer || model<IAnswer>("Answer", AnswerSchema);

export default Answer;
