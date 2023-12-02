import { InferSchemaType, Schema, model } from "mongoose";

const partySchema = new Schema({
    contractId: { type: Schema.Types.ObjectId, required: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    role: { type: String, enum: ["owner", "party"], required: true },
    status: {
        type: String,
        enum: ["requested", "approved", "denied", "expired"],
        required: true,
    },
    requestDate: { type: Date },
    responseDate: { type: Date },
    expiredDate: { type: Date },
});

export type PartyType = InferSchemaType<typeof partySchema>;
export default model<PartyType>("Party", partySchema);
