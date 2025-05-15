import mongoose, { Mongoose } from 'mongoose';

import { ENV_CONFIG } from '@/configs/env.config';
import logger from '@/lib/logger';

const MONGODB_URI = ENV_CONFIG.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined');
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const dbConnect = async (): Promise<Mongoose> => {
  if (cached.conn) {
    logger.info('Using existing mongoose connection');
    return cached.conn;
  }
  if (!cached.promise) {
    logger.info('Connecting to mongoDB');
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: 'devflow',
      })
      .then(async (result) => {
        logger.info('Connect to mongoDB');
        return result;
      })
      .catch((error) => {
        logger.error('Error connecting to MongoBD', error);
        throw new Error('Error connecting to MongoBD', error);
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
};

export default dbConnect;
