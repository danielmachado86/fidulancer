import { ObjectId } from "mongodb";
import { z } from "zod";
import { db } from "../db";

export const PartyInterface = z.object({
    userId: z.union([
        z
            .string()
            .min(24)
            .transform((value) => new ObjectId(value)),
        z.instanceof(ObjectId),
    ]),
});

export const Party = PartyInterface.extend({
    role: z.enum(["owner", "party"]).default("party"),
    status: z
        .enum(["requested", "approved", "denied", "expired"])
        .default("requested"),
    requestDate: z.date().default(() => new Date()),
    responseDate: z.date().optional(),
    expiredDate: z.date().optional(),
});

export const PartyBaseDocument = Party.extend({
    _id: z.instanceof(ObjectId).default(() => new ObjectId()),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
});

export type PartyInterface = z.infer<typeof PartyInterface>;
export type Party = z.infer<typeof Party>;
export type PartyBaseDocument = z.infer<typeof PartyBaseDocument>;
export const Parties = db.collection<PartyBaseDocument>("parties");
