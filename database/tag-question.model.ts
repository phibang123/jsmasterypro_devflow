import { model, models, Schema, SchemaOptions, Types } from "mongoose";

import { schemaOptions } from "./schema.options";

export interface ITagQuestion {
  question: Types.ObjectId;
  tagId: Types.ObjectId;
}

const TagQuestionSchema = new Schema<ITagQuestion>(
  {
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    tagId: { type: Schema.Types.ObjectId, ref: "Tag", required: true },
  },
  schemaOptions as SchemaOptions<ITagQuestion>,
);

const TagQuestion =
  models?.TagQuestion || model<ITagQuestion>("TagQuestion", TagQuestionSchema);

export default TagQuestion;
