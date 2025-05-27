import mongoose, { Schema, Document, Types } from "mongoose";

export interface IStudent extends Document {
    FullName: string;
    AdmissionNumber: number;
    email: string;
    phone: string;
    class: string;
    JoiningDate: Date;
    LeavingDate?: Date;
    school: Types.ObjectId;
    isVerify: boolean;
    profile?: string;
    role: string;
    password: string;
}

const studentSchema = new Schema<IStudent>(
    {
        FullName: { type: String, required: true },
        AdmissionNumber: { type: Number, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
        class: { type: String, required: true },
        JoiningDate: { type: Date, required: true },
        LeavingDate: { type: Date },
        school: { type: Schema.Types.ObjectId, ref: "School" },
        isVerify: { type: Boolean, default: false },
        profile: { type: String },
        role: { type: String, enum: ['Student'], required: true },
        password: { type: String, required: true }
    },
    { timestamps: true }
);

const Student = mongoose.model<IStudent>("Student", studentSchema);

export default Student;