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

export type User = z.infer<typeof User>;
export type LoginSchema = z.infer<typeof LoginSchema>;
export type UserWithId = WithId<User>;
export const Users = db.collection<User>("users");
