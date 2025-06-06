import { model, models, Schema, Types, SchemaOptions } from 'mongoose';

import { schemaOptions } from './schema.options';

export interface IQuestion {
  title: string;
  description: string;
  content: string;
  tags: Types.ObjectId[];
  views?: number;
  answers?: number;
  upVotes?: number;
  downVotes?: number;
  author: Types.ObjectId;
  answerer?: Types.ObjectId;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    views: { type: Number, default: 0 },
    answers: { type: Number, default: 0 },
    upVotes: { type: Number, default: 0 },
    downVotes: { type: Number, default: 0 },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    answerer: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  schemaOptions as SchemaOptions<IQuestion>,
);

const Question = models?.Question || model<IQuestion>('Question', QuestionSchema);

export default Question;
