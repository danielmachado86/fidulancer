import { ObjectId } from "mongodb";

declare module "express-session" {
    interface SessionData {
        userId: ObjectId;
    }
}
