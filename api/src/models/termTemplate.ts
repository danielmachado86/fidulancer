import { InferSchemaType, Schema, model } from "mongoose";

const termTemplateSchema = new Schema(
    {
        name: { type: String, required: true },
        facts: [
            {
                type: {
                    name: { type: string, required: true },
                    value: { type: Schema.Types.Mixed },
                },
            },
        ],
        category: { type: String },
    },
    { timestamps: true }
);

type termTemplateType = InferSchemaType<typeof termTemplateSchema>;
export default model<termTemplateType>("TermTemplate", termTemplateSchema);
