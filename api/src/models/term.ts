import { InferSchemaType, Schema, model } from "mongoose";

const termSchema = new Schema(
    {
        contractId: { type: Schema.Types.ObjectId, required: true },
        baseTermId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "BaseTerm",
        },
    },
    { timestamps: true }
);

type termType = InferSchemaType<typeof termSchema>;
export default model<termType>("Term", termSchema);
