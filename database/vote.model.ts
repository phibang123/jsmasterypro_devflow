import { model, models, Schema, SchemaOptions, Types } from "mongoose";

import { schemaOptions } from "./schema.options";

export interface IVote {
  author: Types.ObjectId;
  voteId: Types.ObjectId;
  type: "Question" | "Question";
  voteType: "upVote" | "downVote";
}

const VoteSchema = new Schema<IVote>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    voteId: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, enum: ["Question", "Answer"], required: true },
    voteType: { type: String, enum: ["upVote", "downVote"], required: true },
  },
  schemaOptions as SchemaOptions<IVote>,
);

const Vote = models?.Vote || model<IVote>("Vote", VoteSchema);

export default Vote;
