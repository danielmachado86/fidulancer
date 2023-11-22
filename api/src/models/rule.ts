import { InferSchemaType, Schema, model } from "mongoose";

const ruleSchema = new Schema({
    name: { type: String, required: true },
    facts: [String],
    type: { type: String, required: true },
});

type ruleType = InferSchemaType<typeof ruleSchema>;
export const Rule = model<ruleType>("Rule", ruleSchema);
