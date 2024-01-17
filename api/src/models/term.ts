import { ObjectId } from "mongodb";
import { z } from "zod";
import { db } from "../db";

export const TermInterface = z.object({
    contractId: z.union([
        z
            .string()
            .min(24)
            .transform((value) => new ObjectId(value)),
        z.instanceof(ObjectId),
    ]),
    baseTerm: z.union([
        z
            .string()
            .min(24)
            .transform((value) => new ObjectId(value)),
        z.instanceof(ObjectId),
    ]),
});

export const TermBaseDocument = TermInterface.extend({
    _id: z.instanceof(ObjectId).default(() => new ObjectId()),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
});

export type Term = z.infer<typeof TermInterface>;
export type TermBaseDocument = z.infer<typeof TermBaseDocument>;
export const Terms = db.collection<TermBaseDocument>("terms");
