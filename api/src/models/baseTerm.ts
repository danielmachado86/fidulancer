import { InferSchemaType, Schema, model } from "mongoose";

const baseTermSchema = new Schema(
    {
        name: { type: String, required: true },
        facts: [
            {
                type: {
                    name: { type: String, required: true },
                    input_type: { type: String },
                    value: { type: Schema.Types.Mixed },
                    _id: false,
                },
            },
        ],
        category: { type: String },
    },
    { timestamps: true, versionKey: false }
);

type baseTermType = InferSchemaType<typeof baseTermSchema>;
export default model<baseTermType>("BaseTerm", baseTermSchema);
