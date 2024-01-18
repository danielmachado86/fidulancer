import { ObjectId } from "mongodb";
import { z } from "zod";
import { db } from "../db";
import { BaseTermInterface } from "./baseTerm";

export const TermInterface = z.object({
    baseTermId: z.union([
        z
            .string()
            .min(24)
            .transform((value) => new ObjectId(value)),
        z.instanceof(ObjectId),
    ]),
});

export const TermBaseDocument = TermInterface.extend({
    _id: z.instanceof(ObjectId).default(() => new ObjectId()),
    contractId: z.instanceof(ObjectId).optional(),
    baseTerm: BaseTermInterface.optional(),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
});

export type Term = z.infer<typeof TermInterface>;
export type TermBaseDocument = z.infer<typeof TermBaseDocument>;
export const Terms = db.collection("terms");
