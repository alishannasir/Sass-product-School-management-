import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IOwner extends Document {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    isVerify: boolean;
    profile?: string;
    isDeleted: boolean;
    isBlocked: boolean;
    plan: string;
    role: string;
}

const ownerSchema = new Schema<IOwner>(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
        password: { type: String, required: true },
        isVerify: { type: Boolean, default: false },
        profile: { type: String },
        isDeleted: { type: Boolean, default: false },
        isBlocked: { type: Boolean, default: false },
        plan: { type: String, default: "free" },
        role: {
            type: String,
            enum: ['Teacher', 'Owner', 'Student', 'Parent'],
            required: true
           }
    },
    { timestamps: true }
);

ownerSchema.pre("save", async function (next) {
    const owner = this as IOwner;
    if (!owner.isModified("password")) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        owner.password = await bcrypt.hash(owner.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

const Owner = mongoose.model<IOwner>("Owner", ownerSchema);
export default Owner;