import { model, models, Schema } from "mongoose";

interface ITag {
  name: string;
  questions?: number;
}

const TagSchema = new Schema<ITag>(
  {
    name: { type: Schema.Types.String, required: true },
    questions: { type: Schema.Types.Number, default: 0 },
  },
  { timestamps: true },
);

const Tag = models?.Tag && model<ITag>("Tag", TagSchema);

export default Tag;
