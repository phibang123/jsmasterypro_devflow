import { models, Schema, model, Types, SchemaOptions } from "mongoose";

import { schemaOptions } from "./schema.options";

export interface IAccount {
  userId: Types.ObjectId;
  name: string;
  image?: string;
  password?: string;
  provider: string;
  providerAccountId: string;
}

const AccountSchema = new Schema<IAccount>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    image: { type: String },
    password: { type: String },
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
  },
  schemaOptions as SchemaOptions<IAccount>,
);

const Account = models?.Account || model<IAccount>("Account", AccountSchema);

export default Account;
