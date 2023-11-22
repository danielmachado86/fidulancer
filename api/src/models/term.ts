import { InferSchemaType, Schema, model } from "mongoose";

const termSchema = new Schema(
    {
        contractId: { type: Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
    },
    { timestamps: true }
);

type termType = InferSchemaType<typeof termSchema>;
export default model<termType>("Term", termSchema);
