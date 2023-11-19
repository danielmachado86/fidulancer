import { Schema } from "mongoose";

const ruleSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  value: { type: Number, required: true },
});
