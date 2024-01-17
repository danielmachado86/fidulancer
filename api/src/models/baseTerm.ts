import { ObjectId } from "mongodb";
import { z } from "zod";
import { db } from "../db";

export const BaseTermInterface = z.object({
    name: z.string().min(3),
    description: z.string().min(3),
    category: z.string().min(3),
    facts: z
        .array(
            z.object({
                name: z.string().min(3),
                input_type: z.string().min(3),
                value: z.any(),
            })
        )
        .min(1),
});

export const BaseTermBaseDocument = BaseTermInterface.extend({
    _id: z.instanceof(ObjectId).default(() => new ObjectId()),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
});

export type BaseTerm = z.infer<typeof BaseTermInterface>;
export type BaseTermBaseDocument = z.infer<typeof BaseTermBaseDocument>;
export const BaseTerms = db.collection<BaseTermBaseDocument>("baseterms");
