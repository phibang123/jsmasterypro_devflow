import { SchemaOptions } from "mongoose";

export const schemaOptions: SchemaOptions = {
  toJSON: {
    transform: (_doc, ret) => {
      const { _id, ...rest } = ret;
      return {
        ...(_id && { id: _id.toString() }),
        __v: ret.__v,
        ...rest,
      };
    },
  },
  toObject: {
    transform: (_doc, ret) => {
      const { _id, ...rest } = ret;
      return {
        ...(_id && { id: _id.toString() }),
        __v: ret.__v,
        ...rest,
      };
    },
  },
  timestamps: true,
};
