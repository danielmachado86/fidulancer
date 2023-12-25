import { WithId } from "mongodb";
import { z } from "zod";
import { db } from "../db";

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export const User = LoginSchema.extend({
    name: z.string().min(1),
});

export const UserDocument = User.extend({
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
});

export type User = z.infer<typeof User>;
export type LoginSchema = z.infer<typeof LoginSchema>;
export type UserDocument = z.infer<typeof UserDocument>;
export type UserWithId = WithId<UserDocument>;
export const Users = db.collection<UserDocument>("users");
