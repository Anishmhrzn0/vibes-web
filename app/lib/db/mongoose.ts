import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in your .env.local');
}

const globalWithMongoose = global as typeof global & {
  mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
};

let cached = globalWithMongoose.mongoose ?? { conn: null, promise: null };
globalWithMongoose.mongoose = cached;

export async function connectDb(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then(m => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}