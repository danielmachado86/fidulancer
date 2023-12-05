import { InferSchemaType, Schema, model } from "mongoose";

export const FactSchema = new Schema({
    contractId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    value: { type: Schema.Types.Mixed, required: true },
    unit: { type: String },
});

type factType = InferSchemaType<typeof FactSchema>;
export default model<factType>("Fact", FactSchema);
