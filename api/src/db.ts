import { MongoClient } from "mongodb";
import env from "./util/validateEnv";

export const client = new MongoClient(env.MONGO_CONNECTION_STRING);
export const db = client.db();
