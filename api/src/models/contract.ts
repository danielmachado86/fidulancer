import { InferSchemaType, Model, Schema, Types, model } from "mongoose";

// Document interface
interface Contract {
    parties: Types.ObjectId[];
    name: string;
    type?: string;
}

const contractSchema = new Schema<Contract, Model<Contract>>(
    {
        parties: {
            type: [
                {
                    type: Types.ObjectId,
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
