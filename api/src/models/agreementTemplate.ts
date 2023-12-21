import { InferSchemaType, Schema, model } from "mongoose";

const agreementTemplateSchema = new Schema(
    {
        terms: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Term",
                },
            ],
            validate: [(v: []) => Array.isArray(v) && v.length > 0],
        },
        name: { type: String, required: true },
        category: { type: String, required: true },
    },
    { timestamps: true, versionKey: false }
);

type agreementTemplateType = InferSchemaType<typeof agreementTemplateSchema>;
export default model<agreementTemplateType>(
    "AgreementTemplate",
    agreementTemplateSchema
);
