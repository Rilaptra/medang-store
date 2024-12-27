"use server";
import mongoose, { Mongoose } from "mongoose";
import { initModels } from "./init";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    `Please add your Mongo URI to .env.local, you mongo: ${MONGODB_URI}`
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    await initModels();
    console.log("✓ Compiled models");
    const opts = {
      bufferCommands: false,
      dbName: "medang-store",
    } as mongoose.ConnectOptions;

    cached.promise = mongoose.connect(MONGODB_URI!, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  console.log("Registered models:", mongoose.models);
  return cached.conn;
}

export default dbConnect;
