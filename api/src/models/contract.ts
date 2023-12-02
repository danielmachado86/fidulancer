import { InferSchemaType, Schema, model } from "mongoose";

const contractSchema = new Schema(
    {
        parties: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Party",
                },
            ],
            validate: [(v: []) => Array.isArray(v) && v.length > 0],
        },
        name: { type: String, required: true },
        type: { type: String },
    },
    { timestamps: true }
);

type contractType = InferSchemaType<typeof contractSchema>;
export default model<contractType>("Contract", contractSchema);
