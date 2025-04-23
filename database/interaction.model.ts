import { model, models, Schema, SchemaOptions, Types } from "mongoose";

import { schemaOptions } from "./schema.options";

export interface IInteraction {
  user: Types.ObjectId;
  action: string;
  actionId: Types.ObjectId;
  actionType: "Question" | "Answer" | "User";
}

const InteractionSchema = new Schema<IInteraction>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    actionId: { type: Schema.Types.ObjectId, required: true },
    actionType: {
      type: String,
      enum: ["Question", "Answer"],
      required: true,
    },
  },
  schemaOptions as SchemaOptions<IInteraction>,
);

const Interaction =
  models?.Interaction || model<IInteraction>("Interaction", InteractionSchema);

export default Interaction;
