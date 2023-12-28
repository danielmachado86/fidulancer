import { ObjectId } from "mongodb";
import { z } from "zod";
import { db } from "../db";

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export const UserInterface = LoginSchema.extend({
    name: z.string().min(1),
});

export const UserBaseDocument = UserInterface.extend({
    _id: z.instanceof(ObjectId).default(() => new ObjectId()),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
});

// create a type for a user without the password

export type UserInterface = z.infer<typeof UserInterface>;
export type LoginSchema = z.infer<typeof LoginSchema>;
export type UserBaseDocument = z.infer<typeof UserBaseDocument>;
export const Users = db.collection<UserBaseDocument>("users");
