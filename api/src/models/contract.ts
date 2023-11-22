import { InferSchemaType, Schema, model } from "mongoose";

const contractSchema = new Schema(
    {
        owner: { type: Schema.Types.ObjectId, required: true },
        parties: [{ type: Schema.Types.ObjectId }],
        type: { type: String },
    },
    { timestamps: true }
);

type contractType = InferSchemaType<typeof contractSchema>;
export default model<contractType>("Contract", contractSchema);
