import { Schema, SchemaOptions, model, models } from "mongoose";

import { schemaOptions } from "./schema.options";

export interface ITag {
  name: string;
  questions?: number;
}

const TagSchema = new Schema<ITag>(
  {
    name: { type: Schema.Types.String, required: true },
    questions: { type: Schema.Types.Number, default: 0 },
  },
  schemaOptions as SchemaOptions<ITag>,
);

const Tag = models?.Tag || model<ITag>("Tag", TagSchema);

export default Tag;
