import bcrypt from "bcrypt";
import { InferSchemaType, Model, Schema, model } from "mongoose";
import { z } from "zod";

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

const SignupSchema = LoginSchema.extend({
    confirmPassword: z.string(),
});

export type UserInput = {
    email: string;
    username: string;
    password: string;
};

export type UserDocument = UserInput & {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
};

const userSchema = new Schema<UserInput, Model<UserInput>>(
    {
        email: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true, select: false },
        password: { type: String, required: true, select: false },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hashSync(this.password, salt);

    this.password = hash;

    return next();
});

type userType = InferSchemaType<typeof userSchema>;
export default model<userType>("User", userSchema);
