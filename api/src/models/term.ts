import { InferSchemaType, Schema, model } from "mongoose";

const termSchema = new Schema(
    {
        contractId: { type: Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        facts: [
            {
                type: {
                    name: { type: string, required: true },
                    value: { type: Schema.Types.Mixed },
                },
            },
        ],
    },
    { timestamps: true }
);

type termType = InferSchemaType<typeof termSchema>;
export default model<termType>("Term", termSchema);
