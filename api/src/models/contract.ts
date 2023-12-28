import { ObjectId } from "mongodb";
import { z } from "zod";
import { db } from "../db";
import { PartyBaseDocument } from "./party";

export const ContractInterface = z.object({
    name: z.string().min(3),
    type: z.string().min(3),
});

export const ContractBaseDocument = ContractInterface.extend({
    _id: z.instanceof(ObjectId).default(() => new ObjectId()),
    parties: z.array(z.instanceof(ObjectId)).default(() => []),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
});

export const ContractDocument = ContractBaseDocument.extend({
    parties: z.array(PartyBaseDocument).min(1),
});

export type Contract = z.infer<typeof ContractInterface>;
export type ContractBaseDocument = z.infer<typeof ContractBaseDocument>;
export type ContractDocument = z.infer<typeof ContractDocument>;
export const Contracts = db.collection<ContractBaseDocument>("contracts");
