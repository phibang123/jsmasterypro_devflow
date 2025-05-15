import { model, models, Schema, SchemaOptions, Types } from 'mongoose';

import { schemaOptions } from './schema.options';

export interface ICollection {
  author: Types.ObjectId;
  question: Types.ObjectId;
}

const CollectionSchema = new Schema<ICollection>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  },
  schemaOptions as SchemaOptions<ICollection>,
);

const Collection = models?.Collection || model<ICollection>('Collection', CollectionSchema);

export default Collection;
