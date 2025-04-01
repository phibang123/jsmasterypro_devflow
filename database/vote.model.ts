import { Document, model, models, Schema, Types } from "mongoose";

interface IVote {
  author: Types.ObjectId;
  voteId: Types.ObjectId;
  type: "Question" | "Question";
  voteType: "upVote" | "downVote";
}

export interface IVoteModel extends IVote, Document {}
const VoteSchema = new Schema<IVote>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    voteId: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, enum: ["Question", "Answer"], required: true },
    voteType: { type: String, enum: ["upVote", "downVote"], required: true },
  },
  { timestamps: true },
);

const Vote = models?.Vote || model<IVote>("Vote", VoteSchema);

export default Vote;
