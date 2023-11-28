import { InferSchemaType, Schema, model } from "mongoose";

const partySchema = new Schema({
    contractId: { type: Schema.Types.ObjectId, required: true },
    owner: { type: Schema.Types.ObjectId, required: true },
    party: { type: Schema.Types.ObjectId, required: true },
    status: {
        type: string,
        enum: ["requested", "approved", "denied", "expired"],
    },
    requestDate: { type: Date },
    responseDate: { type: Date },
    expiredDate: { type: Date },
});

type partyType = InferSchemaType<typeof partySchema>;
export default model<partyType>("Party", partySchema);
