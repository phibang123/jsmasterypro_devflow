import { SchemaOptions } from "mongoose";

export const schemaOptions: SchemaOptions = {
  toJSON: {
    transform: (_doc, ret) => {
      const { _id, ...rest } = ret;
      return {
        id: _id.toString(),
        createdAt: ret.createdAt.toISOString(),
        updatedAt: ret.updatedAt.toISOString(),
        __v: ret.__v,
        ...rest,
      };
    },
  },
  toObject: {
    transform: (_doc, ret) => {
      const { _id, ...rest } = ret;
      return {
        id: _id.toString(),
        createdAt: ret.createdAt.toISOString(),
        updatedAt: ret.updatedAt.toISOString(),
        __v: ret.__v,
        ...rest,
      };
    },
  },
  timestamps: true,
};
